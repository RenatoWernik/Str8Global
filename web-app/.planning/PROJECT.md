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

### Active

<!-- Current scope: v1.2 Mobile-Native Calendar Experience -->

- [ ] Full-screen bottom sheet calendar for equipment/cowork (mobile)
- [ ] Full-screen bottom sheet hourly calendar for studios (mobile)
- [ ] Swipe gestures for month/day navigation (touch events)
- [ ] Large touch targets (min 44px) and thumb-zone ergonomics
- [ ] Mobile-specific animations and transitions (spring physics)
- [ ] Haptic feedback on date/slot selection (Vibration API)
- [ ] Desktop calendar code must remain completely unchanged

### Out of Scope

- Online payment/checkout — Bookings continue via WhatsApp
- Automated email notifications — Not needed for current workflow
- Multi-language — Site is PT-PT only

## Context

- Database: Supabase PostgreSQL (tables: reservations, cowork_reservations, capacity)
- Current calendar: Single date picker shared across all categories, checks availability for one date at a time
- Studios currently use day-based reservations but are priced per hour — mismatch that v1.1 fixes
- Admin dashboard uses Jarvis/dark theme with cyan accents
- Public site uses dark theme with magenta (#FF10F0) accent

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
| Bottom sheet pattern for mobile calendars | Native mobile feel, thumb-zone ergonomics | — Pending |

## Current Milestone: v1.2 Mobile-Native Calendar Experience

**Goal:** Redesign completo da experiência mobile dos calendários (mensal e horário) com padrões nativos — bottom sheets, gestos swipe, touch targets grandes, animações spring — sem alterar a versão desktop já aprovada.

---
*Last updated: 2026-03-13 after milestone v1.2 started*
