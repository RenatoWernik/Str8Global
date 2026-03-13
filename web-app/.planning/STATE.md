# STATE.md

## Current Position

- **Milestone**: v1.2 — Mobile-Native Calendar Experience
- **Phase**: Phase 5 — Bottom Sheet Foundation (next to plan)
- **Plan**: —
- **Status**: Roadmap complete, ready to plan Phase 5
- **Last activity**: 2026-03-13 — Roadmap v1.2 created (Phases 5-8)

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

- vaul (~8kB) for bottom sheets with snap points and spring physics
- Vibration API (browser native) for haptic feedback with feature detection
- Extend existing components (not separate files) with mobile branch
- MobileBottomSheet.tsx as reusable wrapper component
- Phases 6+7 parallelizable after Phase 5

### Recent Completions

- Research complete: Stack, Features, Architecture, Pitfalls (4 agents)
- Requirements defined: 21 total across 5 categories
- Roadmap created: 4 phases (5-8), 21/21 requirements mapped

### Plans Ready for Execution

(None yet — next step: `/gsd:plan-phase 5`)
