import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Fuel, Gauge, MapPin, Users, Zap, Calendar, Star } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import ReservationForm from "@/components/ReservationForm";
import StarRating from "@/components/StarRating";

export default async function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    include: {
      office: true,
      reviews: {
        include: { user: { select: { name: true, avatarUrl: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!vehicle) notFound();

  const avgRating =
    vehicle.reviews.length > 0
      ? vehicle.reviews.reduce((s, r) => s + r.rating, 0) / vehicle.reviews.length
      : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="grid lg:grid-cols-2 gap-10">
        {/* Image */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
            <Image
              src={vehicle.imageUrl || "/placeholder-car.jpg"}
              alt={`${vehicle.brand} ${vehicle.model}`}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="secondary">{vehicle.category}</Badge>
              {vehicle.available ? (
                <Badge variant="success">Disponible</Badge>
              ) : (
                <Badge variant="destructive">No disponible</Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              {vehicle.brand} {vehicle.model}
            </h1>
            <p className="text-gray-500 mt-1">{vehicle.year}</p>
          </div>

          <div className="flex items-center gap-2">
            <StarRating value={Math.round(avgRating)} readonly />
            <span className="text-sm text-gray-500">
              {avgRating.toFixed(1)} ({vehicle.reviews.length} valoraciones)
            </span>
          </div>

          <p className="text-gray-600 leading-relaxed">{vehicle.description}</p>

          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { icon: Fuel, label: "Combustible", value: vehicle.fuelType },
              { icon: Zap, label: "Transmisión", value: vehicle.transmission },
              { icon: Users, label: "Plazas", value: `${vehicle.seats} asientos` },
              { icon: Calendar, label: "Año", value: String(vehicle.year) },
              { icon: Gauge, label: "Kilometraje", value: `${vehicle.mileage.toLocaleString("es-ES")} km` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
                <Icon className="h-4 w-4 text-blue-500 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="font-medium text-gray-800">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {vehicle.office && (
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 text-sm space-y-1">
              <p className="font-semibold text-gray-700 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-500 shrink-0" /> Punto de recogida
              </p>
              <p className="text-gray-600 pl-6">{vehicle.office.name}</p>
              <p className="text-gray-400 pl-6">{vehicle.office.address}, {vehicle.office.city}</p>
            </div>
          )}

          <div className="rounded-xl bg-blue-50 p-4 flex items-center justify-between">
            <span className="text-gray-600 text-sm">Precio por día</span>
            <span className="text-3xl font-bold text-blue-600">{formatCurrency(Number(vehicle.pricePerDay))}</span>
          </div>

          {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith("pk_test_") && (
            <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
              <p className="font-semibold mb-1">Modo de prueba</p>
              <p>Usa la tarjeta <span className="font-mono font-bold tracking-wider">4242 4242 4242 4242</span> con cualquier fecha futura y cualquier CVC.</p>
            </div>
          )}

          <ReservationForm vehicleId={vehicle.id} pricePerDay={Number(vehicle.pricePerDay)} available={vehicle.available} />
        </div>
      </div>

      {/* Reviews */}
      {vehicle.reviews.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Star className="h-6 w-6 text-yellow-400" /> Valoraciones
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {vehicle.reviews.map((review) => (
              <div key={review.id} className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800">{review.user.name ?? "Usuario"}</span>
                  <StarRating value={review.rating} readonly />
                </div>
                {review.comment && <p className="text-sm text-gray-500">{review.comment}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
