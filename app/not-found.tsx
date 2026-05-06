import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl font-extrabold text-blue-600 mb-4">404</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Página no encontrada</h1>
        <p className="text-gray-500 mb-8">La página que buscas no existe o ha sido eliminada.</p>
        <Button asChild>
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>
    </div>
  );
}
