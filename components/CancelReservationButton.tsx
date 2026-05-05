"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function CancelReservationButton({ reservationId }: { reservationId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    if (!confirm("¿Estás seguro de que quieres cancelar esta reserva?")) return;
    setLoading(true);
    await fetch(`/api/reservations/${reservationId}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleCancel} disabled={loading} className="text-red-600 border-red-200 hover:bg-red-50">
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Cancelar"}
    </Button>
  );
}
