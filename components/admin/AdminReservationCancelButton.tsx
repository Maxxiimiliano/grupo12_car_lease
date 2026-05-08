"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function AdminReservationCancelButton({ reservationId }: { reservationId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    if (!confirm("¿Cancelar esta reserva?")) return;
    setLoading(true);
    const res = await fetch(`/api/admin/reservations/${reservationId}`, { method: "PATCH" });
    if (!res.ok) {
      const d = await res.json();
      alert(d.error ?? "Error al cancelar.");
    } else {
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <Button
      variant="ghost" size="sm"
      className="h-7 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2"
      onClick={handleCancel}
      disabled={loading}
    >
      {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Cancelar"}
    </Button>
  );
}
