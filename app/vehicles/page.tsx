import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import VehicleCard from "@/components/VehicleCard";
import VehicleFilters from "@/components/VehicleFilters";
import { Loader2 } from "lucide-react";

interface SearchParams {
  category?: string;
  fuelType?: string;
  transmission?: string;
  maxPrice?: string;
  city?: string;
  search?: string;
  page?: string;
}

async function VehicleGrid({ searchParams }: { searchParams: SearchParams }) {
  const where: Record<string, unknown> = { available: true };

  if (searchParams.category) where.category = searchParams.category;
  if (searchParams.fuelType) where.fuelType = searchParams.fuelType;
  if (searchParams.transmission) where.transmission = searchParams.transmission;
  if (searchParams.maxPrice) where.pricePerDay = { lte: parseFloat(searchParams.maxPrice) };
  if (searchParams.city) where.office = { city: searchParams.city };
  if (searchParams.search) {
    where.OR = [
      { brand: { contains: searchParams.search, mode: "insensitive" } },
      { model: { contains: searchParams.search, mode: "insensitive" } },
    ];
  }

  const vehicles = await prisma.vehicle.findMany({ where, orderBy: { pricePerDay: "asc" } });

  if (vehicles.length === 0) {
    return (
      <div className="col-span-full text-center py-20 text-gray-500">
        <p className="text-lg font-medium">No se encontraron vehículos</p>
        <p className="text-sm mt-1">Prueba a cambiar los filtros</p>
      </div>
    );
  }

  return (
    <>
      {vehicles.map((v, i) => (
        <VehicleCard
          key={v.id}
          id={v.id}
          brand={v.brand}
          model={v.model}
          year={v.year}
          pricePerDay={Number(v.pricePerDay)}
          category={v.category}
          fuelType={v.fuelType}
          transmission={v.transmission}
          seats={v.seats}
          available={v.available}
          imageUrl={v.imageUrl}
          priority={i === 0}
        />
      ))}
    </>
  );
}

export default async function VehiclesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const offices = await prisma.office.findMany({ orderBy: { city: "asc" }, select: { city: true } });
  const cities = offices.map((o) => o.city);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Catálogo de vehículos</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="sticky top-20 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">Filtros</h2>
            <Suspense fallback={null}>
              <VehicleFilters cities={cities} />
            </Suspense>
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1">
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <Suspense
              fallback={
                <div className="col-span-full flex justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              }
            >
              <VehicleGrid searchParams={params} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
