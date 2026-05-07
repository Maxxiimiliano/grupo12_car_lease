import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendReservationConfirmation } from "@/lib/email";
import { formatCurrency, formatDate } from "@/lib/utils";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const type = session.metadata?.type;
    const vehicleId = session.metadata?.vehicleId;
    const reservationId = session.metadata?.reservationId;

    if (type === "purchase" && vehicleId) {
      await prisma.vehicle.update({
        where: { id: vehicleId },
        data: { forSale: false, available: false },
      });
    } else if (reservationId) {
      const reservation = await prisma.reservation.update({
        where: { id: reservationId },
        data: { status: "CONFIRMED" },
        include: { vehicle: true, user: true },
      });

      await prisma.payment.upsert({
        where: { reservationId },
        create: {
          reservationId,
          stripePaymentId: session.payment_intent as string ?? session.id,
          amount: session.amount_total ? session.amount_total / 100 : 0,
          currency: session.currency ?? "eur",
          status: "SUCCESS",
          paidAt: new Date(),
        },
        update: { status: "SUCCESS", paidAt: new Date() },
      });

      if (reservation.user.email) {
        await sendReservationConfirmation({
          to: reservation.user.email,
          customerName: reservation.user.name ?? reservation.user.email,
          vehicleName: `${reservation.vehicle.brand} ${reservation.vehicle.model}`,
          startDate: formatDate(reservation.startDate),
          endDate: formatDate(reservation.endDate),
          totalPrice: formatCurrency(Number(reservation.totalPrice)),
          reservationId: reservation.id,
        }).catch(() => {}); // don't fail the webhook if email errors
      }
    }
  }

  return NextResponse.json({ received: true });
}
