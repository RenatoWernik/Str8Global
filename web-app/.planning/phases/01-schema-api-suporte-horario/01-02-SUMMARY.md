---
phase: 01-schema-api-suporte-horario
plan: 02
subsystem: api
tags: [next.js, supabase, availability, calendar, api-routes]

# Dependency graph
requires:
  - phase: 01-01
    provides: "hourly reservation schema with start_time/end_time columns and overlap validation"
provides:
  - "Monthly availability API returning unavailable dates for items and cowork plans"
  - "Hourly availability API returning 15-slot schedule for studios"
  - "Database helpers getMonthlyAvailability and getHourlyAvailability"
affects: [02-calendario-per-item, 03-calendario-horario-studio]

# Tech tracking
tech-stack:
  added: []
  patterns: ["Graceful API error fallback pattern", "Cache-Control headers with revalidate"]

key-files:
  created:
    - src/app/api/rental/availability/monthly/route.ts
    - src/app/api/rental/availability/hourly/route.ts
  modified:
    - src/lib/database.ts
    - src/app/api/rental/availability/route.ts

key-decisions:
  - "Monthly API gracefully excludes hourly studio bookings from unavailable dates (shows partial availability)"
  - "Hourly slots span 8h-23h (15 one-hour slots) as defined in plan"
  - "Error fallback returns empty/all-available to prevent site breakage"

patterns-established:
  - "API routes use 300s revalidate with stale-while-revalidate for availability data"
  - "Date validation with regex before processing"
  - "Graceful degradation: errors return safe defaults (empty array or all available)"

# Metrics
duration: 3min
completed: 2026-03-10
---

# Phase 01 Plan 02: Monthly & Hourly Availability APIs Summary

**Public-facing availability APIs delivering monthly unavailable dates and hourly studio schedules for calendar components**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-10T18:40:53Z
- **Completed:** 2026-03-10T18:43:29Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Monthly availability API supports both item_id (gear/studio) and plan_id (cowork) with smart capacity tracking
- Hourly availability API returns 15-slot schedule (8h-23h) with client names for occupied slots
- Backward compatibility maintained for legacy single-date availability endpoint
- Graceful error handling prevents site breakage on database failures

## Task Commits

Each task was committed atomically:

1. **Task 1: Add database helpers and create monthly availability API** - `e370444` (feat)
2. **Task 2: Create hourly availability API and update existing route** - `f3beac0` (feat)

## Files Created/Modified
- `src/app/api/rental/availability/monthly/route.ts` - Monthly unavailable dates for items and cowork plans
- `src/app/api/rental/availability/hourly/route.ts` - Hourly studio slots with availability status
- `src/lib/database.ts` - Added getMonthlyAvailability() and getHourlyAvailability() helpers
- `src/app/api/rental/availability/route.ts` - Marked as legacy endpoint with backward compat comment

## Decisions Made

**1. Monthly API excludes hourly studio bookings from unavailable dates**
- Rationale: Studios with hourly bookings should show partial availability in monthly view, not full-day unavailability. This allows users to see that some hours may still be available.

**2. Graceful error fallback strategy**
- Monthly API returns `{ unavailableDates: [] }` on error (everything available)
- Hourly API returns all 15 slots as available on error
- Rationale: Better UX to show optimistic availability than to break the calendar component

**3. Cowork capacity checking**
- Monthly API aggregates spots per day and marks dates unavailable only when totalSpots reached
- Rationale: Allows multiple cowork reservations until capacity is full

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Ready for Phase 02 (calendario-per-item):
- Monthly API endpoint available at `/api/rental/availability/monthly?item_id=X&month=YYYY-MM`
- Returns `{ unavailableDates: ["2026-03-15", ...] }` for calendar blackout dates

Ready for Phase 03 (calendario-horario-studio):
- Hourly API endpoint available at `/api/rental/availability/hourly?studio_id=X&date=YYYY-MM-DD`
- Returns `{ date, studio_id, slots: [{ hour: "10:00", available: false, reservation: "Client" }] }`

No blockers or concerns.

## Self-Check: PASSED

All files and commits verified:
- FOUND: src/app/api/rental/availability/monthly/route.ts
- FOUND: src/app/api/rental/availability/hourly/route.ts
- FOUND: e370444 (Task 1 commit)
- FOUND: f3beac0 (Task 2 commit)

---
*Phase: 01-schema-api-suporte-horario*
*Completed: 2026-03-10*
