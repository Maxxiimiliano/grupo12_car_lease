import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Car, CreditCard, TrendingUp, Users } from "lucide-react";

export default async function AdminDashboard() {
  const [totalVehicles, totalUsers, reservations, payments] = await Promise.all([
    prisma.vehicle.count(),
    prisma.user.count(),
    prisma.reservation.findMany({ where: { status: { not: "CANCELLED" } } }),
    prisma.payment.findMany({ where: { status: "SUCCESS" } }),
  ]);

  const totalRevenue = payments.reduce((s, p) => s + Number(p.amount), 0);
  const confirmedReservations = reservations.filter((r) => r.status === "CONFIRMED").length;

  const recentReservations = await prisma.reservation.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
    include: { user: { select: { name: true } }, vehicle: { select: { brand: true, model: true } } },
  });

  const metrics = [
    { title: "Vehículos", value: totalVehicles, icon: Car, color: "text-blue-600" },
    { title: "Usuarios", value: totalUsers, icon: Users, color: "text-purple-600" },
    { title: "Reservas confirmadas", value: confirmedReservations, icon: TrendingUp, color: "text-green-600" },
    { title: "Ingresos totales", value: formatCurrency(totalRevenue), icon: CreditCard, color: "text-yellow-600" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map(({ title, value, icon: Icon, color }) => (
          <Card key={title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
              <Icon className={`h-4 w-4 ${color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Reservas recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500">
                  <th className="pb-2 font-medium">Cliente</th>
                  <th className="pb-2 font-medium">Vehículo</th>
                  <th className="pb-2 font-medium">Estado</th>
                  <th className="pb-2 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentReservations.map((r) => (
                  <tr key={r.id} className="py-2">
                    <td className="py-2 text-gray-700">{r.user.name ?? "—"}</td>
                    <td className="py-2 text-gray-700">{r.vehicle.brand} {r.vehicle.model}</td>
                    <td className="py-2">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        r.status === "CONFIRMED" ? "bg-green-100 text-green-700"
                        : r.status === "CANCELLED" ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {r.status === "CONFIRMED" ? "Confirmada" : r.status === "CANCELLED" ? "Cancelada" : "Pendiente"}
                      </span>
                    </td>
                    <td className="py-2 text-right font-medium">{formatCurrency(Number(r.totalPrice))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
