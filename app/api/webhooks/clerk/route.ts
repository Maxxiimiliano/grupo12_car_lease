import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const payload = await req.json();
  const { type, data } = payload;

  if (type === "user.created" || type === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url } = data;
    const email = email_addresses?.[0]?.email_address ?? "";
    const name = [first_name, last_name].filter(Boolean).join(" ") || null;

    await prisma.user.upsert({
      where: { id },
      create: { id, email, name, avatarUrl: image_url ?? null },
      update: { email, name, avatarUrl: image_url ?? null },
    });
  }

  if (type === "user.deleted") {
    const { id } = data;
    await prisma.user.deleteMany({ where: { id } });
  }

  return NextResponse.json({ received: true });
}
