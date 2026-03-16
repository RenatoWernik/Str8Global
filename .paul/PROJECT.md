# Str8Global — Project Definition

## Core
- **What:** Premium marketing & photography agency website (Lisboa)
- **Stack:** Next.js 16 + React 19 + TypeScript 5 + Tailwind v4 + GSAP + Framer Motion
- **Backend:** Supabase (reservations, cowork_reservations, capacity tables)
- **Theme:** Dark (#000 bg, #fff text, #FF10F0 accent magenta)

## Value Proposition
Website público para mostrar serviços + sistema de reservas (gear, estúdios, cowork) com dashboard admin.

## Key Architecture
- Public site: `src/app/` (pages) + `src/components/sections/rental/` (rental UI)
- Dashboard admin: `src/app/restricted/dashboard/` (reservas, calendário)
- API: `src/app/api/` (rental availability, restricted CRUD)
- Data layer: `src/lib/database.ts` (Supabase queries)
- Types: `src/types/database.ts`

## Validated Requirements
- ✓ Cowork capacity logic (Starter=4, Prime=4, Premium=2) — Phase 1
- ✓ Backend overbooking prevention via checkCoworkCapacity() — Phase 1
- ✓ Public calendar shows real-time spots per day — Phase 1
- ✓ Admin dashboard cowork occupancy display — Phase 1
- ✓ Admin form capacity validation — Phase 1

## Key Decisions
| Decision | Rationale | Phase |
|----------|-----------|-------|
| checkCoworkCapacity returns worst-day info | Better error messages for date ranges | 1 |
| API backward-compatible (items vs plans) | Zero breaking changes for gear/studio | 1 |
| Capacity from rentalData, not hardcoded | Single source of truth | 1 |

---
*Last updated: 2026-03-16 after Phase 1*
