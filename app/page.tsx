import Link from "next/link";
import { ArrowRight, Car, Shield, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Car, title: "Amplio catálogo", desc: "Más de 50 vehículos disponibles en diferentes categorías." },
  { icon: Shield, title: "Pago seguro", desc: "Transacciones protegidas mediante Stripe con cifrado PCI DSS." },
  { icon: Star, title: "Valoraciones reales", desc: "Lee las opiniones de otros conductores antes de reservar." },
  { icon: Zap, title: "Reserva en minutos", desc: "Proceso simplificado: elige fechas, paga y listo." },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Reserva tu vehículo<br />de forma fácil y segura
          </h1>
          <p className="text-blue-100 text-lg max-w-xl mx-auto mb-8">
            CarLease te ofrece el catálogo más completo de vehículos en alquiler. Sin sorpresas, sin complicaciones.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-semibold" asChild>
              <Link href="/vehicles">
                Ver vehículos <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white bg-transparent hover:bg-white/10" asChild>
              <Link href="/sign-up">Crear cuenta gratis</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold mb-12 text-gray-900">¿Por qué CarLease?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
                  <Icon className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Listo para conducir?</h2>
          <p className="text-gray-500 mb-8">Elige tu vehículo, selecciona las fechas y paga de forma segura en menos de 3 minutos.</p>
          <Button size="lg" asChild>
            <Link href="/vehicles">Explorar catálogo</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
