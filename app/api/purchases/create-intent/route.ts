import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { vehicleId } = await req.json();

  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle || !vehicle.forSale || !vehicle.salePrice) {
    return NextResponse.json({ error: "Vehículo no disponible para compra." }, { status: 404 });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: `Compra · ${vehicle.brand} ${vehicle.model} (${vehicle.year})`,
            description: `${vehicle.mileage.toLocaleString("es-ES")} km · ${vehicle.fuelType} · ${vehicle.transmission}`,
          },
          unit_amount: Math.round(Number(vehicle.salePrice) * 100),
        },
        quantity: 1,
      },
    ],
    metadata: { type: "purchase", vehicleId: vehicle.id, buyerId: userId },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/sale/${vehicle.id}`,
  });

  return NextResponse.json({ url: session.url });
}
