import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Car, MapPin, Shield, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import StarRating from "@/components/StarRating";

const features = [
  { icon: Car, title: "Amplio catálogo", desc: "Más de 20 vehículos disponibles en diferentes categorías." },
  { icon: Shield, title: "Pago seguro", desc: "Transacciones protegidas mediante Stripe con cifrado PCI DSS." },
  { icon: Star, title: "Valoraciones reales", desc: "Lee las opiniones de otros conductores antes de reservar." },
  { icon: Zap, title: "Reserva en minutos", desc: "Proceso simplificado: elige fechas, paga y listo." },
];

export default async function HomePage() {
  const [vehicleCount, priceAgg, officeCount, vehiclesWithReviews] = await Promise.all([
    prisma.vehicle.count({ where: { available: true } }),
    prisma.vehicle.aggregate({ _min: { pricePerDay: true }, where: { available: true } }),
    prisma.office.count(),
    prisma.vehicle.findMany({
      where: { available: true, reviews: { some: {} } },
      include: { reviews: { select: { rating: true } }, office: { select: { city: true } } },
    }),
  ]);

  const minPrice = Number(priceAgg._min.pricePerDay ?? 35);

  const topVehicles = vehiclesWithReviews
    .map((v) => ({
      ...v,
      avgRating: v.reviews.reduce((s, r) => s + r.rating, 0) / v.reviews.length,
    }))
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Reserva tu vehículo<br />de forma fácil y segura
          </h1>
          <p className="text-blue-100 text-lg max-w-xl mx-auto mb-8">
            CarLease te ofrece el catálogo más completo de vehículos en alquiler. Sin sorpresas, sin complicaciones.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-semibold" asChild>
              <Link href="/vehicles">
                Ver vehículos <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white bg-transparent hover:bg-white/10" asChild>
              <Link href="/sign-up">Crear cuenta gratis</Link>
            </Button>
          </div>
        </div>

        {/* Stats strip */}
        <div className="border-t border-white/20 bg-white/10 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 flex flex-wrap justify-center gap-8 text-white text-sm">
            <span className="flex items-center gap-2 font-semibold">
              <MapPin className="h-4 w-4 opacity-75" />
              {officeCount} ciudad{officeCount !== 1 ? "es" : ""}
            </span>
            <span className="flex items-center gap-2 font-semibold">
              <Car className="h-4 w-4 opacity-75" />
              {vehicleCount} vehículos disponibles
            </span>
            <span className="flex items-center gap-2 font-semibold">
              <Zap className="h-4 w-4 opacity-75" />
              Desde {formatCurrency(minPrice)}/día
            </span>
          </div>
        </div>
      </section>

      {/* Top rated */}
      {topVehicles.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Más valorados</h2>
                <p className="text-gray-500 mt-1">Los vehículos mejor puntuados por nuestros clientes</p>
              </div>
              <Button variant="outline" asChild className="hidden sm:flex">
                <Link href="/vehicles">Ver todos <ArrowRight className="h-4 w-4 ml-1" /></Link>
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {topVehicles.map((v) => (
                <Link key={v.id} href={`/vehicles/${v.id}`} className="group">
                  <div className="rounded-2xl bg-white border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative h-48 w-full bg-gray-100">
                      <Image
                        src={v.imageUrl || "/placeholder-car.jpg"}
                        alt={`${v.brand} ${v.model}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{v.brand} {v.model}</h3>
                          <p className="text-sm text-gray-500">{v.year}</p>
                        </div>
                        <Badge variant="secondary">{v.category}</Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <StarRating value={Math.round(v.avgRating)} readonly />
                        <span className="text-sm text-gray-500">
                          {v.avgRating.toFixed(1)} ({v.reviews.length} valoraciones)
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-blue-600 font-bold text-lg">
                          {formatCurrency(Number(v.pricePerDay))}
                          <span className="text-sm font-normal text-gray-400">/día</span>
                        </span>
                        {v.office && (
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />{v.office.city}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-6 text-center sm:hidden">
              <Button variant="outline" asChild>
                <Link href="/vehicles">Ver todos los vehículos</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold mb-12 text-gray-900">¿Por qué CarLease?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
                  <Icon className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Listo para conducir?</h2>
          <p className="text-gray-500 mb-8">
            Elige tu vehículo, selecciona las fechas y paga de forma segura en menos de 3 minutos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/vehicles">Explorar catálogo</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/offices">Ver nuestras oficinas</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
