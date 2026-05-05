# CarLease – Claude Code Guide

## Project
Vehicle reservation web app – DAM Grupo 12 final project (CEAC 2025-2026).

## Stack
- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL via Prisma ORM v7
- **Auth**: Clerk (`@clerk/nextjs`)
- **Payments**: Stripe (Checkout Sessions + Webhooks)
- **Deploy**: Vercel

## Key paths
| Path | Purpose |
|------|---------|
| `app/` | Next.js App Router pages and API routes |
| `app/api/` | REST API endpoints |
| `app/admin/` | Admin-only panel (role=admin in Clerk metadata) |
| `components/` | Shared React components |
| `components/ui/` | Base UI primitives (Button, Card, Badge…) |
| `components/admin/` | Admin-specific components |
| `lib/prisma.ts` | Prisma singleton |
| `lib/stripe.ts` | Stripe singleton |
| `lib/utils.ts` | `cn()`, `formatCurrency()`, `formatDate()`, `diffInDays()` |
| `prisma/schema.prisma` | DB schema (User, Vehicle, Reservation, Payment, Review) |
| `prisma/seed.ts` | Sample vehicle data |
| `middleware.ts` | Clerk auth + admin role guard |

## Dev commands
```bash
npm run dev          # Start dev server
npm run db:push      # Push schema to DB (no migration file)
npm run db:migrate   # Create + apply migration
npm run db:seed      # Seed sample vehicles
npm run db:studio    # Open Prisma Studio
```

## Environment variables
Copy `.env.example` → `.env.local` and fill in real values:
- `DATABASE_URL` – PostgreSQL connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY`
- `STRIPE_SECRET_KEY` + `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` + `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_APP_URL`

## Admin role
Set `publicMetadata: { role: "admin" }` on a Clerk user via the Clerk dashboard to grant admin access.

## Webhooks
- Stripe → `/api/webhooks/stripe` (confirms reservations after payment)
- Clerk → `/api/webhooks/clerk` (syncs user data to PostgreSQL)
