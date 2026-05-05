import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import ReviewDialog from "@/components/ReviewDialog";
import CancelReservationButton from "@/components/CancelReservationButton";

const statusMap = {
  PENDING: { label: "Pendiente de pago", variant: "warning" as const },
  CONFIRMED: { label: "Confirmada", variant: "success" as const },
  CANCELLED: { label: "Cancelada", variant: "destructive" as const },
};

export default async function MyReservationsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const reservations = await prisma.reservation.findMany({
    where: { userId },
    include: {
      vehicle: true,
      reviews: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mis reservas</h1>

      {reservations.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 mb-4">Aún no tienes reservas.</p>
          <Button asChild>
            <Link href="/vehicles">Explorar vehículos</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((r) => {
            const { label, variant } = statusMap[r.status];
            const canCancel = r.status === "PENDING" || r.status === "CONFIRMED";
            const canReview = r.status === "CONFIRMED" && r.reviews.length === 0 && new Date(r.endDate) < new Date();

            return (
              <div key={r.id} className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">
                        {r.vehicle.brand} {r.vehicle.model}
                      </h3>
                      <Badge variant={variant}>{label}</Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      {formatDate(r.startDate)} → {formatDate(r.endDate)}
                    </p>
                    <p className="text-sm font-medium text-blue-600">{formatCurrency(Number(r.totalPrice))}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {canCancel && <CancelReservationButton reservationId={r.id} />}
                    {canReview && <ReviewDialog reservationId={r.id} vehicleId={r.vehicleId} />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
