"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import VehicleForm, { type VehicleFormData } from "@/components/admin/VehicleForm";
import { Pencil, Trash2 } from "lucide-react";

export default function AdminVehicleActions({ vehicle }: { vehicle: VehicleFormData }) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar ${vehicle.brand} ${vehicle.model}?`)) return;
    await fetch(`/api/admin/vehicles/${vehicle.id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogTrigger asChild>
          <Button size="icon" variant="ghost" className="h-8 w-8">
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar vehículo</DialogTitle>
          </DialogHeader>
          <VehicleForm initialData={vehicle} onClose={() => setEditOpen(false)} />
        </DialogContent>
      </Dialog>

      <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={handleDelete}>
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
