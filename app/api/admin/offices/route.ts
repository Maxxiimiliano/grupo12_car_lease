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
  const offices = await prisma.office.findMany({ orderBy: { city: "asc" } });
  return NextResponse.json(offices);
}

export async function POST(req: Request) {
  if (!(await assertAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const data = await req.json();
  const office = await prisma.office.create({
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
  return NextResponse.json(office, { status: 201 });
}
