import { prisma } from "@/lib/prisma";
import AdminOfficeActions from "@/components/admin/AdminOfficeActions";
import AdminOfficeCreateButton from "@/components/admin/AdminOfficeCreateButton";

export default async function AdminOfficesPage() {
  const offices = await prisma.office.findMany({
    orderBy: { city: "asc" },
    include: { _count: { select: { vehicles: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Oficinas</h1>
        <AdminOfficeCreateButton />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Oficina</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Ciudad</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Contacto</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Vehículos</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {offices.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{o.name}</td>
                  <td className="px-4 py-3 text-gray-600">{o.city}</td>
                  <td className="px-4 py-3 text-gray-600">
                    <p>{o.phone}</p>
                    <p className="text-xs text-gray-400">{o.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{o._count.vehicles}</td>
                  <td className="px-4 py-3 text-right">
                    <AdminOfficeActions office={{
                      id: o.id, name: o.name, address: o.address, city: o.city,
                      phone: o.phone, email: o.email, lat: o.lat, lng: o.lng,
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
