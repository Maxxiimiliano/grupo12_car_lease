import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const reservation = await prisma.reservation.findUnique({ where: { id } });

  if (!reservation) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (reservation.userId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.reservation.update({ where: { id }, data: { status: "CANCELLED" } });
  return NextResponse.json({ ok: true });
}
