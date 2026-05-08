import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const offices = await prisma.office.findMany({ orderBy: { city: "asc" } });
  return NextResponse.json(offices);
}
