import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

async function assertAdmin() {
  const { userId, sessionClaims } = await auth();
  if (!userId) return false;
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  return role === "admin";
}

export async function GET() {
  if (!(await assertAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const vehicles = await prisma.vehicle.findMany({ orderBy: { brand: "asc" } });
  return NextResponse.json(vehicles);
}

export async function POST(req: Request) {
  if (!(await assertAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const data = await req.json();
  const vehicle = await prisma.vehicle.create({
    data: {
      brand: data.brand, model: data.model, year: data.year,
      pricePerDay: data.pricePerDay, category: data.category,
      fuelType: data.fuelType, transmission: data.transmission,
      seats: data.seats, available: data.available ?? true,
      description: data.description, imageUrl: data.imageUrl ?? "",
    },
  });
  return NextResponse.json(vehicle, { status: 201 });
}
