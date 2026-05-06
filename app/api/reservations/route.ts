import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { diffInDays } from "@/lib/utils";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const reservations = await prisma.reservation.findMany({
    where: { userId },
    include: { vehicle: true, reviews: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(reservations);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { vehicleId, startDate, endDate } = await req.json();

  if (!vehicleId || !startDate || !endDate) {
    return NextResponse.json({ error: "Faltan campos requeridos." }, { status: 400 });
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start >= end) {
    return NextResponse.json({ error: "Fecha fin debe ser posterior a fecha inicio." }, { status: 400 });
  }

  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle || !vehicle.available) {
    return NextResponse.json({ error: "Vehículo no disponible." }, { status: 400 });
  }

  // Check for overlapping reservations
  const conflict = await prisma.reservation.findFirst({
    where: {
      vehicleId,
      status: { not: "CANCELLED" },
      AND: [{ startDate: { lt: end } }, { endDate: { gt: start } }],
    },
  });
  if (conflict) {
    return NextResponse.json({ error: "El vehículo ya está reservado en esas fechas." }, { status: 409 });
  }

  const days = diffInDays(start, end);
  const totalPrice = days * Number(vehicle.pricePerDay);

  // Ensure user exists in our DB — fetch real data from Clerk if not yet synced
  const clerkUser = await (await clerkClient()).users.getUser(userId);
  const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";
  const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null;
  await prisma.user.upsert({
    where: { id: userId },
    create: { id: userId, email, name, avatarUrl: clerkUser.imageUrl ?? null },
    update: { email, name, avatarUrl: clerkUser.imageUrl ?? null },
  });

  const reservation = await prisma.reservation.create({
    data: { userId, vehicleId, startDate: start, endDate: end, totalPrice, status: "PENDING" },
  });

  return NextResponse.json(reservation, { status: 201 });
}
