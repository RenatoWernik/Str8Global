# STATE.md

## Current Position

- **Milestone**: v1.1 — Novas Versões de Calendários
- **Phase**: 02 in progress (Plans 01, 03 complete), 03 in progress (Plan 01 complete)
- **Plan**: Phase 2 Plan 03 complete, Phase 3 Plan 01 complete — 2 more plans to execute
- **Status**: Both phases Wave 1 complete (foundations built), Wave 2 in progress (integrations ongoing)
- **Last activity**: 2026-03-10 — Phase 02 Plan 03 executed (CoworkStandalone per-plan calendars)

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-10)

**Core value:** Owners manage rentals from one dashboard; customers see availability instantly.
**Current focus:** Phases 2 & 3 — Public calendars (monthly per-item + hourly per-studio)

## Accumulated Context

- Previous milestone (Restricted Admin Dashboard) completed — Supabase backend, auth, CRUD, calendar, analytics all working
- Auth migrated from .env credentials to Supabase Auth (2026-03-10)
- Studios are priced by hour but currently only support day-based reservations — v1.1 fixes this mismatch
- Phase 1 complete: schema + APIs for monthly and hourly availability

### Decisions

**Phase 01 Plan 01 (2026-03-10):**
- start_time/end_time stored as TEXT in HH:MM format (nullable for backward compatibility)
- Overlap validation only for studio reservations with time fields set
- Gear reservations continue using day-based model without time fields

**Phase 01 Plan 02 (2026-03-10):**
- Monthly API excludes hourly studio bookings from unavailable dates (shows partial availability)
- Hourly slots span 8h-23h (15 one-hour slots)
- Error fallback returns empty/all-available to prevent site breakage
- Cowork capacity tracking aggregates spots per day

**Phase 02 Planning (2026-03-10):**
- Per-item calendar replaces shared date picker in GearRenting
- Per-plan calendar replaces shared date picker in CoworkStandalone
- AvailabilityCalendar component reused by both
- useMonthlyAvailability hook fetches from existing monthly API
- Legacy useRentalAvailability hook kept for StudioRenting/CoworkStudio until Phase 3

**Phase 02 Plan 01 (2026-03-10):**
- Hook uses Set<string> instead of string[] for O(1) date lookup performance
- Calendar component is the panel only - parent cards provide trigger buttons
- Unavailable dates shown with strikethrough + reduced opacity (text-white/30)
- Graceful fallback on API error returns empty set (all available)

**Phase 02 Plan 03 (2026-03-10):**
- Each CoworkCard owns its own date selection state - no shared section-level picker
- Calendar uses planIds mapping (cowork-starter, cowork-prime, cowork-premium) for API calls
- Per-card calendar pattern: button trigger + local state + positioned dropdown
- Z-index stacking: card with open calendar gets z-20, dropdown gets z-50

**Phase 03 Planning (2026-03-10):**
- Per-studio hourly calendar replaces shared date picker in StudioRenting
- StudioHourlyCalendar component: Google Calendar-style day view with 15 slots
- useHourlyAvailability hook fetches from existing hourly API
- WhatsApp message includes both date AND hour
- [Phase 03-01]: Hook uses useState + useEffect with 300ms debounce for consistency with existing patterns
- [Phase 03-01]: Calendar uses Google Calendar-style vertical day view for mobile-friendly hourly booking
- [Phase 03-01]: Past hours disabled only for today's date to prevent confusion while showing full day context

### Recent Completions

**Phase 01 Plan 01 (2026-03-10):** Schema & API Suporte Horario
- Added start_time/end_time columns to reservations table
- Implemented checkTimeConflict() for overlap validation
- Updated TypeScript types for hourly reservations
- Commit: a102418

**Phase 01 Plan 02 (2026-03-10):** Monthly & Hourly Availability APIs
- Created /api/rental/availability/monthly endpoint for items and cowork plans
- Created /api/rental/availability/hourly endpoint for studio schedules
- Added getMonthlyAvailability() and getHourlyAvailability() database helpers
- Graceful error fallback prevents calendar breakage
- Commits: e370444, f3beac0

**Phase 02 Plan 01 (2026-03-10):** Monthly Calendar Foundation (Gear & Cowork)
- Created useMonthlyAvailability hook for monthly date-based availability
- Created AvailabilityCalendar component with month navigation and visual states
- Reusable components ready for GearRenting and CoworkStandalone integration
- Commits: 5aab3eb, f6fb3b7

**Phase 03 Plan 01 (2026-03-10):** Studio Hourly Calendar Foundation
- Created useHourlyAvailability hook for hourly slot-based availability
- Created StudioHourlyCalendar component with Google Calendar-style day view
- 15 hourly slots (08:00-22:00) with available/occupied visual distinction
- Reusable components ready for StudioRenting integration
- Commits: aaa4159, 8e5b904

**Phase 02 Plan 03 (2026-03-10):** CoworkStandalone Per-Plan Calendar Integration
- Integrated AvailabilityCalendar into each CoworkCard (per-plan calendars)
- Removed shared RentalDatePicker from section level
- Each plan card owns its date selection state (selectedDate, calendarOpen)
- Calendar shows days with 0 spots as strikethrough
- WhatsApp CTA includes selected date in pre-filled message
- Updated aluguel page to remove legacy props from CoworkStandalone
- Commits: a327bfd, fcee4bb

### Plans Ready for Execution

**Phase 02 — Calendário Público Equip & Cowork (remaining plans):**
- ✅ 02-01: useMonthlyAvailability hook + AvailabilityCalendar component (Wave 1) — COMPLETE
- 02-02: Integrate into GearRenting — per-item calendars (Wave 2)
- ✅ 02-03: Integrate into CoworkStandalone + update aluguel page (Wave 2) — COMPLETE

**Phase 03 — Calendário Público Estúdio (remaining plans):**
- ✅ 03-01: useHourlyAvailability hook + StudioHourlyCalendar component (Wave 1) — COMPLETE
- 03-02: Integrate into StudioRenting + WhatsApp hour prefill + update aluguel page (Wave 2)
