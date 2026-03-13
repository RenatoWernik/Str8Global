# STATE.md

## Current Position

- **Milestone**: v1.2 — Mobile-Native Calendar Experience
- **Phase**: Not started (defining requirements)
- **Plan**: —
- **Status**: Defining requirements
- **Last activity**: 2026-03-13 — Milestone v1.2 started

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-13)

**Core value:** Owners manage rentals from one dashboard; customers see availability instantly.
**Current focus:** Mobile-native redesign of both calendars (mensal + horário)

## Accumulated Context

- v1.0: Public site + admin dashboard + Supabase backend
- v1.1 Phases 1-3 complete: Schema/API hourly support, per-item monthly calendars, hourly studio calendars
- v1.1 Phase 4 (Admin Dashboard) deferred to future milestone
- Desktop calendars use Portal (createPortal) for modal rendering — must NOT change
- AvailabilityCalendar: monthly date picker for Gear/Cowork (mobile = absolute dropdown 320px)
- StudioHourlyCalendar: hourly slot picker for Studios (mobile = inline panel in flow)
- Both components already branch on `isDesktop` state via matchMedia('(min-width: 768px)')
- Sections use Framer Motion animated cards with z-index stacking resolved via relative z-10 headers

### Decisions

(None yet for v1.2)

### Recent Completions

(v1.1 completions archived — see git history)

### Plans Ready for Execution

(None yet — defining requirements)
