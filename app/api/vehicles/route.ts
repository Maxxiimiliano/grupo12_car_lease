import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const where: Record<string, unknown> = {};

  if (searchParams.get("category")) where.category = searchParams.get("category");
  if (searchParams.get("fuelType")) where.fuelType = searchParams.get("fuelType");
  if (searchParams.get("transmission")) where.transmission = searchParams.get("transmission");
  if (searchParams.get("maxPrice")) where.pricePerDay = { lte: parseFloat(searchParams.get("maxPrice")!) };
  if (searchParams.get("available") === "true") where.available = true;

  const vehicles = await prisma.vehicle.findMany({ where, orderBy: { pricePerDay: "asc" } });
  return NextResponse.json(vehicles);
}
