"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { CreditCard, Loader2, Lock } from "lucide-react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Props {
  reservationId: string;
  amount: number;
}

export default function CheckoutForm({ reservationId, amount }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePay = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/payments/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reservationId }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Error al procesar el pago."); return; }

      const stripe = await stripePromise;
      if (!stripe) { setError("Error al cargar Stripe."); return; }

      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
      if (stripeError) setError(stripeError.message ?? "Error en el pago.");
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    await fetch(`/api/reservations/${reservationId}`, { method: "DELETE" });
    router.push("/vehicles");
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="h-4 w-4 text-green-500" />
          <span className="text-sm text-gray-500">Pago seguro con Stripe · PCI DSS</span>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Al continuar serás redirigido a la pasarela de pago de Stripe para completar tu reserva de forma segura.
        </p>

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        <Button className="w-full" size="lg" onClick={handlePay} disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <CreditCard className="h-4 w-4" />
              Pagar {formatCurrency(amount)}
            </>
          )}
        </Button>
      </div>

      <Button variant="ghost" className="w-full text-gray-500" onClick={handleCancel}>
        Cancelar reserva
      </Button>
    </div>
  );
}
