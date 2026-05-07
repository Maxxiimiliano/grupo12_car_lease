import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import AdminVehicleActions from "@/components/admin/AdminVehicleActions";
import AdminVehicleCreateButton from "@/components/admin/AdminVehicleCreateButton";

export default async function AdminVehiclesPage() {
  const vehicles = await prisma.vehicle.findMany({ orderBy: { brand: "asc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Vehículos</h1>
        <AdminVehicleCreateButton />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Vehículo</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Categoría</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Precio/día</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Estado</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vehicles.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {v.brand} {v.model} <span className="text-gray-400 font-normal">({v.year})</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{v.category}</td>
                  <td className="px-4 py-3 font-medium">{formatCurrency(Number(v.pricePerDay))}</td>
                  <td className="px-4 py-3">
                    <Badge variant={v.available ? "success" : "destructive"}>
                      {v.available ? "Disponible" : "No disponible"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <AdminVehicleActions vehicle={{
                      id: v.id, brand: v.brand, model: v.model, year: v.year,
                      pricePerDay: Number(v.pricePerDay), category: v.category,
                      fuelType: v.fuelType, transmission: v.transmission, seats: v.seats,
                      available: v.available, description: v.description, imageUrl: v.imageUrl,
                      mileage: v.mileage, forSale: v.forSale, salePrice: Number(v.salePrice ?? 0),
                    }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
