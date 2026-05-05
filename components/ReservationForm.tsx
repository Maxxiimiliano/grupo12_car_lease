"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { formatCurrency, diffInDays } from "@/lib/utils";
import { CalendarDays, Loader2 } from "lucide-react";

interface Props {
  vehicleId: string;
  pricePerDay: number;
  available: boolean;
}

export default function ReservationForm({ vehicleId, pricePerDay, available }: Props) {
  const { isSignedIn } = useUser();
  const router = useRouter();

  const today = new Date().toISOString().split("T")[0];

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const days = startDate && endDate ? diffInDays(new Date(startDate), new Date(endDate)) : 0;
  const total = days * pricePerDay;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) { router.push("/sign-in"); return; }
    if (!startDate || !endDate) { setError("Selecciona las fechas de inicio y fin."); return; }
    if (new Date(startDate) >= new Date(endDate)) { setError("La fecha de fin debe ser posterior a la de inicio."); return; }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicleId, startDate, endDate }),
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

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="startDate">Fecha inicio</Label>
          <Input
            id="startDate"
            type="date"
            min={today}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="endDate">Fecha fin</Label>
          <Input
            id="endDate"
            type="date"
            min={startDate || today}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
      </div>

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
