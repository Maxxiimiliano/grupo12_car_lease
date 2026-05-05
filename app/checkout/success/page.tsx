import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutSuccessPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center max-w-md">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Reserva confirmada!</h1>
        <p className="text-gray-500 mb-8">
          Tu pago ha sido procesado correctamente. Recibirás un email de confirmación en breve.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/my-reservations">Ver mis reservas</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/vehicles">Seguir explorando</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
