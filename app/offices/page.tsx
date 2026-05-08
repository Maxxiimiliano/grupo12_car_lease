import { prisma } from "@/lib/prisma";
import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function OfficesPage() {
  const offices = await prisma.office.findMany({ orderBy: { city: "asc" } });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Nuestras oficinas</h1>
        <p className="text-gray-500 mt-2">
          Visítanos en cualquiera de nuestras oficinas para alquilar o adquirir tu vehículo.
        </p>
      </div>

      <div className="space-y-12">
        {offices.map((office) => {
          const bbox = `${office.lng - 0.012},${office.lat - 0.008},${office.lng + 0.012},${office.lat + 0.008}`;
          const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${office.lat},${office.lng}`;

          return (
            <div key={office.id} className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
              <div className="grid lg:grid-cols-2">
                <div className="p-6 lg:p-8 flex flex-col justify-between gap-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{office.name}</h2>
                    <p className="text-blue-600 font-medium">{office.city}</p>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                      <span className="text-gray-700">{office.address}, {office.city}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                      <a href={`tel:${office.phone}`} className="text-gray-700 hover:text-blue-600">{office.phone}</a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                      <a href={`mailto:${office.email}`} className="text-gray-700 hover:text-blue-600">{office.email}</a>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/vehicles?city=${office.city}`}>Ver vehículos en {office.city}</Link>
                    </Button>
                    <Button asChild size="sm">
                      <a
                        href={`https://www.openstreetmap.org/?mlat=${office.lat}&mlon=${office.lng}#map=16/${office.lat}/${office.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Abrir en mapa
                      </a>
                    </Button>
                  </div>
                </div>

                <div className="h-64 lg:h-auto">
                  <iframe
                    src={mapUrl}
                    className="w-full h-full border-0"
                    title={`Mapa de ${office.name}`}
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
