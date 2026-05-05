import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  if (!vehicle) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(vehicle);
}
