# STATE.md

## Current Position

- **Milestone**: v1.2 — Mobile-Native Calendar Experience
- **Phase**: Phase 5 — Bottom Sheet Foundation
- **Plan**: 1/2 complete
- **Status**: Executing Phase 5 (MobileBottomSheet foundation complete)
- **Last activity**: 2026-03-13 — Completed 05-01-PLAN.md (MobileBottomSheet foundation)

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
- Use vaul over custom implementation (built-in snap points, velocity gestures, SSR compatible)
- Explicit body scroll lock in addition to vaul's automatic handling (defense-in-depth)

### Recent Completions

- Research complete: Stack, Features, Architecture, Pitfalls (4 agents)
- Requirements defined: 21 total across 5 categories
- Roadmap created: 4 phases (5-8), 21/21 requirements mapped
- **Phase 05 Plan 01 complete**: MobileBottomSheet foundation (2 tasks, 107s, 2 commits)

### Plans Ready for Execution

- Phase 05 Plan 02: Demo page with MobileBottomSheet testing UI

## Performance Metrics

| Phase | Plan | Duration | Tasks | Files | Completed |
|-------|------|----------|-------|-------|-----------|
| 05 | 01 | 107s | 2 | 3 | 2026-03-13T23:36:34Z |
