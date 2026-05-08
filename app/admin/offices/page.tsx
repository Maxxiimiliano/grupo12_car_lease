import { prisma } from "@/lib/prisma";
import { Mail, MapPin, Phone } from "lucide-react";

export default async function AdminOfficesPage() {
  const offices = await prisma.office.findMany({
    orderBy: { city: "asc" },
    include: { _count: { select: { vehicles: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Oficinas</h1>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {offices.map((office) => (
          <div key={office.id} className="rounded-xl border border-gray-200 bg-white p-5 space-y-3">
            <div>
              <h2 className="font-semibold text-gray-900">{office.name}</h2>
              <p className="text-sm text-blue-600">{office.city}</p>
            </div>
            <div className="space-y-1.5 text-sm text-gray-600">
              <p className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />{office.address}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400 shrink-0" />{office.phone}
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400 shrink-0" />{office.email}
              </p>
            </div>
            <p className="text-xs text-gray-400 pt-1 border-t border-gray-100">
              {office._count.vehicles} vehículo{office._count.vehicles !== 1 ? "s" : ""} asignado{office._count.vehicles !== 1 ? "s" : ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
