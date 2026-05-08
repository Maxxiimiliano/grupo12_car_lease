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

  const office = await prisma.office.update({
    where: { id },
    data: {
      name: data.name,
      address: data.address,
      city: data.city,
      phone: data.phone,
      email: data.email,
      lat: parseFloat(data.lat),
      lng: parseFloat(data.lng),
    },
  });
  return NextResponse.json(office);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await assertAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const vehicleCount = await prisma.vehicle.count({ where: { officeId: id } });
  if (vehicleCount > 0) {
    return NextResponse.json(
      { error: `No se puede eliminar: hay ${vehicleCount} vehículo(s) asignado(s) a esta oficina.` },
      { status: 409 }
    );
  }

  await prisma.office.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
