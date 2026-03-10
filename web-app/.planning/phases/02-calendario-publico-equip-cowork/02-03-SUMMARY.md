---
phase: 02-calendario-publico-equip-cowork
plan: 03
subsystem: ui
tags: [react, calendar, rental, cowork, availability, monthly-api]

# Dependency graph
requires:
  - phase: 02-calendario-publico-equip-cowork
    plan: 01
    provides: useMonthlyAvailability hook + AvailabilityCalendar component
provides:
  - CoworkStandalone with per-plan AvailabilityCalendar integration
  - Self-contained cowork plan cards with date selection
affects: [aluguel-page]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Per-plan calendar pattern for cowork plans
    - Local state management for date selection per card
    - Z-index stacking for open calendars
    - WhatsApp pre-fill with selected date

key-files:
  created: []
  modified:
    - src/components/sections/rental/CoworkStandalone.tsx
    - src/app/aluguel/page.tsx

key-decisions:
  - "Each CoworkCard owns its own date selection state - no shared section-level picker"
  - "Calendar opens via 'Escolher data' button, closes on date select or outside click"
  - "Selected date shown inline with X button to clear"
  - "Calendar uses planIds mapping (cowork-starter, cowork-prime, cowork-premium) for API calls"

patterns-established:
  - "Per-card calendar pattern: button trigger + local state + positioned dropdown"
  - "Self-contained section components: no props needed from parent page"
  - "Legacy hook still used by StudioRenting and CoworkStudio until Phase 3"

# Metrics
duration: 168s
completed: 2026-03-10
---

# Phase 02 Plan 03: CoworkStandalone Per-Plan Calendar Integration Summary

**CoworkStandalone section updated with per-plan AvailabilityCalendar - each cowork plan card shows unavailable dates (0 spots = strikethrough) and pre-fills WhatsApp message with selected date**

## Performance

- **Duration:** 2min 48s
- **Started:** 2026-03-10T23:29:11Z
- **Completed:** 2026-03-10T23:31:59Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Integrated AvailabilityCalendar into each CoworkCard (per-plan calendars)
- Removed shared RentalDatePicker from section level
- Each plan card now owns its date selection state
- Calendar shows days with 0 spots as strikethrough (unavailable)
- WhatsApp CTA includes selected date in pre-filled message
- Updated aluguel page to remove legacy props from CoworkStandalone

## Task Commits

Each task was committed atomically:

1. **Task 1: Integrate per-plan AvailabilityCalendar into CoworkCard** - `a327bfd` (feat)
2. **Task 2: Update aluguel page to remove legacy props from CoworkStandalone** - `fcee4bb` (feat)

## Files Created/Modified

### Created
None

### Modified
- `src/components/sections/rental/CoworkStandalone.tsx` - Removed shared date picker, removed props interface, added local state (selectedDate, calendarOpen) to each CoworkCard, added "Escolher data" button with AvailabilityCalendar dropdown, removed old availability indicator, z-index handling for open calendar
- `src/app/aluguel/page.tsx` - Removed selectedDate/onDateChange/loading/getCoworkSpots/hasData props from CoworkStandalone component call

## Decisions Made

1. **Per-card state ownership:** Each CoworkCard owns its own `selectedDate` and `calendarOpen` state. No shared section-level state. This keeps cards independent and aligns with the per-item calendar pattern established in Phase 02 Plan 01.

2. **Plan ID mapping:** Used existing `planIds` mapping (cowork-starter, cowork-prime, cowork-premium) to connect UI plan names to API plan IDs. This mapping was already present in the component from legacy code.

3. **Calendar trigger UI:** "Escolher data" button placed after pricing block, before WhatsApp CTA. When date selected, shows formatted date inline with X button to clear. Button text changes to "Alterar data" when date is selected.

4. **Z-index stacking:** Card with open calendar gets `z-20`, calendar dropdown gets `z-50` (via component styles). This ensures calendar overlays adjacent cards without visual conflicts. Matches pattern from GearRenting (Plan 02-02).

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Phase 02 complete** - All equipment and cowork plans now have per-item/per-plan calendars:
- ✅ GearRenting (Plan 02-02): Per-item calendars
- ✅ CoworkStandalone (Plan 02-03): Per-plan calendars

**Phase 03 remaining:**
- 03-02: Integrate StudioHourlyCalendar into StudioRenting + update aluguel page

**No blockers or concerns.**

## Self-Check: PASSED

All claims verified:
- ✅ File modified: src/components/sections/rental/CoworkStandalone.tsx
- ✅ File modified: src/app/aluguel/page.tsx
- ✅ Commit exists: a327bfd (Task 1)
- ✅ Commit exists: fcee4bb (Task 2)
- ✅ TypeScript compiles: npx tsc --noEmit passes
- ✅ Build succeeds: npm run build completes

---
*Phase: 02-calendario-publico-equip-cowork*
*Completed: 2026-03-10*
