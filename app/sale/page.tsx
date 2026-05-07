import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Fuel, Gauge, Users, Zap } from "lucide-react";

export default async function SalePage() {
  const vehicles = await prisma.vehicle.findMany({
    where: { forSale: true },
    orderBy: { salePrice: "asc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Vehículos en venta</h1>
        <p className="text-gray-500 mt-2">
          Vehículos de nuestra flota disponibles para compra directa a precio especial.
        </p>
      </div>

      {vehicles.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg mb-2">No hay vehículos en venta actualmente.</p>
          <p className="text-gray-400 text-sm mb-6">Vuelve pronto para ver nuevas ofertas de nuestra flota.</p>
          <Button asChild variant="outline">
            <Link href="/vehicles">Ver vehículos de alquiler</Link>
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <Card key={v.id} className="flex flex-col overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-48 w-full bg-gray-100">
                <Image
                  src={v.imageUrl || "/placeholder-car.jpg"}
                  alt={`${v.brand} ${v.model}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-2 left-2">
                  <Badge className="bg-green-600 text-white">En venta</Badge>
                </div>
              </div>

              <CardContent className="flex-1 pt-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{v.brand} {v.model}</h3>
                    <p className="text-sm text-gray-500">{v.year}</p>
                  </div>
                  <Badge variant="secondary">{v.category}</Badge>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-500 mt-3 flex-wrap">
                  <span className="flex items-center gap-1"><Fuel className="h-3.5 w-3.5" />{v.fuelType}</span>
                  <span className="flex items-center gap-1"><Zap className="h-3.5 w-3.5" />{v.transmission}</span>
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{v.seats} plazas</span>
                  <span className="flex items-center gap-1"><Gauge className="h-3.5 w-3.5" />{v.mileage.toLocaleString("es-ES")} km</span>
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between pt-3 border-t border-gray-100">
                <p className="font-bold text-green-600 text-lg">
                  {formatCurrency(Number(v.salePrice))}
                </p>
                <Button size="sm" asChild>
                  <Link href={`/sale/${v.id}`}>Ver oferta</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
