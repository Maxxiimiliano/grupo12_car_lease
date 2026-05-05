import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import CheckoutForm from "@/components/CheckoutForm";

export default async function CheckoutPage({ params }: { params: Promise<{ reservationId: string }> }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { reservationId } = await params;

  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: { vehicle: true },
  });

  if (!reservation || reservation.userId !== userId) notFound();
  if (reservation.status === "CONFIRMED") redirect("/my-reservations");

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Confirmar reserva</h1>

      <div className="rounded-xl border border-gray-200 bg-white p-6 mb-6 space-y-3">
        <h2 className="font-semibold text-gray-900 text-lg">
          {reservation.vehicle.brand} {reservation.vehicle.model}
        </h2>
        <div className="text-sm text-gray-600 space-y-1">
          <p>Desde: <span className="font-medium">{formatDate(reservation.startDate)}</span></p>
          <p>Hasta: <span className="font-medium">{formatDate(reservation.endDate)}</span></p>
        </div>
        <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
          <span className="text-gray-600">Total</span>
          <span className="text-2xl font-bold text-blue-600">{formatCurrency(Number(reservation.totalPrice))}</span>
        </div>
      </div>

      <CheckoutForm
        reservationId={reservation.id}
        amount={Number(reservation.totalPrice)}
      />
    </div>
  );
}
