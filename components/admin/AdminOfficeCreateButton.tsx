"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import OfficeForm from "@/components/admin/OfficeForm";
import { Plus } from "lucide-react";

export default function AdminOfficeCreateButton() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" /> Nueva oficina
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear oficina</DialogTitle>
        </DialogHeader>
        <OfficeForm onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
