---
phase: 02-calendario-publico-equip-cowork
plan: 01
subsystem: ui
tags: [react, hooks, calendar, rental, availability, monthly-api]

# Dependency graph
requires:
  - phase: 01-schema-api-horario
    provides: Monthly availability API endpoint at /api/rental/availability/monthly
provides:
  - useMonthlyAvailability hook for fetching unavailable dates by item/plan
  - AvailabilityCalendar reusable component with per-item unavailability display
affects: [02-02-gear-integration, 02-03-cowork-integration]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Per-item calendar pattern with dedicated hooks
    - Set<string> for O(1) date lookup performance
    - 300ms debounce on month navigation fetches
    - Strikethrough visual for unavailable dates

key-files:
  created:
    - src/hooks/useMonthlyAvailability.ts
    - src/components/ui/AvailabilityCalendar.tsx
  modified: []

key-decisions:
  - "Hook uses Set<string> instead of string[] for O(1) date lookup performance"
  - "Calendar component is the panel only - parent cards provide trigger buttons"
  - "Unavailable dates shown with strikethrough + reduced opacity (text-white/30)"
  - "Graceful fallback on API error returns empty set (all available)"

patterns-established:
  - "Monthly availability hook pattern: id + type + month → Set<unavailableDates>"
  - "Calendar reuse pattern: component accepts itemId + itemType props for any gear/cowork use case"
  - "Visual hierarchy: past (disabled gray) → unavailable (strikethrough) → available (normal) → selected (magenta)"

# Metrics
duration: 112s
completed: 2026-03-10
---

# Phase 02 Plan 01: Hook & Calendar Foundation Summary

**Reusable monthly availability hook and calendar component with per-item unavailability display using strikethrough styling**

## Performance

- **Duration:** 1min 52s
- **Started:** 2026-03-10T23:24:05Z
- **Completed:** 2026-03-10T23:25:57Z
- **Tasks:** 2
- **Files created:** 2

## Accomplishments
- Created data-fetching hook that fetches unavailable dates for any item or cowork plan
- Created calendar UI component with unavailable dates visually struck through
- Established reusable pattern for Wave 2 integrations (GearRenting + CoworkStandalone)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create useMonthlyAvailability hook** - `ef3684d` (feat)
2. **Task 2: Create AvailabilityCalendar component** - `9e42624` (feat)

## Files Created/Modified

### Created
- `src/hooks/useMonthlyAvailability.ts` - Hook that fetches unavailable dates from monthly API, returns Set<string> for O(1) lookup, handles loading/error states gracefully with 300ms debounce
- `src/components/ui/AvailabilityCalendar.tsx` - Monthly calendar grid with per-item unavailability display (strikethrough styling), month navigation up to +90 days, past dates disabled, dark theme with magenta accent

### Modified
None

## Decisions Made

1. **Set vs Array for unavailableDates:** Used Set<string> instead of string[] for O(1) lookup performance when rendering day cells. Each day checks `unavailableDates.has(dateStr)` which is much faster than array.includes() for large datasets.

2. **Component architecture:** AvailabilityCalendar is the dropdown panel only (no trigger button). Parent components (GearRenting cards, CoworkStandalone cards) will provide their own trigger buttons. This keeps the calendar focused and reusable.

3. **Strikethrough visual:** Unavailable dates use `line-through` CSS class with `text-white/30` opacity. This provides clear visual distinction from past dates (solid gray) and available dates (normal text).

4. **Graceful error fallback:** On API error, hook returns empty Set (everything available) rather than breaking the UI. Matches the API's own fallback pattern established in Phase 01.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for Wave 2 integrations:**
- GearRenting (Plan 02-02) can now integrate per-item calendars
- CoworkStandalone (Plan 02-03) can now integrate per-plan calendars
- Both will reuse useMonthlyAvailability + AvailabilityCalendar

**No blockers or concerns.**

## Self-Check: PASSED

All claims verified:
- ✅ File exists: src/hooks/useMonthlyAvailability.ts
- ✅ File exists: src/components/ui/AvailabilityCalendar.tsx
- ✅ Commit exists: ef3684d (Task 1)
- ✅ Commit exists: 9e42624 (Task 2)

---
*Phase: 02-calendario-publico-equip-cowork*
*Completed: 2026-03-10*
