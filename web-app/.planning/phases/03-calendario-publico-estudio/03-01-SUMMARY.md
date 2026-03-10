---
phase: 03-calendario-publico-estudio
plan: 01
subsystem: rental/studio-calendar
tags: [frontend, hook, ui-component, hourly-booking]
dependency_graph:
  requires: [01-02-api-hourly-availability]
  provides: [studio-hourly-hook, studio-hourly-calendar-ui]
  affects: [StudioRenting]
tech_stack:
  added: [useHourlyAvailability, StudioHourlyCalendar]
  patterns: [react-hooks, framer-motion-stagger, fetch-debounce, abort-controller]
key_files:
  created:
    - src/hooks/useHourlyAvailability.ts
    - src/components/ui/StudioHourlyCalendar.tsx
  modified: []
decisions:
  - context: "Hook data fetching pattern"
    decision: "Use useState + useEffect with 300ms debounce, matching existing useRentalAvailability pattern"
    alternatives: ["React Query", "SWR", "Immediate fetch"]
    rationale: "Consistency with codebase patterns, no new dependencies needed"
  - context: "Calendar visual design"
    decision: "Google Calendar-style vertical day view with 15 one-hour slots"
    alternatives: ["Week view", "Grid layout", "Timeline"]
    rationale: "Matches requirement for clear hourly visibility, mobile-friendly vertical scroll"
  - context: "Past hour handling"
    decision: "Disable past hours only for today's date with reduced opacity"
    alternatives: ["Hide past hours", "Show with warning", "Allow booking"]
    rationale: "Prevents confusion, shows full day context, clear visual feedback"
  - context: "Loading state"
    decision: "Show 15 skeleton placeholders during fetch"
    alternatives: ["Spinner", "No loading UI", "Previous data"]
    rationale: "Reduces layout shift, matches slot count, better UX"
metrics:
  duration_minutes: 2
  tasks_completed: 2
  files_created: 2
  commits: 2
  completed_date: 2026-03-10
---

# Phase 03 Plan 01: Studio Hourly Calendar Foundation

**One-liner:** Created useHourlyAvailability hook and StudioHourlyCalendar component — the foundational building blocks for studio hourly booking with Google Calendar-style day view.

## What Was Built

This plan delivered the two core pieces needed for the studio hourly booking experience:

1. **useHourlyAvailability hook** — Fetches hourly slot data from the existing `/api/rental/availability/hourly` endpoint with proper loading states, error handling, and graceful fallback.

2. **StudioHourlyCalendar component** — A Google Calendar-style day view that renders 15 hourly time slots (08:00-22:00) with clear visual distinction between available and occupied slots.

These components are reusable and will be integrated into `StudioRenting` in Wave 2 (Plan 02).

## Tasks Completed

| # | Task Name | Commit | Files Created |
|---|-----------|--------|---------------|
| 1 | Create useHourlyAvailability hook | `aaa4159` | `src/hooks/useHourlyAvailability.ts` |
| 2 | Create StudioHourlyCalendar component | `8e5b904` | `src/components/ui/StudioHourlyCalendar.tsx` |

## Technical Implementation

### useHourlyAvailability Hook

**Pattern:** React hooks with fetch + debounce + AbortController cleanup (matches existing `useRentalAvailability.ts`)

**Key Features:**
- Fetches from `/api/rental/availability/hourly?studio_id=X&date=YYYY-MM-DD`
- Returns `{ slots: HourlySlot[], loading: boolean, error: string | null }`
- 300ms debounce to prevent rapid API calls on date changes
- AbortController cleanup on unmount or parameter change
- Graceful fallback: returns all 15 slots as available on error
- Skips fetch if `studioId` or `date` is null

**TypeScript Interface:**
```typescript
export interface HourlySlot {
  hour: string;        // "08:00", "09:00", ..., "22:00"
  available: boolean;
  reservation?: string; // Client name when occupied
}
```

### StudioHourlyCalendar Component

**Pattern:** Modal-style panel with day navigation, slot grid, and Framer Motion animations

**Key Features:**
- **Day navigation:** Prev/next buttons with bounds checking (today to +90 days)
- **Slot rendering:** 15 vertical rows representing one-hour time blocks
- **Visual states:**
  - Available: `bg-white/[0.03]` with hover accent border (`border-accent/50`)
  - Occupied: `bg-accent/10` with reservation name + lock icon
  - Past hour (today only): `opacity-40`, disabled
- **Loading state:** 15 skeleton placeholders (`bg-white/[0.04] animate-pulse`)
- **Animations:** Framer Motion entrance (`opacity 0→1, y 20→0`) with 0.02s stagger per slot
- **Close behavior:** Outside click detection via `useRef` + `useEffect`
- **Responsive:** Full-width with `max-h-[70vh] overflow-y-auto` for mobile

**Props:**
```typescript
interface StudioHourlyCalendarProps {
  studioId: string;
  studioName: string;
  onSlotSelect: (date: string, hour: string) => void;  // Parent handles WhatsApp integration
  onClose: () => void;
}
```

## Design System Adherence

All styling matches the dark theme design system:
- Background: `bg-black/95` with `backdrop-blur-xl`
- Borders: `border-white/10` (default), `border-accent/50` (hover)
- Text: `text-white/70` (primary), `text-white/50` (secondary)
- Accent color: `var(--color-accent)` (#FF10F0 magenta)
- Typography: Responsive with proper font weights
- Animations: Framer Motion with reduced-motion support

## Deviations from Plan

**None** — Plan executed exactly as written.

No bugs found. No missing functionality. No blocking issues. All tasks completed as specified.

## Success Criteria Met

- ✅ STU-01 partially satisfied: Day view with 15 hourly slots (8h-23h) exists as a component
- ✅ STU-02 partially satisfied: Occupied slots show reservation name with distinct styling
- ✅ STU-03 partially satisfied: Available slots are clickable with hover state
- ✅ STU-04 partially satisfied: Day navigation works with proper bounds
- ✅ Hook correctly fetches from existing hourly API
- ✅ Component is reusable — accepts studioId prop for any studio
- ✅ TypeScript compilation passes with zero errors
- ✅ All verification checks passed

## Next Steps (Wave 2 — Plan 02)

The next plan will integrate these components into `StudioRenting.tsx`:
1. Replace shared `RentalDatePicker` with per-studio hourly calendars
2. Update WhatsApp message to include both date AND hour
3. Update `/aluguel` page to reflect hourly booking capability

## Self-Check: PASSED

**Files created:**
- ✅ FOUND: `src/hooks/useHourlyAvailability.ts`
- ✅ FOUND: `src/components/ui/StudioHourlyCalendar.tsx`

**Commits exist:**
- ✅ FOUND: `aaa4159` (useHourlyAvailability hook)
- ✅ FOUND: `8e5b904` (StudioHourlyCalendar component)

**Exports verified:**
- ✅ Hook exports `useHourlyAvailability` and `HourlySlot`
- ✅ Component exports `StudioHourlyCalendar`
- ✅ Hook uses correct API endpoint `/api/rental/availability/hourly`
- ✅ Component uses `useHourlyAvailability` hook

**TypeScript compilation:**
- ✅ `npx tsc --noEmit` passes with zero errors

All claims verified. Summary is accurate.
