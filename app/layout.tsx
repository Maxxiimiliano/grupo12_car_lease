import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "CarLease – Reserva tu vehículo",
  description: "Plataforma de reserva de vehículos online. Encuentra el coche perfecto para tus necesidades.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="es" className={`${geist.variable} h-full`}>
        <body className="flex min-h-full flex-col antialiased bg-gray-50 text-gray-900">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
