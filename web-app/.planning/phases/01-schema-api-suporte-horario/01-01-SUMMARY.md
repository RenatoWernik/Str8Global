---
phase: 01-schema-api-suporte-horario
plan: 01
subsystem: database
tags: [supabase, typescript, reservations, overlap-validation]

# Dependency graph
requires:
  - phase: 00-restricted-dashboard
    provides: Supabase backend with reservations table and CRUD operations
provides:
  - Hourly reservation support with start_time/end_time fields
  - Overlap validation preventing double-booking of studio time slots
  - TypeScript types for time-based reservations
affects: [02-api-disponibilidade-horaria, 03-ui-calendario-horario]

# Tech tracking
tech-stack:
  added: []
  patterns: [overlap-validation-pattern, time-conflict-checking]

key-files:
  created: []
  modified: [src/types/database.ts, src/lib/database.ts]

key-decisions:
  - "start_time/end_time stored as TEXT in HH:MM format (nullable for backward compatibility)"
  - "Overlap validation only for studio reservations with time fields set"
  - "Gear reservations continue using day-based model without time fields"

patterns-established:
  - "Time overlap check: existing.start_time < endTime AND existing.end_time > startTime"
  - "Validation runs before insert/update, throws CONFLICT error on overlap"

# Metrics
duration: ~10min
completed: 2026-03-10
---

# Phase 1 Plan 1: Schema & API Suporte Horario Summary

**Hourly studio reservation support with time-based overlap validation, backward-compatible with existing gear day-based reservations**

## Performance

- **Duration:** ~10 minutes
- **Started:** 2026-03-10 (continuation from checkpoint)
- **Completed:** 2026-03-10
- **Tasks:** 2 (1 checkpoint manual setup, 1 automated implementation)
- **Files modified:** 2

## Accomplishments
- Added start_time/end_time columns to Supabase reservations table (Task 1 - user completed)
- Updated TypeScript types with optional start_time/end_time fields in ReservationRow, ReservationInsert, ReservationUpdate
- Implemented checkTimeConflict() helper function to detect overlapping studio time slots
- Added overlap validation to createReservation() and updateReservation() for studio reservations with time fields
- Maintained backward compatibility: gear reservations without time fields continue working unchanged

## Task Commits

Each task was committed atomically:

1. **Task 1: Add start_time and end_time columns to Supabase reservations table** - (checkpoint:human-action - user confirmed completion)
2. **Task 2: Update TypeScript types and CRUD with overlap validation** - `a102418` (feat)

## Files Created/Modified
- `src/types/database.ts` - Added start_time/end_time optional fields to ReservationRow, ReservationInsert, ReservationUpdate
- `src/lib/database.ts` - Added checkTimeConflict() helper, updated createReservation() and updateReservation() with overlap validation

## Decisions Made

**Time field format:** Chose TEXT type with HH:MM format (e.g., "10:00", "14:00") for simplicity and readability. Nullable to maintain backward compatibility with existing gear reservations.

**Validation scope:** Overlap validation only runs for studio reservations (`item_type === 'studio'`) that have both start_time and end_time populated. Gear reservations (no time fields) skip validation entirely.

**Conflict detection logic:** Uses time overlap formula: `existing.start_time < endTime AND existing.end_time > startTime`. Query filters for active reservations on same item/date with non-null time fields.

**Error handling:** Throws `Error('CONFLICT: Time slot overlaps with existing reservation')` on overlap, allowing caller to handle gracefully.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - TypeScript compilation passed, all verification criteria met.

## User Setup Required

**Manual Supabase configuration completed.** User successfully ran:

```sql
ALTER TABLE reservations
  ADD COLUMN start_time TEXT DEFAULT NULL,
  ADD COLUMN end_time TEXT DEFAULT NULL;

COMMENT ON COLUMN reservations.start_time IS 'Start hour for studio reservations (e.g. "10:00"). NULL for gear/day-based reservations.';
COMMENT ON COLUMN reservations.end_time IS 'End hour for studio reservations (e.g. "14:00"). NULL for gear/day-based reservations.';
```

Verification confirmed columns exist in Supabase Dashboard -> Table Editor.

## Next Phase Readiness

**Ready for next phase.** Schema and TypeScript foundation complete. API layer can now:
- Create studio reservations with hourly time slots
- Validate overlaps before inserting/updating
- Maintain existing gear reservation behavior

**Next steps:**
- Phase 1 Plan 2: Add public API endpoints for hourly availability queries
- Phase 1 Plan 3: Update admin dashboard UI to support hourly time selection

## Self-Check: PASSED

All claims verified:
- `src/types/database.ts` - FOUND
- `src/lib/database.ts` - FOUND
- Commit `a102418` - FOUND

---
*Phase: 01-schema-api-suporte-horario*
*Completed: 2026-03-10*
