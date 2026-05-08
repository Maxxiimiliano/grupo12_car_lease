# CarLease 🚗

Aplicación web de alquiler y venta de vehículos — Proyecto Final DAM Grupo 12 (CEAC 2025-2026).

**Demo en producción:** https://grupo12-car-lease.vercel.app

---

## Tecnologías

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16 (App Router) + TypeScript |
| Estilos | Tailwind CSS v4 |
| Base de datos | PostgreSQL (Neon Serverless) + Prisma ORM v7 |
| Autenticación | Clerk v7 |
| Pagos | Stripe (Checkout Sessions + Webhooks) |
| Email | Resend |
| Imágenes | Cloudinary |
| Despliegue | Vercel |
| Tests | Playwright (E2E) |

---

## Funcionalidades

### Usuario
- Registro e inicio de sesión (Clerk)
- Catálogo de vehículos con filtros (ciudad, categoría, combustible, transmisión, precio, búsqueda)
- Detalle de vehículo con valoraciones y punto de recogida
- Reserva de vehículos con pago seguro mediante Stripe
- Historial de reservas: ver, cancelar
- Dejar valoración tras finalizar el alquiler
- Catálogo de vehículos en venta con solicitud de visita a oficina
- Página de oficinas con mapa OpenStreetMap

### Administrador
- Dashboard con métricas: ingresos, reservas, usuarios, vehículos más reservados
- Gestión completa de vehículos (CRUD + subida de imagen a Cloudinary)
- Gestión completa de oficinas (CRUD)
- Gestión de reservas con filtrado por estado y cancelación
- Gestión de usuarios y asignación de rol administrador

---

## Instalación local

### Requisitos previos
- Node.js 18+
- Cuenta en [Neon](https://neon.tech) (PostgreSQL serverless)
- Cuenta en [Clerk](https://clerk.com)
- Cuenta en [Stripe](https://stripe.com)
- Cuenta en [Resend](https://resend.com)
- Cuenta en [Cloudinary](https://cloudinary.com)

### 1. Clonar el repositorio

```bash
git clone https://github.com/Maxxiimiliano/grupo12_car_lease.git
cd grupo12_car_lease
npm install
```

### 2. Variables de entorno

Copia `.env.example` a `.env.local` y rellena los valores:

```bash
cp .env.example .env.local
```

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | Connection string de Neon PostgreSQL |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clave pública de Clerk |
| `CLERK_SECRET_KEY` | Clave secreta de Clerk |
| `CLERK_WEBHOOK_SECRET` | Secret del webhook de Clerk |
| `STRIPE_SECRET_KEY` | Clave secreta de Stripe |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Clave pública de Stripe |
| `STRIPE_WEBHOOK_SECRET` | Secret del webhook de Stripe |
| `RESEND_API_KEY` | API key de Resend |
| `ADMIN_EMAIL` | Email que recibe solicitudes de visita |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Nombre del cloud de Cloudinary |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Upload preset de Cloudinary |
| `NEXT_PUBLIC_APP_URL` | URL base de la app (`http://localhost:3000` en local) |

### 3. Base de datos

```bash
npm run db:push    # Crea las tablas
npm run db:seed    # Puebla con datos de ejemplo (20 vehículos, 3 oficinas, reservas y valoraciones)
```

### 4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

---

## Rol administrador

Para dar acceso de administrador a un usuario:
1. Entra en el [dashboard de Clerk](https://dashboard.clerk.com)
2. Ve a **Users** → selecciona el usuario
3. En **Public Metadata** añade: `{ "role": "admin" }`

---

## Webhooks en local

Para recibir eventos de Stripe y Clerk en desarrollo, usa [Stripe CLI](https://stripe.com/docs/stripe-cli):

```bash
# Stripe
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Clerk: configura el webhook en el Dashboard de Clerk apuntando a tu URL de ngrok
```

---

## Scripts disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run db:push      # Sincroniza el schema con la BD
npm run db:migrate   # Crea y aplica una migración
npm run db:seed      # Pobla la BD con datos de ejemplo
npm run db:studio    # Abre Prisma Studio
npm run test:e2e     # Ejecuta los tests E2E con Playwright
```

---

## Tests E2E

Los tests con Playwright cubren las rutas públicas principales:

```bash
# Instalar navegadores (solo la primera vez)
npx playwright install chromium

# Ejecutar (requiere servidor corriendo en localhost:3000)
npm run test:e2e
```

Cubren:
- Página de inicio: estadísticas en tiempo real y vehículos más valorados
- Catálogo de vehículos: grid, filtros (ciudad, categoría), búsqueda por texto
- Página de oficinas con información de contacto
- Catálogo de vehículos en venta
- Redirección a login en rutas protegidas (`/my-reservations`, `/admin`)

---

## Estructura del proyecto

```
app/
  admin/            # Panel de administración (vehículos, reservas, oficinas, usuarios)
  api/              # Endpoints REST
  my-reservations/  # Reservas del usuario autenticado
  offices/          # Página pública de oficinas
  sale/             # Catálogo de venta + solicitud de visita
  vehicles/         # Catálogo de alquiler
components/
  admin/            # Componentes del panel admin
  ui/               # Primitivos de UI (Button, Card, Badge…)
lib/
  email.ts          # Envío de emails con Resend
  prisma.ts         # Singleton de Prisma
  stripe.ts         # Singleton de Stripe
  utils.ts          # Utilidades (formatCurrency, formatDate…)
prisma/
  schema.prisma     # Esquema de la BD
  seed.ts           # Script de seed con datos realistas
e2e/                # Tests Playwright
```

---

## Equipo

**DAM Grupo 12 · CEAC 2025-2026**
