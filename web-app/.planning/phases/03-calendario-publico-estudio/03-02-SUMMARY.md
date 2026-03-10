---
phase: 03-calendario-publico-estudio
plan: 02
subsystem: rental/studio-integration
tags: [frontend, integration, hourly-booking, whatsapp-prefill]
dependency_graph:
  requires: [03-01-studio-hourly-foundation]
  provides: [studio-renting-hourly-integration]
  affects: [aluguel-page]
tech_stack:
  added: []
  patterns: [per-component-calendar, inline-panel-rendering, auto-show-contacts]
key_files:
  created: []
  modified:
    - src/components/sections/rental/StudioRenting.tsx
    - src/app/aluguel/page.tsx
decisions:
  - context: "Calendar placement"
    decision: "Render calendar inline within StudioCard (not as modal overlay)"
    alternatives: ["Modal overlay", "Fixed position panel", "Sidebar"]
    rationale: "Inline rendering keeps calendar contextually close to the studio, better mobile UX, simpler z-index management"
  - context: "Selection button display"
    decision: "Show selected date+hour in button text after selection"
    alternatives: ["Show badge above button", "Show inline text below", "Keep generic text"]
    rationale: "Button text provides immediate visual feedback, saves vertical space, matches familiar patterns"
  - context: "WhatsApp contact flow"
    decision: "Auto-show contacts after slot selection"
    alternatives: ["Require manual button click", "Redirect directly to WhatsApp"]
    rationale: "Reduces friction, user can still choose between Igor/Marta, clearer conversion path"
  - context: "Date picker removal"
    decision: "Remove shared RentalDatePicker entirely from StudioRenting section"
    alternatives: ["Keep both shared and per-studio pickers", "Make shared optional"]
    rationale: "Hourly booking requires per-studio context, shared picker adds confusion for hourly model"
metrics:
  duration_minutes: 8
  tasks_completed: 1
  files_modified: 2
  commits: 1
  completed_date: 2026-03-10
---

# Phase 03 Plan 02: Studio Hourly Calendar Integration

**One-liner:** Integrated per-studio hourly calendars into StudioRenting with WhatsApp pre-fill including date AND hour — users now book specific time slots per studio.

## What Was Built

This plan completed the studio hourly booking experience by integrating the foundation components from Plan 01 into the user-facing StudioRenting section.

**Key Changes:**

1. **Removed shared date picker** — The legacy `RentalDatePicker` component was removed from the section-level UI. Each studio now manages its own calendar independently.

2. **Per-studio calendars** — Each StudioCard renders its own `StudioHourlyCalendar` inline when the "Escolher horário" button is clicked. The calendar shows hourly slots (8h-23h) for that specific studio.

3. **Date + Hour selection display** — The button text changes from "Escolher horário" to show the full selection (e.g., "10 de Março de 2026 · 14:00 - 15:00") after the user picks a slot.

4. **WhatsApp hour pre-fill** — WhatsApp messages now include both the date AND the specific hour range selected by the user, formatted in Portuguese.

5. **Streamlined component props** — `StudioRenting` is now fully self-contained with no external props. The `aluguel/page.tsx` simply renders `<StudioRenting />` without availability state management.

## Tasks Completed

| # | Task Name | Commit | Files Modified |
|---|-----------|--------|----------------|
| 1 | Integrate per-studio StudioHourlyCalendar with WhatsApp hour prefill | `9ea9304` | `StudioRenting.tsx`, `aluguel/page.tsx` |

## Technical Implementation

### StudioRenting Component Refactor

**Before:** Component accepted 5 props (`selectedDate`, `onDateChange`, `loading`, `isItemAvailable`, `hasData`) and rendered a shared date picker at section level.

**After:** Component is self-contained with no props. Each StudioCard owns its own calendar state.

**Removed:**
- `RentalDatePicker` import and rendering
- `AvailabilityBadge` import and rendering
- Props interface and prop drilling
- Section-level "Verificar disponibilidade para:" block

**Added:**
- `StudioHourlyCalendar` import
- `Clock` icon from lucide-react
- Per-card local state: `calendarOpen`, `selectedDate`, `selectedHour`
- "Escolher horário" button with dynamic text
- `handleSlotSelect` callback for calendar slot selection
- `getNextHour` helper to compute time range display

### StudioCard State Management

Each StudioCard manages its own booking flow:

```typescript
const [showContacts, setShowContacts] = useState(false);
const [calendarOpen, setCalendarOpen] = useState(false);
const [selectedDate, setSelectedDate] = useState<string | null>(null);
const [selectedHour, setSelectedHour] = useState<string | null>(null);
```

**Flow:**
1. User clicks "Escolher horário" → `calendarOpen = true`
2. User selects a time slot → `handleSlotSelect(date, hour)` fires
3. State updates: `selectedDate`, `selectedHour` set, `calendarOpen = false`, `showContacts = true`
4. Button text updates to show selection
5. WhatsApp contacts appear automatically with pre-filled message

### WhatsApp Message Logic

Three message states based on selection:

**1. Date + Hour selected:**
```
Olá! Gostaria de reservar o Estúdio 1.

📅 Data: 10 de Março de 2026
⏰ Horário: 14:00 - 15:00

Podem confirmar a disponibilidade e forma de pagamento?
```

**2. Only date selected (fallback):**
```
Olá! Gostaria de reservar o Estúdio 1.

📅 Data pretendida: 10 de Março de 2026

Podem confirmar a disponibilidade e forma de pagamento?
```

**3. No selection:**
```
Olá! Gostaria de reservar o Estúdio 1. Podem indicar-me a disponibilidade?
```

### aluguel/page.tsx Cleanup

**Removed:**
- `selectedDate`, `onDateChange`, `loading`, `isItemAvailable`, `hasData` props from `<StudioRenting />`

**Kept:**
- `useRentalAvailability` hook (still used by `CoworkStudio`)
- Props for `CoworkStudio` (legacy availability system)
- Props for `CoworkStandalone` were already removed (Phase 2 Plan 03)

**Note:** `GearRenting` and `CoworkStandalone` are already self-contained (Phase 2). Only `CoworkStudio` still uses the legacy shared availability hook.

## Design System Adherence

All UI changes follow the dark theme design system:

- **"Escolher horário" button:** `bg-white/[0.04]` with `border-white/10`, hover accent border
- **Clock icon:** Accent color (`var(--color-accent)`)
- **Calendar panel:** Inline rendering with AnimatePresence for smooth transitions
- **z-index handling:** Card gets `z-20` when calendar is open (ensures panel appears above adjacent cards)
- **Typography:** Consistent with existing button/text patterns

## Deviations from Plan

**None** — Plan executed exactly as written.

No bugs found. No missing functionality. No blocking issues. All tasks completed as specified.

## Success Criteria Met

- ✅ **STU-01 fully satisfied:** Day view with 15 hourly slots (8h-23h) opens per studio
- ✅ **STU-02 fully satisfied:** Occupied hours show colored block with reservation name
- ✅ **STU-03 fully satisfied:** Available hours are clickable with hover state
- ✅ **STU-04 fully satisfied:** Day navigation works (prev/next/today buttons)
- ✅ **STU-05 fully satisfied:** WhatsApp message includes selected date AND hour
- ✅ No regression in GearRenting or CoworkStandalone (already self-contained)
- ✅ StudioRenting is fully self-contained (no external props)
- ✅ TypeScript compilation passes with zero errors
- ✅ All verification checks passed

## Phase 03 Completion Status

**Phase 03 is COMPLETE.** Both plans executed successfully:

| Plan | Name | Status | Commits |
|------|------|--------|---------|
| 03-01 | Studio Hourly Calendar Foundation | ✅ Complete | `aaa4159`, `8e5b904` |
| 03-02 | Studio Hourly Calendar Integration | ✅ Complete | `9ea9304` |

**What users can now do:**
- View hourly availability for each studio (8h-23h, 15 slots per day)
- See which hours are occupied (with client name) vs. available
- Navigate between days (today → +90 days)
- Select a specific time slot
- Book via WhatsApp with date AND hour pre-filled

**What's left for milestone v1.1:**
- Phase 02 Plans 02 & 03 (GearRenting and CoworkStandalone monthly calendar integrations)
- These are being executed in parallel by other agents

## Next Steps

**Milestone v1.1** will be complete when Phase 02 Plans 02-03 are done. Then all three rental types (gear, studios, cowork) will have their own dedicated calendars:
- Gear → Monthly per-item calendars
- Studios → Hourly per-studio calendars
- Cowork → Monthly per-plan calendars

## Self-Check: PASSED

**Files modified:**
- ✅ FOUND: `src/components/sections/rental/StudioRenting.tsx`
- ✅ FOUND: `src/app/aluguel/page.tsx`

**Commits exist:**
- ✅ FOUND: `9ea9304` (integrate per-studio hourly calendar)

**Implementation verified:**
- ✅ StudioRenting no longer imports `RentalDatePicker` or `AvailabilityBadge`
- ✅ StudioRenting has no props interface
- ✅ Each StudioCard renders `StudioHourlyCalendar` with `studioId={studio.id}`
- ✅ "Escolher horário" button renders with dynamic text
- ✅ WhatsApp message includes both date AND hour when selected
- ✅ aluguel/page.tsx renders `<StudioRenting />` with no props

**TypeScript compilation:**
- ✅ `npx tsc --noEmit` passes with zero errors

All claims verified. Summary is accurate.
