"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import VehicleForm from "@/components/admin/VehicleForm";
import { Plus } from "lucide-react";

export default function AdminVehicleCreateButton() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" /> Nuevo vehículo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear vehículo</DialogTitle>
        </DialogHeader>
        <VehicleForm onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
