import Image from "next/image";
import Link from "next/link";
import { Fuel, Users, Zap } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface VehicleCardProps {
  id: string;
  brand: string;
  model: string;
  year: number;
  pricePerDay: number;
  category: string;
  fuelType: string;
  transmission: string;
  seats: number;
  available: boolean;
  imageUrl: string;
}

export default function VehicleCard({
  id, brand, model, year, pricePerDay,
  category, fuelType, transmission, seats, available, imageUrl,
}: VehicleCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48 w-full bg-gray-100">
        <Image
          src={imageUrl || "/placeholder-car.jpg"}
          alt={`${brand} ${model}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {!available && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-semibold text-sm bg-red-500 px-3 py-1 rounded-full">No disponible</span>
          </div>
        )}
      </div>

      <CardContent className="flex-1 pt-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-semibold text-gray-900">{brand} {model}</h3>
            <p className="text-sm text-gray-500">{year}</p>
          </div>
          <Badge variant="secondary">{category}</Badge>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-500 mt-3">
          <span className="flex items-center gap-1"><Fuel className="h-3.5 w-3.5" />{fuelType}</span>
          <span className="flex items-center gap-1"><Zap className="h-3.5 w-3.5" />{transmission}</span>
          <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{seats} plazas</span>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-3 border-t border-gray-100">
        <p className="font-bold text-blue-600">
          {formatCurrency(pricePerDay)}<span className="text-xs font-normal text-gray-500">/día</span>
        </p>
        <Button size="sm" disabled={!available} asChild={available}>
          {available ? (
            <Link href={`/vehicles/${id}`}>Reservar</Link>
          ) : (
            <span>No disponible</span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
