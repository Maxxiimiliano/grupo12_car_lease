import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendVisitRequest } from "@/lib/email";

export async function POST(req: Request) {
  const { vehicleId, officeId, name: customerName, email: customerEmail, phone: customerPhone, preferredDate, message } =
    await req.json();

  if (!vehicleId || !officeId || !customerName || !customerEmail || !customerPhone || !preferredDate) {
    return NextResponse.json({ error: "Faltan campos obligatorios." }, { status: 400 });
  }

  const [vehicle, office] = await Promise.all([
    prisma.vehicle.findUnique({ where: { id: vehicleId, forSale: true } }),
    prisma.office.findUnique({ where: { id: officeId } }),
  ]);

  if (!vehicle) return NextResponse.json({ error: "Vehículo no encontrado." }, { status: 404 });
  if (!office) return NextResponse.json({ error: "Oficina no encontrada." }, { status: 404 });

  await sendVisitRequest({
    vehicleName: `${vehicle.brand} ${vehicle.model} (${vehicle.year})`,
    vehicleId,
    officeName: office.name,
    officeAddress: `${office.address}, ${office.city}`,
    customerName,
    customerEmail,
    customerPhone,
    preferredDate,
    message,
  });

  return NextResponse.json({ ok: true });
}
