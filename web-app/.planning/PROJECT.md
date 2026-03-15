# Str8Global

## What This Is

Premium marketing and photography agency website for Str8Global, based in Lisbon/Cascais. Includes public-facing portfolio, services, rental/booking pages, and a hidden admin dashboard for rental management.

## Core Value

Owners (Igor & Marta) can manage all rental operations from one dashboard, and customers can instantly see availability and book via WhatsApp.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

- ✓ Public website with portfolio, services, contact — v1.0
- ✓ Rental page with gear, studio, cowork categories — v1.0
- ✓ WhatsApp CTA integration for bookings — v1.0
- ✓ Basic date-based availability checking — v1.0
- ✓ Restricted admin dashboard with Supabase backend — v1.0
- ✓ CRUD for reservations (gear, studio, cowork) — v1.0
- ✓ Admin calendar month view — v1.0
- ✓ Admin analytics and KPIs — v1.0
- ✓ Supabase Auth for admin login — v1.0
- ✓ Per-item monthly calendars for equipment/cowork — v1.1
- ✓ Hourly studio calendars with Google Calendar style — v1.1
- ✓ Mobile bottom sheet calendars with native UX — v1.2
- ✓ Haptic feedback and spring animations on mobile — v1.2

### Active

<!-- Current scope: v1.3 Redesign Página Espaço -->

- [ ] Redesign completo das secções pós-Hero da página Espaço
- [ ] Layouts criativos e fora do padrão para apresentação do espaço
- [ ] Efeitos e animações interactivas que prendem a atenção
- [ ] Reutilizar todas as 13 fotos existentes sem adicionar novas
- [ ] Manter Hero Section 100% intacta
- [ ] Manter CTA Section actual

### Out of Scope

- Online payment/checkout — Bookings continue via WhatsApp
- Automated email notifications — Not needed for current workflow
- Multi-language — Site is PT-PT only

## Context

- Database: Supabase PostgreSQL (tables: reservations, cowork_reservations, capacity)
- Current calendar: Single date picker shared across all categories, checks availability for one date at a time
- Studios now use hourly reservations (8h-23h slots) — fixed in v1.1
- Mobile calendars use bottom sheet pattern with vaul — completed in v1.2
- Admin dashboard uses Jarvis/dark theme with cyan accents
- Public site uses dark theme with magenta (#FF10F0) accent
- Página Espaço actual: Hero (Globe 3D) + 4 secções de conteúdo + CTA, tudo muito estático e genérico

## Constraints

- **Stack**: Next.js 16 + React 19 + TypeScript 5 + Tailwind v4
- **Database**: Supabase (existing tables must be migrated, not replaced)
- **Animations**: GSAP + Framer Motion
- **No breaking changes**: Public site must continue working during migration
- **Studio hours**: 8h-23h, 1h slots

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Supabase for DB | Already in use, proven reliable | ✓ Good |
| Supabase Auth for login | Replaced .env credentials, more secure | ✓ Good |
| WhatsApp for bookings | No payment integration needed, personal touch | ✓ Good |
| Per-item calendar (equipment) | Users need to see specific item availability | ✓ Good |
| Hourly slots for studios | Studios are priced/booked by hour, not day | ✓ Good |
| Portal rendering for desktop modals | Escapes overflow-hidden + transform parents | ✓ Good |
| Bottom sheet pattern for mobile calendars | Native mobile feel, thumb-zone ergonomics | ✓ Good |

## Current Milestone: v1.3 Redesign Página Espaço

**Goal:** Redesign criativo e imersivo de todas as secções da página "Espaço" (excepto Hero e CTA) — layouts não-convencionais, efeitos interactivos, animações que prendem a atenção, usando apenas as 13 fotos existentes. Inspiração de ReactBits e LightsWind.

---
*Last updated: 2026-03-15 after milestone v1.3 started*
