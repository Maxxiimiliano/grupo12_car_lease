import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import AdminReservationCancelButton from "@/components/admin/AdminReservationCancelButton";
import { ReservationStatus } from "@/app/generated/prisma";

const statusMap = {
  PENDING: { label: "Pendiente", variant: "warning" as const },
  CONFIRMED: { label: "Confirmada", variant: "success" as const },
  CANCELLED: { label: "Cancelada", variant: "destructive" as const },
};

const tabs = [
  { label: "Todas", value: "" },
  { label: "Pendientes", value: "PENDING" },
  { label: "Confirmadas", value: "CONFIRMED" },
  { label: "Canceladas", value: "CANCELLED" },
];

export default async function AdminReservationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  const where = status ? { status: status as ReservationStatus } : {};

  const reservations = await prisma.reservation.findMany({
    where,
    include: {
      user: { select: { name: true, email: true } },
      vehicle: { select: { brand: true, model: true, year: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Reservas</h1>

      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
        {tabs.map((tab) => (
          <Link
            key={tab.value}
            href={tab.value ? `/admin/reservations?status=${tab.value}` : "/admin/reservations"}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              (status ?? "") === tab.value
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Vehículo</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Cliente</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Fechas</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Total</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Estado</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reservations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400 text-sm">
                    No hay reservas{status ? ` con estado "${statusMap[status as ReservationStatus]?.label}"` : ""}.
                  </td>
                </tr>
              ) : (
                reservations.map((r) => {
                  const { label, variant } = statusMap[r.status];
                  return (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {r.vehicle.brand} {r.vehicle.model}{" "}
                        <span className="text-gray-400 font-normal">({r.vehicle.year})</span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-900">{r.user.name ?? "—"}</p>
                        <p className="text-xs text-gray-400">{r.user.email}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">
                        {formatDate(r.startDate)} → {formatDate(r.endDate)}
                      </td>
                      <td className="px-4 py-3 font-medium">{formatCurrency(Number(r.totalPrice))}</td>
                      <td className="px-4 py-3">
                        <Badge variant={variant}>{label}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {r.status !== "CANCELLED" && (
                          <AdminReservationCancelButton reservationId={r.id} />
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-gray-400">Mostrando hasta 100 reservas</p>
    </div>
  );
}
