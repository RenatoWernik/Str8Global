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

<!-- Current scope: v1.1 Calendar Overhaul -->

- [ ] Per-item availability calendar for equipment (days strikethrough)
- [ ] Per-plan availability calendar for cowork (days strikethrough when full)
- [ ] Hourly booking calendar for studios (8h-23h, 1h slots, Google Calendar style)
- [ ] Admin hourly calendar view for studio management
- [ ] Database schema update for hourly reservations (start_time, end_time)
- [ ] Hourly availability API for studios
- [ ] Conflict validation for studio time slots

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
| Per-item calendar (equipment) | Users need to see specific item availability | — Pending |
| Hourly slots for studios | Studios are priced/booked by hour, not day | — Pending |

## Current Milestone: v1.1 Novas Versões de Calendários

**Goal:** Overhaul all calendar experiences — per-item day calendars for equipment/cowork, hourly Google Calendar-style for studios — across public site and admin dashboard, with Supabase schema updates.

---
*Last updated: 2026-03-10 after milestone v1.1 started*
