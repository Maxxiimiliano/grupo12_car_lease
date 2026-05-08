"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CATEGORIES = ["Turismo", "SUV", "Furgoneta", "Deportivo", "Eléctrico", "Compacto"];
const FUEL_TYPES = ["Gasolina", "Diésel", "Híbrido", "Eléctrico"];
const TRANSMISSIONS = ["Manual", "Automático"];

interface Props {
  cities: string[];
}

export default function VehicleFilters({ cities }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`/vehicles?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleReset = () => router.push("/vehicles");

  return (
    <aside className="space-y-5 w-full">
      <div className="space-y-1.5">
        <Label>Buscar</Label>
        <Input
          type="text"
          placeholder="Marca o modelo..."
          defaultValue={searchParams.get("search") ?? ""}
          onBlur={(e) => updateParam("search", e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && updateParam("search", (e.target as HTMLInputElement).value)
          }
        />
      </div>

      {cities.length > 0 && (
        <div className="space-y-1.5">
          <Label>Ciudad / Oficina</Label>
          <Select
            value={searchParams.get("city") ?? "all"}
            onValueChange={(v) => updateParam("city", v)}
          >
            <SelectTrigger><SelectValue placeholder="Todas las ciudades" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las ciudades</SelectItem>
              {cities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-1.5">
        <Label>Categoría</Label>
        <Select
          value={searchParams.get("category") ?? "all"}
          onValueChange={(v) => updateParam("category", v)}
        >
          <SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Combustible</Label>
        <Select
          value={searchParams.get("fuelType") ?? "all"}
          onValueChange={(v) => updateParam("fuelType", v)}
        >
          <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {FUEL_TYPES.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Transmisión</Label>
        <Select
          value={searchParams.get("transmission") ?? "all"}
          onValueChange={(v) => updateParam("transmission", v)}
        >
          <SelectTrigger><SelectValue placeholder="Cualquiera" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Cualquiera</SelectItem>
            {TRANSMISSIONS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Precio máx. por día (€)</Label>
        <Input
          type="number"
          min={0}
          placeholder="Sin límite"
          defaultValue={searchParams.get("maxPrice") ?? ""}
          onBlur={(e) => updateParam("maxPrice", e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && updateParam("maxPrice", (e.target as HTMLInputElement).value)}
        />
      </div>

      <Button variant="outline" className="w-full" onClick={handleReset}>
        Limpiar filtros
      </Button>
    </aside>
  );
}
