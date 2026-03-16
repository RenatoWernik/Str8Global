---
phase: 01-cowork-capacity-logic
plan: 01
subsystem: rental, api, ui, database
tags: [cowork, capacity, supabase, availability, calendar, dashboard]

requires: []
provides:
  - Cowork capacity validation (backend prevents overbooking)
  - Monthly availability API returns spots-by-date for cowork plans
  - Public calendar shows real-time spots per day
  - Admin dashboard shows cowork occupancy per plan
  - Admin form validates capacity before submission
affects: []

tech-stack:
  added: []
  patterns:
    - "checkCoworkCapacity() pattern for cross-day capacity validation"
    - "MonthlyAvailabilityResult union type (items vs plans)"
    - "spotsByDate Map for O(1) client-side occupancy lookup"

key-files:
  modified:
    - src/data/rentalData.ts
    - src/lib/database.ts
    - src/app/api/rental/availability/monthly/route.ts
    - src/hooks/useMonthlyAvailability.ts
    - src/components/ui/AvailabilityCalendar.tsx
    - src/components/sections/rental/CoworkStandalone.tsx
    - src/components/sections/rental/CoworkStudio.tsx
    - src/components/ui/CoworkReservationFormModal.tsx
    - src/app/restricted/dashboard/calendario/page.tsx

key-decisions:
  - "checkCoworkCapacity returns worst-day info for date ranges, not just pass/fail"
  - "API backward compatible: items get unavailableDates only, plans get spotsByDate too"
  - "Color coding: green <50%, amber 50-75%, red >75% occupancy"

patterns-established:
  - "Capacity check before DB insert/update in database.ts"
  - "MonthlyAvailabilityResult interface with optional spotsByDate"
  - "COWORK_CAPACITY map built from rentalData for dashboard components"

completed: 2026-03-16
---

# Phase 1 Plan 01: Cowork Capacity Logic Summary

**Lógica completa de capacidade cowork (Starter=4, Prime=4, Premium=2) implementada no backend, calendário público e dashboard admin — com validação de overbooking end-to-end.**

## Performance

| Metric | Value |
|--------|-------|
| Tasks | 3 completed |
| Files modified | 9 |
| Build | `npm run build` ✓ |
| TypeScript | `npx tsc --noEmit` ✓ |

## Acceptance Criteria Results

| Criterion | Status | Notes |
|-----------|--------|-------|
| AC-1: Dados de capacidade corretos | Pass | Starter=4, Prime=4, Premium=2 em coworkPlans e coworkStudioPlans |
| AC-2: Backend rejeita overbooking | Pass | `checkCoworkCapacity()` + validação em create/update com erro CAPACITY_EXCEEDED |
| AC-3: Calendário público mostra vagas | Pass | Indicadores X/Y com cores no AvailabilityCalendar via showSpots+spotsByDate |
| AC-4: Dashboard mostra ocupação cowork | Pass | Barras de progresso por plano no day detail panel + badges CW nas cells |
| AC-5: Formulário admin valida capacidade | Pass | Fetch real-time + disable submit quando excede + border vermelha no input |

## Accomplishments

- **Backend capacity validation**: `checkCoworkCapacity()` verifica todos os dias num range e retorna o pior dia — previne overbooking tanto na criação como edição de reservas
- **Public calendar enriched**: API monthly agora retorna `spotsByDate` para planos cowork, calendário mostra vagas restantes por dia com cores (verde/amarelo/vermelho)
- **Admin dashboard awareness**: Calendário admin mostra badges de ocupação cowork por dia + painel lateral com barras de progresso por plano
- **Admin form safety**: Formulário de reserva cowork verifica disponibilidade em tempo real com debounce e bloqueia submissão quando lotado

## Files Modified

| File | Change | Purpose |
|------|--------|---------|
| `src/data/rentalData.ts` | Modified | Prime totalSpots 6→4 (cowork + cowork-studio) |
| `src/lib/database.ts` | Modified | Added `checkCoworkCapacity()`, validation in create/update, `MonthlyAvailabilityResult` type |
| `src/app/api/rental/availability/monthly/route.ts` | Modified | Pass through full result (spotsByDate for plans) |
| `src/hooks/useMonthlyAvailability.ts` | Modified | Added `spotsByDate` Map to return, parse from API |
| `src/components/ui/AvailabilityCalendar.tsx` | Modified | Added showSpots/totalSpots props, spot color indicators, spots legend |
| `src/components/sections/rental/CoworkStandalone.tsx` | Modified | Pass showSpots + totalSpots to AvailabilityCalendar |
| `src/components/sections/rental/CoworkStudio.tsx` | Modified | Fixed per-card planId (was hardcoded), added showSpots/totalSpots |
| `src/components/ui/CoworkReservationFormModal.tsx` | Modified | Real-time availability checking, capacity validation, disable on exceed |
| `src/app/restricted/dashboard/calendario/page.tsx` | Modified | COWORK_CAPACITY map, occupancy badges in cells, progress bars in detail panel |

## Decisions Made

| Decision | Rationale | Impact |
|----------|-----------|--------|
| Return worst-day in capacity check | Date ranges need per-day check; worst-day gives best error message | Clear user feedback on which day is full |
| Backward-compatible API | Items don't need spotsByDate, only plans do | Zero breaking changes for gear/studio calendars |
| Build COWORK_CAPACITY from rentalData | Single source of truth for spot counts | No hardcoded values in dashboard |

## Deviations from Plan

### Auto-fixed Issues

**1. CoworkStudio.tsx hardcoded itemId bug**
- **Found during:** Task 2
- **Issue:** All 3 plan cards used hardcoded `itemId="coworkstudio-starter"` for AvailabilityCalendar
- **Fix:** Changed to `planIds[plan.name]` for correct per-plan availability
- **Files:** `src/components/sections/rental/CoworkStudio.tsx`
- **Verification:** TypeScript check passed, each card now queries correct plan

**Total impact:** Essential bug fix, no scope creep

### Deferred Items

None

## Issues Encountered

None

## Next Phase Readiness

**Ready:**
- Capacity logic complete and consistent across all interfaces
- All 5 acceptance criteria met
- Build passes cleanly

**Concerns:**
- No automated tests for capacity validation (future phase)
- Capacity check relies on Supabase queries at insert time (no DB-level constraint)

**Blockers:**
- None

---
*Phase: 01-cowork-capacity-logic, Plan: 01*
*Completed: 2026-03-16*
