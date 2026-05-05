import Link from "next/link";
import { Car } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-blue-600 text-lg">
            <Car className="h-5 w-5" />
            CarLease
          </Link>
          <nav className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-500">
            <Link href="/vehicles" className="hover:text-blue-600">Catálogo</Link>
            <Link href="/my-reservations" className="hover:text-blue-600">Mis reservas</Link>
            <Link href="/sign-in" className="hover:text-blue-600">Acceder</Link>
          </nav>
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} CarLease · DAM Grupo 12</p>
        </div>
      </div>
    </footer>
  );
}
