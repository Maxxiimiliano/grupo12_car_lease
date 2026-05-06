import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { reservationId } = await req.json();

  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: { vehicle: true },
  });

  if (!reservation || reservation.userId !== userId) {
    return NextResponse.json({ error: "Reserva no encontrada." }, { status: 404 });
  }
  if (reservation.status === "CONFIRMED") {
    return NextResponse.json({ error: "La reserva ya está confirmada." }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: `${reservation.vehicle.brand} ${reservation.vehicle.model}`,
            description: `Reserva CarLease · ${reservation.startDate.toLocaleDateString("es-ES")} – ${reservation.endDate.toLocaleDateString("es-ES")}`,
          },
          unit_amount: Math.round(Number(reservation.totalPrice) * 100),
        },
        quantity: 1,
      },
    ],
    metadata: { reservationId: reservation.id },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/${reservation.id}`,
  });

  return NextResponse.json({ sessionId: session.id, url: session.url });
}
