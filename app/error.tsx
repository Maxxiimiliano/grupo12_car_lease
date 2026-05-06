"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl font-extrabold text-red-500 mb-4">500</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Algo salió mal</h1>
        <p className="text-gray-500 mb-8">Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.</p>
        <Button onClick={reset}>Reintentar</Button>
      </div>
    </div>
  );
}
