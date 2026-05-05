import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

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
    const reservationId = session.metadata?.reservationId;

    if (reservationId) {
      await prisma.reservation.update({
        where: { id: reservationId },
        data: { status: "CONFIRMED" },
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
    }
  }

  return NextResponse.json({ received: true });
}
