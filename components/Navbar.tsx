"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Show, UserButton, useUser } from "@clerk/nextjs";
import { Car, Menu, Settings, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/vehicles", label: "Vehículos" },
  { href: "/sale", label: "En venta" },
  { href: "/offices", label: "Oficinas" },
  { href: "/my-reservations", label: "Mis reservas" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-blue-600 text-xl">
          <Car className="h-6 w-6" />
          CarLease
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-blue-600",
                pathname.startsWith(href) ? "text-blue-600" : "text-gray-600"
              )}
            >
              {label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className={cn(
                "text-sm font-medium transition-colors hover:text-blue-600 flex items-center gap-1",
                pathname.startsWith("/admin") ? "text-blue-600" : "text-gray-600"
              )}
            >
              <Settings className="h-4 w-4" />
              Admin
            </Link>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Show when="signed-out">
            <Button variant="outline" size="sm" asChild>
              <Link href="/sign-in">Iniciar sesión</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/sign-up">Registrarse</Link>
            </Button>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>

        {/* Mobile menu toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4 flex flex-col gap-4">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-gray-700"
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className="text-sm font-medium text-gray-700 flex items-center gap-1"
              onClick={() => setOpen(false)}
            >
              <Settings className="h-4 w-4" />
              Admin
            </Link>
          )}
          <Show when="signed-out">
            <Button variant="outline" size="sm" asChild>
              <Link href="/sign-in">Iniciar sesión</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/sign-up">Registrarse</Link>
            </Button>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      )}
    </header>
  );
}
