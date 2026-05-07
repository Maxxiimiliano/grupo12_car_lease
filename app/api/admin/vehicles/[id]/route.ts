import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

async function assertAdmin() {
  const { userId, sessionClaims } = await auth();
  if (!userId) return false;
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  return role === "admin";
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await assertAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const data = await req.json();

  const vehicle = await prisma.vehicle.update({
    where: { id },
    data: {
      brand: data.brand, model: data.model, year: data.year,
      pricePerDay: data.pricePerDay, category: data.category,
      fuelType: data.fuelType, transmission: data.transmission,
      seats: data.seats, available: data.available,
      description: data.description, imageUrl: data.imageUrl,
      mileage: data.mileage ?? 0,
      forSale: data.forSale ?? false,
      salePrice: data.forSale && data.salePrice ? data.salePrice : null,
    },
  });
  return NextResponse.json(vehicle);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await assertAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;

  const activeReservation = await prisma.reservation.findFirst({
    where: { vehicleId: id, status: { in: ["PENDING", "CONFIRMED"] } },
  });
  if (activeReservation) {
    return NextResponse.json({ error: "No se puede eliminar un vehículo con reservas activas." }, { status: 409 });
  }

  await prisma.vehicle.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
