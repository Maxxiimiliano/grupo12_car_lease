"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export interface OfficeFormData {
  id?: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  lat: number;
  lng: number;
}

interface Props {
  initialData?: OfficeFormData;
  onClose: () => void;
}

export default function OfficeForm({ initialData, onClose }: Props) {
  const router = useRouter();
  const isEdit = !!initialData?.id;

  const [form, setForm] = useState<OfficeFormData>(
    initialData ?? { name: "", address: "", city: "", phone: "", email: "", lat: 0, lng: 0 }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof OfficeFormData, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = isEdit ? `/api/admin/offices/${form.id}` : "/api/admin/offices";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? "Error al guardar.");
        return;
      }
      router.refresh();
      onClose();
    } catch {
      setError("Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1 col-span-2">
          <Label>Nombre de la oficina</Label>
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} required placeholder="CarLease Madrid" />
        </div>
      </div>

      <div className="space-y-1">
        <Label>Dirección</Label>
        <Input value={form.address} onChange={(e) => set("address", e.target.value)} required placeholder="Calle de Serrano, 45" />
      </div>

      <div className="space-y-1">
        <Label>Ciudad</Label>
        <Input value={form.city} onChange={(e) => set("city", e.target.value)} required placeholder="Madrid" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label>Teléfono</Label>
          <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} required placeholder="+34 91 234 56 78" />
        </div>
        <div className="space-y-1">
          <Label>Email</Label>
          <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required placeholder="oficina@carlease.es" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label>Latitud</Label>
          <Input
            type="number" step="any"
            value={form.lat || ""}
            onChange={(e) => set("lat", e.target.value === "" ? 0 : parseFloat(e.target.value))}
            required placeholder="40.4255"
          />
        </div>
        <div className="space-y-1">
          <Label>Longitud</Label>
          <Input
            type="number" step="any"
            value={form.lng || ""}
            onChange={(e) => set("lng", e.target.value === "" ? 0 : parseFloat(e.target.value))}
            required placeholder="-3.6877"
          />
        </div>
      </div>

      <p className="text-xs text-gray-400">
        Puedes obtener lat/lng buscando la dirección en{" "}
        <a href="https://www.openstreetmap.org" target="_blank" rel="noopener noreferrer" className="underline">
          OpenStreetMap
        </a>{" "}
        y haciendo clic derecho → "Mostrar dirección".
      </p>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : isEdit ? "Guardar cambios" : "Crear oficina"}
        </Button>
      </div>
    </form>
  );
}
