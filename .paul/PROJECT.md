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
- ✓ Globo mobile otimizado sem clipping (4 hero sections) — Phase 2
- ✓ Menu mobile com botão fechar dentro do overlay — Phase 2
- ✓ Calendário estúdios mobile sem clipping — Phase 2
- ✓ Calendário estúdios desktop com navegação por meses — Phase 3
- ✓ Secção Estúdios separada: Cinema (2 fotos) + Podcast (3 fotos) — Phase 3
- ✓ Textos overlay removidos da secção Cowork — Phase 3

## Key Decisions
| Decision | Rationale | Phase |
|----------|-----------|-------|
| checkCoworkCapacity returns worst-day info | Better error messages for date ranges | 1 |
| API backward-compatible (items vs plans) | Zero breaking changes for gear/studio | 1 |
| Capacity from rentalData, not hardcoded | Single source of truth | 1 |
| Globo mobile w-[140%] max-w-[600px] | Equilibrio imersão vs sem overflow horizontal | 2 |
| Botão X dentro do overlay z-[60] | Navbar z-50 fica abaixo — stacking context | 2 |
| Navegação mês desktop-only | Mobile já compacto — dia suficiente | 3 |
| Podcast secção alinhada direita | Alternância visual com Estúdios (esquerda) | 3 |

---
*Last updated: 2026-03-18 after Phase 2+3 (v1.5)*
