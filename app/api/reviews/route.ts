import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { reservationId, vehicleId, rating, comment } = await req.json();

  if (!reservationId || !vehicleId || !rating) {
    return NextResponse.json({ error: "Faltan campos requeridos." }, { status: 400 });
  }
  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: "La puntuación debe estar entre 1 y 5." }, { status: 400 });
  }

  const reservation = await prisma.reservation.findUnique({ where: { id: reservationId } });
  if (!reservation || reservation.userId !== userId || reservation.status !== "CONFIRMED") {
    return NextResponse.json({ error: "No se puede valorar esta reserva." }, { status: 403 });
  }

  const review = await prisma.review.create({
    data: { userId, vehicleId, reservationId, rating, comment: comment || null },
  });

  return NextResponse.json(review, { status: 201 });
}
