"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImagePlus, Loader2, X } from "lucide-react";

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
  mileage: number;
  forSale: boolean;
  salePrice: number;
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
      mileage: 0, forSale: false, salePrice: 0,
    }
  );
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (data.secure_url) set("imageUrl", data.secure_url);
      else setError("Error al subir la imagen.");
    } catch {
      setError("Error al subir la imagen.");
    } finally {
      setUploading(false);
    }
  };

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

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label>Kilometraje (km)</Label>
          <Input type="number" min={0} value={form.mileage} onChange={(e) => set("mileage", +e.target.value)} required />
        </div>
        <div className="space-y-1">
          <Label>Precio de venta (€)</Label>
          <Input
            type="number" min={0} step={0.01}
            value={form.salePrice}
            onChange={(e) => set("salePrice", +e.target.value)}
            disabled={!form.forSale}
            placeholder={form.forSale ? "Precio de venta" : "Activa 'En venta' primero"}
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label>Imagen</Label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleImageUpload}
        />
        {form.imageUrl ? (
          <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-200">
            <Image src={form.imageUrl} alt="Imagen del vehículo" fill className="object-cover" sizes="(max-width: 768px) 100vw, 600px" />
            <button
              type="button"
              onClick={() => set("imageUrl", "")}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full h-40 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors disabled:opacity-50"
          >
            {uploading ? <Loader2 className="h-8 w-8 animate-spin" /> : <ImagePlus className="h-8 w-8" />}
            <span className="text-sm">{uploading ? "Subiendo imagen..." : "Haz clic para subir una imagen"}</span>
          </button>
        )}
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

      <div className="flex flex-col gap-2">
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
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="forSale"
            checked={form.forSale}
            onChange={(e) => set("forSale", e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-green-600"
          />
          <Label htmlFor="forSale">En venta</Label>
        </div>
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
