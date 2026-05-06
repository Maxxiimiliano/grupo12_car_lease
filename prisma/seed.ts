import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as never);

const vehicles = [
  {
    brand: "Toyota", model: "Corolla", year: 2022, pricePerDay: 45,
    category: "Turismo", fuelType: "Híbrido", transmission: "Automático",
    seats: 5, available: true,
    description: "Sedán híbrido eficiente y cómodo, ideal para ciudad y carretera.",
    imageUrl: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800",
  },
  {
    brand: "Volkswagen", model: "Golf", year: 2023, pricePerDay: 52,
    category: "Compacto", fuelType: "Gasolina", transmission: "Manual",
    seats: 5, available: true,
    description: "Hatchback compacto con excelente maniobrabilidad en ciudad.",
    imageUrl: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800",
  },
  {
    brand: "BMW", model: "X5", year: 2023, pricePerDay: 120,
    category: "SUV", fuelType: "Diésel", transmission: "Automático",
    seats: 7, available: true,
    description: "SUV premium con gran espacio y prestaciones deportivas.",
    imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
  },
  {
    brand: "Mercedes-Benz", model: "Vito", year: 2021, pricePerDay: 95,
    category: "Furgoneta", fuelType: "Diésel", transmission: "Automático",
    seats: 9, available: true,
    description: "Furgoneta espaciosa para grupos o transporte de carga.",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
  },
  {
    brand: "Audi", model: "A3", year: 2023, pricePerDay: 75,
    category: "Turismo", fuelType: "Gasolina", transmission: "Automático",
    seats: 5, available: true,
    description: "Berlina premium compacta con tecnología de última generación.",
    imageUrl: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800",
  },
  {
    brand: "Renault", model: "Clio", year: 2022, pricePerDay: 38,
    category: "Compacto", fuelType: "Gasolina", transmission: "Manual",
    seats: 5, available: true,
    description: "Urbano económico perfecto para desplazamientos diarios.",
    imageUrl: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800",
  },
  {
    brand: "Tesla", model: "Model 3", year: 2023, pricePerDay: 110,
    category: "Eléctrico", fuelType: "Eléctrico", transmission: "Automático",
    seats: 5, available: true,
    description: "Sedán eléctrico premium con tecnología Autopilot y cero emisiones.",
    imageUrl: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800",
  },
  {
    brand: "Ford", model: "Kuga", year: 2022, pricePerDay: 78,
    category: "SUV", fuelType: "Híbrido", transmission: "Automático",
    seats: 5, available: true,
    description: "SUV híbrido familiar con gran maletero y confort.",
    imageUrl: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800",
  },
  {
    brand: "Seat", model: "Ibiza", year: 2023, pricePerDay: 35,
    category: "Compacto", fuelType: "Gasolina", transmission: "Manual",
    seats: 5, available: true,
    description: "Compacto urbano económico y ágil, ideal para la ciudad.",
    imageUrl: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800",
  },
  {
    brand: "Porsche", model: "Cayenne", year: 2022, pricePerDay: 180,
    category: "Deportivo", fuelType: "Gasolina", transmission: "Automático",
    seats: 5, available: true,
    description: "SUV deportivo de lujo con potencia y elegancia incomparables.",
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
  },
  {
    brand: "Peugeot", model: "Traveller", year: 2021, pricePerDay: 88,
    category: "Furgoneta", fuelType: "Diésel", transmission: "Automático",
    seats: 8, available: true,
    description: "Minivan de 8 plazas cómoda para viajes en grupo.",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
  },
  {
    brand: "Hyundai", model: "Tucson", year: 2023, pricePerDay: 82,
    category: "SUV", fuelType: "Híbrido", transmission: "Automático",
    seats: 5, available: true,
    description: "SUV híbrido moderno con diseño innovador y tecnología avanzada.",
    imageUrl: "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=800",
  },
];

async function main() {
  console.log("Seeding database...");
  await prisma.vehicle.deleteMany();
  for (const v of vehicles) {
    await prisma.vehicle.create({ data: v });
  }
  console.log(`✓ Created ${vehicles.length} vehicles.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
