import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

async function assertAdmin() {
  const { userId, sessionClaims } = await auth();
  if (!userId) return false;
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  return role === "admin";
}

export async function PATCH(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await assertAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

  const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";

  const client = await clerkClient();
  await client.users.updateUser(id, {
    publicMetadata: { role: newRole === "ADMIN" ? "admin" : null },
  });

  const updated = await prisma.user.update({
    where: { id },
    data: { role: newRole },
  });

  return NextResponse.json(updated);
}
