import { PrismaClient } from "../app/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as never);

// Helper: date relative to today
const d = (offsetDays: number, hour = 10) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + offsetDays);
  dt.setHours(hour, 0, 0, 0);
  return dt;
};

const officesData = [
  {
    name: "CarLease Madrid",
    address: "Calle de Serrano, 45",
    city: "Madrid",
    phone: "+34 91 234 56 78",
    email: "madrid@carlease.es",
    lat: 40.4255,
    lng: -3.6877,
  },
  {
    name: "CarLease Barcelona",
    address: "Passeig de Gràcia, 78",
    city: "Barcelona",
    phone: "+34 93 234 56 78",
    email: "barcelona@carlease.es",
    lat: 41.3942,
    lng: 2.1616,
  },
  {
    name: "CarLease Valencia",
    address: "Avenida del Puerto, 12",
    city: "Valencia",
    phone: "+34 96 234 56 78",
    email: "valencia@carlease.es",
    lat: 39.4716,
    lng: -0.3305,
  },
  {
    name: "CarLease Sevilla",
    address: "Avenida de la Constitución, 23",
    city: "Sevilla",
    phone: "+34 95 234 56 78",
    email: "sevilla@carlease.es",
    lat: 37.3891,
    lng: -5.9845,
  },
];

const vehicles = [
  // ── Madrid ──────────────────────────────────────────────────────────────
  {
    brand: "Toyota", model: "Corolla", year: 2022, pricePerDay: 45,
    category: "Turismo", fuelType: "Híbrido", transmission: "Automático",
    seats: 5, available: true, mileage: 72000,
    forSale: true, salePrice: 14500,
    description: "Sedán híbrido eficiente y cómodo, ideal para ciudad y carretera.",
    imageUrl: "https://images.unsplash.com/photo-1638618164682-12b986ec2a75?w=800",
    officeCity: "Madrid",
  },
  {
    brand: "BMW", model: "X5", year: 2023, pricePerDay: 120,
    category: "SUV", fuelType: "Diésel", transmission: "Automático",
    seats: 7, available: true, mileage: 42000,
    description: "SUV premium con gran espacio y prestaciones deportivas.",
    imageUrl: "https://images.unsplash.com/photo-1635990215146-9931957ac509?w=800",
    officeCity: "Madrid",
  },
  {
    brand: "Tesla", model: "Model 3", year: 2023, pricePerDay: 110,
    category: "Eléctrico", fuelType: "Eléctrico", transmission: "Automático",
    seats: 5, available: true, mileage: 12000,
    description: "Sedán eléctrico premium con tecnología Autopilot y cero emisiones.",
    imageUrl: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800",
    officeCity: "Madrid",
  },
  {
    brand: "Porsche", model: "Cayenne", year: 2022, pricePerDay: 180,
    category: "Deportivo", fuelType: "Gasolina", transmission: "Automático",
    seats: 5, available: true, mileage: 38000,
    description: "SUV deportivo de lujo con potencia y elegancia incomparables.",
    imageUrl: "https://images.unsplash.com/photo-1699325974549-fd06639650aa?w=800",
    officeCity: "Madrid",
  },
  {
    brand: "Kia", model: "EV6", year: 2023, pricePerDay: 92,
    category: "Eléctrico", fuelType: "Eléctrico", transmission: "Automático",
    seats: 5, available: true, mileage: 9000,
    description: "Crossover eléctrico con 490 km de autonomía y carga ultrarrápida.",
    imageUrl: "https://images.unsplash.com/photo-1720594646721-09d43635faf8?w=800",
    officeCity: "Madrid",
  },
  {
    brand: "Mercedes-Benz", model: "Clase A", year: 2023, pricePerDay: 68,
    category: "Turismo", fuelType: "Gasolina", transmission: "Automático",
    seats: 5, available: true, mileage: 21000,
    description: "Berlina compacta de lujo con interior premium y pantallas MBUX.",
    imageUrl: "https://images.unsplash.com/photo-1691520971817-835780eb5e5c?w=800",
    officeCity: "Madrid",
  },
  {
    brand: "Range Rover", model: "Evoque", year: 2022, pricePerDay: 130,
    category: "SUV", fuelType: "Diésel", transmission: "Automático",
    seats: 5, available: true, mileage: 48000,
    forSale: true, salePrice: 32000,
    description: "SUV premium compacto con diseño icónico y gran equipamiento.",
    imageUrl: "https://images.unsplash.com/photo-1646654184457-cd64cadcd3a3?w=800",
    officeCity: "Madrid",
  },
  {
    brand: "Audi", model: "Q5", year: 2023, pricePerDay: 145,
    category: "SUV", fuelType: "Diésel", transmission: "Automático",
    seats: 5, available: true, mileage: 28000,
    description: "SUV premium alemán con Quattro, interior impecable y gran dinamismo.",
    imageUrl: "https://images.unsplash.com/photo-1728711283509-906e153833ed?w=800",
    officeCity: "Madrid",
  },
  {
    brand: "Honda", model: "CR-V", year: 2023, pricePerDay: 85,
    category: "SUV", fuelType: "Híbrido", transmission: "Automático",
    seats: 5, available: true, mileage: 11000,
    description: "SUV híbrido espacioso con maletero generoso y consumo muy contenido.",
    imageUrl: "https://images.unsplash.com/photo-1645099383164-319a0925f8bc?w=800",
    officeCity: "Madrid",
  },
  {
    brand: "Opel", model: "Mokka-e", year: 2023, pricePerDay: 58,
    category: "Eléctrico", fuelType: "Eléctrico", transmission: "Automático",
    seats: 5, available: true, mileage: 5000,
    description: "SUV eléctrico urbano con diseño atrevido y 338 km de autonomía.",
    imageUrl: "https://images.unsplash.com/photo-1643306967754-48f5b2928a4a?w=800",
    officeCity: "Madrid",
  },
  // ── Barcelona ────────────────────────────────────────────────────────────
  {
    brand: "Volkswagen", model: "Golf", year: 2023, pricePerDay: 52,
    category: "Compacto", fuelType: "Gasolina", transmission: "Manual",
    seats: 5, available: true, mileage: 15000,
    description: "Hatchback compacto con excelente maniobrabilidad en ciudad.",
    imageUrl: "https://images.unsplash.com/photo-1572811298797-9eecadf6cb24?w=800",
    officeCity: "Barcelona",
  },
  {
    brand: "Audi", model: "A3", year: 2023, pricePerDay: 75,
    category: "Turismo", fuelType: "Gasolina", transmission: "Automático",
    seats: 5, available: true, mileage: 19000,
    description: "Berlina premium compacta con tecnología de última generación.",
    imageUrl: "https://images.unsplash.com/photo-1717711081688-985a7a3e6a9f?w=800",
    officeCity: "Barcelona",
  },
  {
    brand: "Ford", model: "Kuga", year: 2022, pricePerDay: 78,
    category: "SUV", fuelType: "Híbrido", transmission: "Automático",
    seats: 5, available: true, mileage: 65000,
    forSale: true, salePrice: 21000,
    description: "SUV híbrido familiar con gran maletero y confort de larga distancia.",
    imageUrl: "https://images.unsplash.com/photo-1649921777129-a28a26031a03?w=800",
    officeCity: "Barcelona",
  },
  {
    brand: "Peugeot", model: "Traveller", year: 2021, pricePerDay: 88,
    category: "Furgoneta", fuelType: "Diésel", transmission: "Automático",
    seats: 8, available: true, mileage: 80000,
    forSale: true, salePrice: 19000,
    description: "Minivan de 8 plazas cómoda para viajes en grupo o familia numerosa.",
    imageUrl: "https://images.unsplash.com/photo-1775637483809-3bdb2a80fb77?w=800",
    officeCity: "Barcelona",
  },
  {
    brand: "Volvo", model: "XC40", year: 2023, pricePerDay: 88,
    category: "SUV", fuelType: "Híbrido", transmission: "Automático",
    seats: 5, available: true, mileage: 14000,
    description: "SUV compacto escandinavo con máxima seguridad y diseño minimalista.",
    imageUrl: "https://images.unsplash.com/photo-1557323137-bd6bd20fe022?w=800",
    officeCity: "Barcelona",
  },
  {
    brand: "Jeep", model: "Wrangler", year: 2022, pricePerDay: 102,
    category: "SUV", fuelType: "Gasolina", transmission: "Manual",
    seats: 5, available: true, mileage: 33000,
    description: "Todoterreno legendario, ideal para aventuras fuera de la carretera.",
    imageUrl: "https://images.unsplash.com/photo-1506015391300-4802dc74de2e?w=800",
    officeCity: "Barcelona",
  },
  {
    brand: "BMW", model: "Serie 3", year: 2023, pricePerDay: 98,
    category: "Turismo", fuelType: "Gasolina", transmission: "Automático",
    seats: 5, available: true, mileage: 24000,
    description: "Berlina deportiva por excelencia: conducción precisa y gran refinamiento.",
    imageUrl: "https://images.unsplash.com/photo-1687184471624-a7128c42c0a2?w=800",
    officeCity: "Barcelona",
  },
  {
    brand: "Skoda", model: "Octavia", year: 2022, pricePerDay: 48,
    category: "Turismo", fuelType: "Gasolina", transmission: "Manual",
    seats: 5, available: true, mileage: 37000,
    description: "Familiar amplio y práctico con un maletero de 600 L. Excelente relación calidad-precio.",
    imageUrl: "https://images.unsplash.com/photo-1564240651370-4d55b06a1375?w=800",
    officeCity: "Barcelona",
  },
  {
    brand: "Seat", model: "Tarraco", year: 2023, pricePerDay: 90,
    category: "SUV", fuelType: "Híbrido", transmission: "Automático",
    seats: 7, available: true, mileage: 18000,
    description: "SUV de 7 plazas español con tecnología avanzada y amplio habitáculo.",
    imageUrl: "https://images.unsplash.com/photo-1613938368368-641eebada2c7?w=800",
    officeCity: "Barcelona",
  },
  // ── Valencia ─────────────────────────────────────────────────────────────
  {
    brand: "Mercedes-Benz", model: "Vito", year: 2021, pricePerDay: 95,
    category: "Furgoneta", fuelType: "Diésel", transmission: "Automático",
    seats: 9, available: true, mileage: 78000,
    forSale: true, salePrice: 23500,
    description: "Furgoneta espaciosa para grupos o transporte de carga.",
    imageUrl: "https://images.unsplash.com/photo-1765461734605-34657fa04db2?w=800",
    officeCity: "Valencia",
  },
  {
    brand: "Renault", model: "Clio", year: 2022, pricePerDay: 38,
    category: "Compacto", fuelType: "Gasolina", transmission: "Manual",
    seats: 5, available: true, mileage: 31000,
    description: "Urbano económico perfecto para desplazamientos diarios en ciudad.",
    imageUrl: "https://images.unsplash.com/photo-1666335009164-2597314da8e7?w=800",
    officeCity: "Valencia",
  },
  {
    brand: "Seat", model: "Ibiza", year: 2023, pricePerDay: 35,
    category: "Compacto", fuelType: "Gasolina", transmission: "Manual",
    seats: 5, available: true, mileage: 22000,
    description: "Compacto urbano económico y ágil, ideal para la ciudad.",
    imageUrl: "https://images.unsplash.com/photo-1698149832457-def32077d37d?w=800",
    officeCity: "Valencia",
  },
  {
    brand: "Hyundai", model: "Tucson", year: 2023, pricePerDay: 82,
    category: "SUV", fuelType: "Híbrido", transmission: "Automático",
    seats: 5, available: true, mileage: 17000,
    description: "SUV híbrido moderno con diseño innovador y tecnología avanzada.",
    imageUrl: "https://images.unsplash.com/photo-1646029642262-022158ff5794?w=800",
    officeCity: "Valencia",
  },
  {
    brand: "MINI", model: "Cooper S", year: 2022, pricePerDay: 55,
    category: "Compacto", fuelType: "Gasolina", transmission: "Automático",
    seats: 4, available: true, mileage: 26000,
    description: "Icónico urbano deportivo con carácter propio y gran equipamiento.",
    imageUrl: "https://images.unsplash.com/photo-1508048236731-b5ef91f7840c?w=800",
    officeCity: "Valencia",
  },
  {
    brand: "Fiat", model: "500e", year: 2023, pricePerDay: 42,
    category: "Eléctrico", fuelType: "Eléctrico", transmission: "Automático",
    seats: 4, available: true, mileage: 8000,
    description: "El clásico italiano reinventado 100% eléctrico. Perfecto para la ciudad.",
    imageUrl: "https://images.unsplash.com/photo-1642489093729-6ffdbe356fdb?w=800",
    officeCity: "Valencia",
  },
  {
    brand: "Nissan", model: "Qashqai", year: 2022, pricePerDay: 72,
    category: "SUV", fuelType: "Gasolina", transmission: "Automático",
    seats: 5, available: true, mileage: 41000,
    description: "SUV crossover versátil y cómodo, ideal para ciudad y carretera.",
    imageUrl: "https://images.unsplash.com/photo-1684839310553-f877b26935a9?w=800",
    officeCity: "Valencia",
  },
  {
    brand: "Renault", model: "Zoe", year: 2022, pricePerDay: 45,
    category: "Eléctrico", fuelType: "Eléctrico", transmission: "Automático",
    seats: 5, available: true, mileage: 16000,
    description: "Pionero eléctrico urbano con 395 km de autonomía y coste de uso mínimo.",
    imageUrl: "https://images.unsplash.com/photo-1600210733081-c3b8a58a2749?w=800",
    officeCity: "Valencia",
  },
  {
    brand: "Citroën", model: "Berlingo", year: 2022, pricePerDay: 62,
    category: "Furgoneta", fuelType: "Diésel", transmission: "Manual",
    seats: 5, available: true, mileage: 52000,
    description: "Furgoneta versátil con interior modular, ideal para familia o profesionales.",
    imageUrl: "https://images.unsplash.com/photo-1768389533475-edc8b2bb9c7d?w=800",
    officeCity: "Valencia",
  },
  // ── Sevilla ──────────────────────────────────────────────────────────────
  {
    brand: "Alfa Romeo", model: "Giulia", year: 2022, pricePerDay: 105,
    category: "Turismo", fuelType: "Gasolina", transmission: "Automático",
    seats: 5, available: true, mileage: 34000,
    description: "Berlina italiana con carácter deportivo único y motor brillante.",
    imageUrl: "https://images.unsplash.com/photo-1610981953766-a7412493b0be?w=800",
    officeCity: "Sevilla",
  },
  {
    brand: "Mazda", model: "CX-5", year: 2023, pricePerDay: 79,
    category: "SUV", fuelType: "Gasolina", transmission: "Automático",
    seats: 5, available: true, mileage: 20000,
    description: "SUV elegante con filosofía KODO, interior premium y conducción precisa.",
    imageUrl: "https://images.unsplash.com/photo-1687292625104-66d0c45f19e3?w=800",
    officeCity: "Sevilla",
  },
  {
    brand: "Honda", model: "Jazz", year: 2023, pricePerDay: 43,
    category: "Compacto", fuelType: "Híbrido", transmission: "Automático",
    seats: 5, available: true, mileage: 12000,
    description: "Urbano híbrido compacto con asientos Magic Seat y bajo consumo.",
    imageUrl: "https://images.unsplash.com/photo-1554610653-61abcd7999a6?w=800",
    officeCity: "Sevilla",
  },
  {
    brand: "Volkswagen", model: "T-Roc", year: 2023, pricePerDay: 70,
    category: "SUV", fuelType: "Gasolina", transmission: "Automático",
    seats: 5, available: true, mileage: 25000,
    description: "SUV compacto dinámico con diseño moderno y gran equipamiento de serie.",
    imageUrl: "https://images.unsplash.com/photo-1705229810194-dd78431dcb78?w=800",
    officeCity: "Sevilla",
  },
  {
    brand: "Peugeot", model: "208", year: 2023, pricePerDay: 36,
    category: "Compacto", fuelType: "Gasolina", transmission: "Manual",
    seats: 5, available: true, mileage: 19000,
    description: "Urbano francés con diseño premiado i-Cockpit y bajo consumo.",
    imageUrl: "https://images.unsplash.com/photo-1636331997172-805266998102?w=800",
    officeCity: "Sevilla",
  },
  {
    brand: "Toyota", model: "RAV4", year: 2023, pricePerDay: 96,
    category: "SUV", fuelType: "Híbrido", transmission: "Automático",
    seats: 5, available: true, mileage: 13000,
    forSale: true, salePrice: 38000,
    description: "SUV híbrido referente del segmento con tracción AWD-i y excelente fiabilidad.",
    imageUrl: "https://images.unsplash.com/photo-1728890784080-8062408db2f0?w=800",
    officeCity: "Sevilla",
  },
];

const seedUsers = [
  { id: "seed_user_001", email: "ana.garcia@example.com", name: "Ana García" },
  { id: "seed_user_002", email: "carlos.martinez@example.com", name: "Carlos Martínez" },
  { id: "seed_user_003", email: "maria.lopez@example.com", name: "María López" },
  { id: "seed_user_004", email: "javier.ruiz@example.com", name: "Javier Ruiz" },
  { id: "seed_user_005", email: "elena.sanchez@example.com", name: "Elena Sánchez" },
  { id: "seed_user_006", email: "pablo.fernandez@example.com", name: "Pablo Fernández" },
];

async function main() {
  console.log("Seeding database...");

  // Clean up in FK-safe order (seed users last so reservations go first)
  await prisma.review.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.office.deleteMany();
  await prisma.user.deleteMany({ where: { id: { startsWith: "seed_" } } });

  // ── Offices ──────────────────────────────────────────────────────────────
  const createdOffices: Record<string, string> = {};
  for (const o of officesData) {
    const office = await prisma.office.create({ data: o });
    createdOffices[o.city] = office.id;
  }
  console.log(`✓ Created ${officesData.length} offices.`);

  // ── Vehicles ─────────────────────────────────────────────────────────────
  const vehicleMap: Record<string, string> = {};
  for (const { officeCity, ...v } of vehicles) {
    const created = await prisma.vehicle.create({
      data: { ...v, officeId: createdOffices[officeCity] },
    });
    vehicleMap[`${v.brand} ${v.model}`] = created.id;
  }
  console.log(`✓ Created ${vehicles.length} vehicles.`);

  // ── Seed users ───────────────────────────────────────────────────────────
  for (const u of seedUsers) {
    await prisma.user.create({ data: u });
  }
  console.log(`✓ Created ${seedUsers.length} seed users.`);

  // ── Reservations & reviews ───────────────────────────────────────────────
  type ReservationEntry = {
    userId: string;
    vehicleKey: string;
    start: Date;
    end: Date;
    status: "PENDING" | "CONFIRMED" | "CANCELLED";
    review?: { rating: number; comment: string };
  };

  const reservationDefs: ReservationEntry[] = [
    // Past – confirmed and reviewed
    {
      userId: "seed_user_001", vehicleKey: "Toyota Corolla",
      start: d(-62), end: d(-56), status: "CONFIRMED",
      review: { rating: 5, comment: "Perfecto para la ciudad. Muy económico y cómodo. Repetiré sin duda." },
    },
    {
      userId: "seed_user_002", vehicleKey: "Volkswagen Golf",
      start: d(-55), end: d(-50), status: "CONFIRMED",
      review: { rating: 4, comment: "Muy ágil en ciudad. La entrega fue puntual y el coche estaba impecable." },
    },
    {
      userId: "seed_user_003", vehicleKey: "BMW X5",
      start: d(-48), end: d(-43), status: "CONFIRMED",
      review: { rating: 5, comment: "Una pasada de coche. Espacioso, potente y muy cómodo en autovía." },
    },
    {
      userId: "seed_user_001", vehicleKey: "Tesla Model 3",
      start: d(-40), end: d(-36), status: "CONFIRMED",
      review: { rating: 5, comment: "Experiencia increíble. El Autopilot es un plus enorme. Sin ruidos, sin gasolina." },
    },
    {
      userId: "seed_user_004", vehicleKey: "Audi A3",
      start: d(-35), end: d(-31), status: "CONFIRMED",
      review: { rating: 4, comment: "Interior muy cuidado y conducción precisa. El precio está bien para lo que ofrece." },
    },
    {
      userId: "seed_user_005", vehicleKey: "Porsche Cayenne",
      start: d(-30), end: d(-26), status: "CONFIRMED",
      review: { rating: 5, comment: "Un lujo puro. Para el viaje familiar que merecíamos. Totalmente recomendado." },
    },
    {
      userId: "seed_user_002", vehicleKey: "Ford Kuga",
      start: d(-25), end: d(-21), status: "CONFIRMED",
      review: { rating: 4, comment: "Muy cómodo para viaje largo. El maletero es enorme. Consumo híbrido muy contenido." },
    },
    {
      userId: "seed_user_003", vehicleKey: "Renault Clio",
      start: d(-18), end: d(-14), status: "CONFIRMED",
      review: { rating: 3, comment: "Cumple su función para moverse por la ciudad, aunque el interior podría ser más moderno." },
    },
    {
      userId: "seed_user_005", vehicleKey: "Hyundai Tucson",
      start: d(-13), end: d(-9), status: "CONFIRMED",
      review: { rating: 5, comment: "Diseño espectacular y tecnología al día. El modo híbrido en ciudad es genial." },
    },
    {
      userId: "seed_user_004", vehicleKey: "MINI Cooper S",
      start: d(-10), end: d(-6), status: "CONFIRMED",
      review: { rating: 4, comment: "Divertidísimo de conducir. Pequeño pero con mucha personalidad. Para ir solo es ideal." },
    },
    // Past – confirmed, no review yet (review button should show for user)
    {
      userId: "seed_user_001", vehicleKey: "Volvo XC40",
      start: d(-7), end: d(-3), status: "CONFIRMED",
    },
    // Active now (ongoing)
    {
      userId: "seed_user_002", vehicleKey: "Kia EV6",
      start: d(-2), end: d(4), status: "CONFIRMED",
    },
    {
      userId: "seed_user_003", vehicleKey: "Jeep Wrangler",
      start: d(-1), end: d(5), status: "CONFIRMED",
    },
    // Future
    {
      userId: "seed_user_004", vehicleKey: "Range Rover Evoque",
      start: d(10), end: d(15), status: "CONFIRMED",
    },
    {
      userId: "seed_user_005", vehicleKey: "Fiat 500e",
      start: d(14), end: d(18), status: "CONFIRMED",
    },
    {
      userId: "seed_user_001", vehicleKey: "Nissan Qashqai",
      start: d(20), end: d(26), status: "CONFIRMED",
    },
    // Cancelled
    {
      userId: "seed_user_003", vehicleKey: "Seat Ibiza",
      start: d(-20), end: d(-17), status: "CANCELLED",
    },
    {
      userId: "seed_user_002", vehicleKey: "Mercedes-Benz Clase A",
      start: d(8), end: d(12), status: "CANCELLED",
    },
    // Pending (not paid)
    {
      userId: "seed_user_005", vehicleKey: "Mercedes-Benz Vito",
      start: d(22), end: d(27), status: "PENDING",
    },
    // New vehicles – past confirmed with reviews
    {
      userId: "seed_user_006", vehicleKey: "Alfa Romeo Giulia",
      start: d(-50), end: d(-45), status: "CONFIRMED",
      review: { rating: 5, comment: "Un placer absoluto conducirla. El motor suena de maravilla y la respuesta es brutal." },
    },
    {
      userId: "seed_user_004", vehicleKey: "Mazda CX-5",
      start: d(-38), end: d(-33), status: "CONFIRMED",
      review: { rating: 5, comment: "Interior muy premium para el precio. Silencioso, refinado y económico. Un hallazgo." },
    },
    {
      userId: "seed_user_001", vehicleKey: "BMW Serie 3",
      start: d(-28), end: d(-24), status: "CONFIRMED",
      review: { rating: 4, comment: "La dinámica de conducción es difícil de superar en este segmento. El consumo, aceptable." },
    },
    {
      userId: "seed_user_002", vehicleKey: "Audi Q5",
      start: d(-22), end: d(-17), status: "CONFIRMED",
      review: { rating: 5, comment: "Lujo, espacio y tecnología en estado puro. Ideal para el viaje de trabajo que necesitaba." },
    },
    {
      userId: "seed_user_006", vehicleKey: "Volkswagen T-Roc",
      start: d(-15), end: d(-11), status: "CONFIRMED",
      review: { rating: 4, comment: "Moderno, equipado y agradable de conducir. Perfecto para moverse por Sevilla." },
    },
    {
      userId: "seed_user_003", vehicleKey: "Renault Zoe",
      start: d(-12), end: d(-8), status: "CONFIRMED",
      review: { rating: 4, comment: "Sorprendente autonomía. Cargué una vez y no tuve que volver a parar en toda la semana." },
    },
    {
      userId: "seed_user_005", vehicleKey: "Honda CR-V",
      start: d(-9), end: d(-5), status: "CONFIRMED",
      review: { rating: 5, comment: "Espaciosísimo y eficiente. Perfecto para el viaje familiar. Volveremos a pedirlo." },
    },
    {
      userId: "seed_user_006", vehicleKey: "Seat Tarraco",
      start: d(-6), end: d(-2), status: "CONFIRMED",
      review: { rating: 4, comment: "Las 7 plazas lo hacen ideal. Buen equipamiento y motor potente sin pasarse de consumo." },
    },
    // New vehicles – upcoming
    {
      userId: "seed_user_004", vehicleKey: "Toyota RAV4",
      start: d(5), end: d(10), status: "CONFIRMED",
    },
    {
      userId: "seed_user_001", vehicleKey: "Honda Jazz",
      start: d(12), end: d(17), status: "CONFIRMED",
    },
    {
      userId: "seed_user_006", vehicleKey: "Peugeot 208",
      start: d(18), end: d(22), status: "PENDING",
    },
  ];

  let reservationCount = 0;
  let reviewCount = 0;

  for (const def of reservationDefs) {
    const vid = vehicleMap[def.vehicleKey];
    if (!vid) { console.warn(`Vehicle not found: ${def.vehicleKey}`); continue; }

    const days = Math.round((def.end.getTime() - def.start.getTime()) / 86400000);
    const vehicle = vehicles.find((v) => `${v.brand} ${v.model}` === def.vehicleKey)!;
    const totalPrice = days * vehicle.pricePerDay;

    const reservation = await prisma.reservation.create({
      data: {
        userId: def.userId,
        vehicleId: vid,
        startDate: def.start,
        endDate: def.end,
        totalPrice,
        status: def.status,
      },
    });
    reservationCount++;

    if (def.review && def.status === "CONFIRMED" && def.end < new Date()) {
      await prisma.review.create({
        data: {
          userId: def.userId,
          vehicleId: vid,
          reservationId: reservation.id,
          rating: def.review.rating,
          comment: def.review.comment,
        },
      });
      reviewCount++;
    }
  }

  console.log(`✓ Created ${reservationCount} reservations.`);
  console.log(`✓ Created ${reviewCount} reviews.`);
  console.log("Seeding complete.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
