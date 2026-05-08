"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Loader2, Phone, Mail, MapPin } from "lucide-react";

interface Office {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
}

interface Props {
  vehicleId: string;
  office: Office;
}

export default function RequestVisitForm({ vehicleId, office }: Props) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", preferredDate: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof typeof form, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/sale/request-visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicleId, officeId: office.id, ...form }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? "Error al enviar la solicitud.");
        return;
      }
      setDone(true);
    } catch {
      setError("Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-xl bg-green-50 border border-green-200 p-6 flex flex-col items-center text-center gap-3">
        <CheckCircle className="h-10 w-10 text-green-500" />
        <h3 className="font-semibold text-gray-900 text-lg">¡Solicitud enviada!</h3>
        <p className="text-gray-600 text-sm">
          Hemos recibido tu solicitud de visita. Te enviaremos un email de confirmación y nos pondremos en
          contacto contigo para concretar la cita.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 space-y-2 text-sm">
        <p className="font-semibold text-gray-800 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-green-500 shrink-0" />
          {office.name}
        </p>
        <p className="text-gray-500 pl-6">{office.address}, {office.city}</p>
        <div className="pl-6 flex flex-col gap-1">
          <a href={`tel:${office.phone}`} className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900">
            <Phone className="h-3.5 w-3.5" />{office.phone}
          </a>
          <a href={`mailto:${office.email}`} className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900">
            <Mail className="h-3.5 w-3.5" />{office.email}
          </a>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <h3 className="font-semibold text-gray-900">Solicitar visita</h3>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label>Nombre completo</Label>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} required placeholder="Tu nombre" />
          </div>
          <div className="space-y-1">
            <Label>Teléfono</Label>
            <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} required placeholder="+34 600 000 000" type="tel" />
          </div>
        </div>

        <div className="space-y-1">
          <Label>Email</Label>
          <Input value={form.email} onChange={(e) => set("email", e.target.value)} required placeholder="tu@email.com" type="email" />
        </div>

        <div className="space-y-1">
          <Label>Fecha preferida para la visita</Label>
          <Input
            type="date"
            value={form.preferredDate}
            onChange={(e) => set("preferredDate", e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            required
          />
        </div>

        <div className="space-y-1">
          <Label>Mensaje (opcional)</Label>
          <textarea
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
            placeholder="¿Alguna pregunta o comentario?"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" size="lg" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          {loading ? "Enviando..." : "Solicitar visita"}
        </Button>
      </form>
    </div>
  );
}
