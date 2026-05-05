"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const CATEGORIES = ["Turismo", "SUV", "Furgoneta", "Deportivo", "Eléctrico", "Compacto"];
const FUEL_TYPES = ["Gasolina", "Diésel", "Híbrido", "Eléctrico"];
const TRANSMISSIONS = ["Manual", "Automático"];

export interface VehicleFormData {
  id?: string;
  brand: string;
  model: string;
  year: number;
  pricePerDay: number;
  category: string;
  fuelType: string;
  transmission: string;
  seats: number;
  available: boolean;
  description: string;
  imageUrl: string;
}

interface Props {
  initialData?: VehicleFormData;
  onClose: () => void;
}

export default function VehicleForm({ initialData, onClose }: Props) {
  const router = useRouter();
  const isEdit = !!initialData?.id;

  const [form, setForm] = useState<VehicleFormData>(
    initialData ?? {
      brand: "", model: "", year: new Date().getFullYear(), pricePerDay: 50,
      category: "Turismo", fuelType: "Gasolina", transmission: "Manual",
      seats: 5, available: true, description: "", imageUrl: "",
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof VehicleFormData, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = isEdit ? `/api/admin/vehicles/${form.id}` : "/api/admin/vehicles";
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
        <div className="space-y-1">
          <Label>Marca</Label>
          <Input value={form.brand} onChange={(e) => set("brand", e.target.value)} required />
        </div>
        <div className="space-y-1">
          <Label>Modelo</Label>
          <Input value={form.model} onChange={(e) => set("model", e.target.value)} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label>Año</Label>
          <Input type="number" min={2000} max={2030} value={form.year} onChange={(e) => set("year", +e.target.value)} required />
        </div>
        <div className="space-y-1">
          <Label>Precio por día (€)</Label>
          <Input type="number" min={1} step={0.01} value={form.pricePerDay} onChange={(e) => set("pricePerDay", +e.target.value)} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label>Categoría</Label>
          <Select value={form.category} onValueChange={(v) => set("category", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Combustible</Label>
          <Select value={form.fuelType} onValueChange={(v) => set("fuelType", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{FUEL_TYPES.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label>Transmisión</Label>
          <Select value={form.transmission} onValueChange={(v) => set("transmission", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{TRANSMISSIONS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Plazas</Label>
          <Input type="number" min={1} max={9} value={form.seats} onChange={(e) => set("seats", +e.target.value)} required />
        </div>
      </div>

      <div className="space-y-1">
        <Label>URL de imagen</Label>
        <Input value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} placeholder="https://..." />
      </div>

      <div className="space-y-1">
        <Label>Descripción</Label>
        <textarea
          rows={3}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          required
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="available"
          checked={form.available}
          onChange={(e) => set("available", e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600"
        />
        <Label htmlFor="available">Disponible para reservar</Label>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : isEdit ? "Guardar cambios" : "Crear vehículo"}
        </Button>
      </div>
    </form>
  );
}
