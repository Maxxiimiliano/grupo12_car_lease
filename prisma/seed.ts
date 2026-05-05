import { PrismaClient } from "../app/generated/prisma";

const prisma = new PrismaClient();

const vehicles = [
  {
    brand: "Toyota", model: "Corolla", year: 2023, pricePerDay: 45,
    category: "Turismo", fuelType: "Híbrido", transmission: "Automático",
    seats: 5, available: true,
    description: "El Toyota Corolla híbrido ofrece eficiencia superior y comodidad urbana. Ideal para ciudad y carretera.",
    imageUrl: "https://images.unsplash.com/photo-1617469767808-42539fcb7e3c?w=800",
  },
  {
    brand: "Volkswagen", model: "Golf", year: 2022, pricePerDay: 50,
    category: "Turismo", fuelType: "Gasolina", transmission: "Manual",
    seats: 5, available: true,
    description: "Compacto premium con excelente maniobrabilidad. Perfecto para desplazamientos urbanos y viajes cortos.",
    imageUrl: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800",
  },
  {
    brand: "BMW", model: "X5", year: 2023, pricePerDay: 140,
    category: "SUV", fuelType: "Diésel", transmission: "Automático",
    seats: 5, available: true,
    description: "SUV de lujo con potente motor diésel y tracción total. Para quienes exigen lo mejor en cada trayecto.",
    imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
  },
  {
    brand: "Tesla", model: "Model 3", year: 2024, pricePerDay: 120,
    category: "Eléctrico", fuelType: "Eléctrico", transmission: "Automático",
    seats: 5, available: true,
    description: "Sedán 100% eléctrico con 560 km de autonomía. Tecnología puntera y cero emisiones.",
    imageUrl: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800",
  },
  {
    brand: "Ford", model: "Transit", year: 2022, pricePerDay: 80,
    category: "Furgoneta", fuelType: "Diésel", transmission: "Manual",
    seats: 9, available: true,
    description: "Furgoneta de 9 plazas perfecta para grupos y viajes familiares. Gran capacidad de carga.",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
  },
  {
    brand: "Porsche", model: "911", year: 2023, pricePerDay: 250,
    category: "Deportivo", fuelType: "Gasolina", transmission: "Automático",
    seats: 2, available: true,
    description: "Icono deportivo con más de 450 CV. Experiencia de conducción única en cada curva.",
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
  },
  {
    brand: "Seat", model: "Ibiza", year: 2023, pricePerDay: 35,
    category: "Compacto", fuelType: "Gasolina", transmission: "Manual",
    seats: 5, available: true,
    description: "Compacto español económico y versátil. Ideal para ciudad con bajo consumo de combustible.",
    imageUrl: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800",
  },
  {
    brand: "Hyundai", model: "Tucson", year: 2022, pricePerDay: 70,
    category: "SUV", fuelType: "Híbrido", transmission: "Automático",
    seats: 5, available: true,
    description: "SUV familiar híbrido con diseño moderno y amplio maletero. Equilibrio perfecto entre eficiencia y espacio.",
    imageUrl: "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=800",
  },
  {
    brand: "Mercedes", model: "Clase A", year: 2023, pricePerDay: 90,
    category: "Turismo", fuelType: "Gasolina", transmission: "Automático",
    seats: 5, available: true,
    description: "Compacto premium de Mercedes con tecnología MBUX y acabados de lujo.",
    imageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800",
  },
  {
    brand: "Renault", model: "Zoe", year: 2022, pricePerDay: 55,
    category: "Eléctrico", fuelType: "Eléctrico", transmission: "Automático",
    seats: 5, available: true,
    description: "Urbano eléctrico con 395 km de autonomía. La opción más accesible para movilidad sostenible.",
    imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800",
  },
  {
    brand: "Audi", model: "A3", year: 2023, pricePerDay: 85,
    category: "Turismo", fuelType: "Gasolina", transmission: "Automático",
    seats: 5, available: false,
    description: "Berlina premium con interior refinado y sistema de infoentretenimiento MMI avanzado.",
    imageUrl: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800",
  },
  {
    brand: "Kia", model: "Sportage", year: 2023, pricePerDay: 65,
    category: "SUV", fuelType: "Híbrido", transmission: "Automático",
    seats: 5, available: true,
    description: "SUV coreano con diseño futurista y garantía de 7 años. Alto equipamiento de serie.",
    imageUrl: "https://images.unsplash.com/photo-1609752232649-35bfb3f9e9dd?w=800",
  },
];

async function main() {
  console.log("Seeding database...");
  await prisma.vehicle.deleteMany();

  for (const v of vehicles) {
    await prisma.vehicle.create({ data: v });
  }

  console.log(`Created ${vehicles.length} vehicles.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
