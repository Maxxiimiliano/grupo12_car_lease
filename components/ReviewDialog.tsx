"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import StarRating from "@/components/StarRating";
import { Loader2, Star } from "lucide-react";

interface Props {
  reservationId: string;
  vehicleId: string;
}

export default function ReviewDialog({ reservationId, vehicleId }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { setError("Selecciona una puntuación."); return; }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reservationId, vehicleId, rating, comment }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? "Error al enviar la valoración.");
        return;
      }
      setOpen(false);
      router.refresh();
    } catch {
      setError("Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="text-yellow-600 border-yellow-200 hover:bg-yellow-50">
          <Star className="h-3.5 w-3.5" /> Valorar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Valorar vehículo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label>Puntuación</Label>
            <StarRating value={rating} onChange={setRating} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="comment">Comentario (opcional)</Label>
            <textarea
              id="comment"
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Comparte tu experiencia..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enviar valoración"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
