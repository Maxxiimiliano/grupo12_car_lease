"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingCart } from "lucide-react";

export default function PurchaseButton({ vehicleId }: { vehicleId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePurchase = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/purchases/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicleId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? "Error al procesar la compra.");
        setLoading(false);
      }
    } catch {
      setError("Error de conexión.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button onClick={handlePurchase} disabled={loading} size="lg" className="w-full bg-green-600 hover:bg-green-700">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <ShoppingCart className="h-4 w-4 mr-2" />
        )}
        Comprar ahora
      </Button>
      {error && <p className="text-sm text-red-500 text-center">{error}</p>}
    </div>
  );
}
