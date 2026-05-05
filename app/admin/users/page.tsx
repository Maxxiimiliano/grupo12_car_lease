import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: { _count: { select: { reservations: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Usuario</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Rol</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Reservas</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Registrado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{u.name ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <Badge variant={u.role === "ADMIN" ? "default" : "secondary"}>
                      {u.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{u._count.reservations}</td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(u.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
