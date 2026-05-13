import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const reservations = await prisma.reservation.findMany({
    where: { vehicleId: id, status: { in: ["CONFIRMED", "PENDING"] } },
    select: { startDate: true, endDate: true },
  });

  return NextResponse.json(reservations);
}
