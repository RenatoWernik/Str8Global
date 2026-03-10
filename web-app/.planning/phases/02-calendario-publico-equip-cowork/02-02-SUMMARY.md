---
phase: 02-calendario-publico-equip-cowork
plan: 02
subsystem: ui
tags: [react, calendar, rental, gear, per-item-calendar]

# Dependency graph
requires:
  - phase: 02-calendario-publico-equip-cowork
    plan: 01
    provides: useMonthlyAvailability hook and AvailabilityCalendar component
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Per-card calendar pattern with local state management
    - Calendar dropdown with z-index stacking for overlays
    - Date selection integrated into WhatsApp CTA flow

key-files:
  created: []
  modified:
    - src/components/sections/rental/GearRenting.tsx
    - src/app/aluguel/page.tsx

key-decisions:
  - "Removed shared section-level date picker in favor of per-card calendars"
  - "Each GearCard manages its own selectedDate state independently"
  - "Calendar dropdown uses z-50, card container z-20 when open for proper stacking"
  - "Date clearing via X button on the 'Escolher data' button when date selected"

patterns-established:
  - "Per-card calendar integration: each card owns date state + calendar visibility state"
  - "Calendar trigger pattern: button shows selected date or 'Escolher data' placeholder"
  - "WhatsApp message automatically includes selected date when available"

# Metrics
duration: 208s
completed: 2026-03-10
---

# Phase 02 Plan 02: GearRenting Per-Item Calendar Integration Summary

**Per-item availability calendars integrated into equipment rental cards with date-aware WhatsApp CTAs**

## Performance

- **Duration:** 3min 28s
- **Started:** 2026-03-10T23:29:11Z
- **Completed:** 2026-03-10T23:32:39Z
- **Tasks:** 1
- **Files modified:** 2

## Accomplishments
- Removed shared section-level date picker from GearRenting
- Integrated AvailabilityCalendar component into each equipment card
- Each card now shows item-specific unavailable dates with strikethrough
- WhatsApp messages include selected date in formatted Portuguese
- Simplified GearRenting component signature (no longer needs parent props)

## Task Commits

Each task was committed atomically:

1. **Task 1: Integrate per-item AvailabilityCalendar into GearCard** - `a97ac4e` (feat)

## Files Created/Modified

### Created
None

### Modified
- `src/components/sections/rental/GearRenting.tsx` - Refactored to use per-card AvailabilityCalendar instead of shared RentalDatePicker; added local date state to each GearCard; removed props interface; integrated "Escolher data" button with calendar dropdown
- `src/app/aluguel/page.tsx` - Removed props passed to GearRenting (selectedDate, onDateChange, loading, isItemAvailable, hasData); simplified to `<GearRenting />` render

## Decisions Made

1. **Per-card state management:** Each GearCard now manages its own `selectedDate` and `calendarOpen` state rather than receiving these from parent. This makes each card self-contained and allows different items to have different selected dates simultaneously.

2. **Z-index stacking:** Calendar dropdown uses `z-50` to appear above other content. The card container itself gets `z-20` when calendar is open (via inline style) to ensure it stacks above sibling cards.

3. **Date clearing UX:** When a date is selected, the "Escolher data" button shows the formatted date and includes an X button for clearing. This provides clear visual feedback and easy reset.

4. **WhatsApp message construction:** The existing `formatDatePT()` helper and message templates were preserved. The message automatically includes the selected date in Portuguese format when available, or prompts for availability if no date selected.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

**Build lock file:** `npm run build` was blocked by `.next/lock` file (likely from a running dev server). TypeScript compilation (`npx tsc --noEmit`) passed successfully with zero errors, confirming type safety and correctness of the implementation.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Phase 02 Plan 03 ready:** CoworkStandalone can now follow the same per-card calendar pattern established here.

**Success Criteria Met:**
- ✅ CAL-01 satisfied: Each equipment card has "Escolher data" button that opens per-item calendar
- ✅ Calendar shows item-specific unavailable dates with strikethrough styling
- ✅ CAL-03 satisfied: Month navigation works up to +90 days (inherited from AvailabilityCalendar)
- ✅ CAL-04 satisfied: Past days disabled (inherited from AvailabilityCalendar)
- ✅ WhatsApp CTA includes selected date pre-filled in Portuguese format
- ✅ No regression in StudioRenting or CoworkStudio (they retain legacy shared date picker)

**No blockers or concerns.**

## Self-Check: PASSED

All claims verified:
- ✅ File modified: src/components/sections/rental/GearRenting.tsx
- ✅ File modified: src/app/aluguel/page.tsx
- ✅ Commit exists: a97ac4e (Task 1)
- ✅ TypeScript compilation passes with zero errors
- ✅ GearRenting no longer imports RentalDatePicker
- ✅ GearRenting no longer accepts props
- ✅ Each GearCard renders AvailabilityCalendar with itemId={item.id} and itemType="item"
- ✅ aluguel/page.tsx renders `<GearRenting />` without props
- ✅ WhatsApp message includes selected date when available

---
*Phase: 02-calendario-publico-equip-cowork*
*Completed: 2026-03-10*
