"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { DayPicker, type DateRange } from "react-day-picker";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { formatCurrency, diffInDays } from "@/lib/utils";
import { CalendarDays, Loader2 } from "lucide-react";
import "react-day-picker/style.css";

interface Props {
  vehicleId: string;
  pricePerDay: number;
  available: boolean;
}

interface BookedRange {
  startDate: string;
  endDate: string;
}

export default function ReservationForm({ vehicleId, pricePerDay, available }: Props) {
  const { isSignedIn } = useUser();
  const router = useRouter();

  const [range, setRange] = useState<DateRange | undefined>();
  const [bookedRanges, setBookedRanges] = useState<BookedRange[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/vehicles/${vehicleId}/booked-dates`)
      .then((r) => r.json())
      .then(setBookedRanges)
      .catch(() => {});
  }, [vehicleId]);

  const disabledDays = [
    { before: new Date() },
    ...bookedRanges.map(({ startDate, endDate }) => ({
      from: new Date(startDate),
      to: new Date(endDate),
    })),
  ];

  const bookedModifier = bookedRanges.map(({ startDate, endDate }) => ({
    from: new Date(startDate),
    to: new Date(endDate),
  }));

  const startDate = range?.from;
  const endDate = range?.to;
  const days = startDate && endDate ? diffInDays(startDate, endDate) : 0;
  const total = days * pricePerDay;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) { router.push("/sign-in"); return; }
    if (!startDate || !endDate) { setError("Selecciona las fechas de inicio y fin."); return; }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId,
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Error al crear la reserva."); return; }
      router.push(`/checkout/${data.id}`);
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (!available) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
        <CalendarDays className="h-5 w-5 text-blue-500" /> Selecciona las fechas
      </h3>

      <div className="flex justify-center">
        <DayPicker
          mode="range"
          selected={range}
          onSelect={setRange}
          locale={es}
          disabled={disabledDays}
          modifiers={{ booked: bookedModifier }}
          modifiersStyles={{
            booked: {
              backgroundColor: "#fee2e2",
              color: "#dc2626",
              textDecoration: "line-through",
            },
          }}
          styles={{
            root: { fontSize: "0.875rem" },
          }}
        />
      </div>

      {bookedRanges.length > 0 && (
        <p className="text-xs text-gray-400 flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-sm bg-red-100 border border-red-300" />
          Días en rojo: no disponibles
        </p>
      )}

      {days > 0 && (
        <div className="rounded-lg bg-gray-50 p-3 text-sm flex justify-between">
          <span className="text-gray-500">{days} día{days !== 1 ? "s" : ""} × {formatCurrency(pricePerDay)}</span>
          <span className="font-bold text-gray-900">{formatCurrency(total)}</span>
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : isSignedIn ? "Continuar al pago" : "Iniciar sesión para reservar"}
      </Button>
    </form>
  );
}
