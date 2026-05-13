import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Fuel, Gauge, Users, Zap, Calendar, Star, ArrowLeft } from "lucide-react";
import StarRating from "@/components/StarRating";
import RequestVisitForm from "@/components/RequestVisitForm";

export default async function SaleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [vehicle, offices] = await Promise.all([
    prisma.vehicle.findUnique({
      where: { id, forSale: true },
      include: {
        office: true,
        reviews: {
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: "desc" },
          take: 6,
        },
      },
    }),
    prisma.office.findMany({ orderBy: { city: "asc" } }),
  ]);

  if (!vehicle) notFound();

  const office = vehicle.office ?? offices[0];
  if (!office) notFound();

  const avgRating =
    vehicle.reviews.length > 0
      ? vehicle.reviews.reduce((s, r) => s + r.rating, 0) / vehicle.reviews.length
      : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Link href="/sale" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6">
        <ArrowLeft className="h-4 w-4" /> Volver a vehículos en venta
      </Link>

      <div className="grid lg:grid-cols-2 gap-10">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
            <Image
              src={vehicle.imageUrl || "/placeholder-car.jpg"}
              alt={`${vehicle.brand} ${vehicle.model}`}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute top-3 left-3">
              <Badge className="bg-green-600 text-white text-sm px-3 py-1">En venta</Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="secondary">{vehicle.category}</Badge>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              {vehicle.brand} {vehicle.model}
            </h1>
            <p className="text-gray-500 mt-1">{vehicle.year}</p>
          </div>

          {vehicle.reviews.length > 0 && (
            <div className="flex items-center gap-2">
              <StarRating value={Math.round(avgRating)} readonly />
              <span className="text-sm text-gray-500">
                {avgRating.toFixed(1)} ({vehicle.reviews.length} valoraciones de alquiler)
              </span>
            </div>
          )}

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
                <Icon className="h-4 w-4 text-green-500 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="font-medium text-gray-800">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-green-50 p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Precio de venta</p>
              <p className="text-xs text-gray-400">Pago único · Incluye IVA</p>
            </div>
            <span className="text-3xl font-bold text-green-600">{formatCurrency(Number(vehicle.salePrice))}</span>
          </div>

          <RequestVisitForm vehicleId={vehicle.id} office={office} />
        </div>
      </div>

      {vehicle.reviews.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Star className="h-6 w-6 text-yellow-400" /> Valoraciones de alquiler
          </h2>
          <p className="text-sm text-gray-500 mb-6">Opiniones de usuarios que alquilaron este vehículo</p>
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
