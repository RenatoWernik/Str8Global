# STATE.md

## Current Position

- **Milestone**: v1.1 — Novas Versões de Calendários
- **Phase**: Phases 1, 2, 3 complete. Phase 4 pending.
- **Plan**: 7/7 plans complete for Phases 1-3. Phase 4 not yet planned.
- **Status**: Ready to plan Phase 4 (Admin Dashboard)
- **Last activity**: 2026-03-10 — Phases 2 & 3 executed in parallel (5 plans, 2 waves)

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

**Phase 02 Plan 02 (2026-03-10):**
- Each GearCard owns its own date selection state independently
- Removed shared section-level date picker from GearRenting
- Per-card calendar pattern: "Escolher data" button + local state + calendar dropdown
- Z-index stacking: card with open calendar gets z-20, dropdown gets z-50
- Date clearing via X button on date selection button

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

**Phase 02 Plan 02 (2026-03-10):** GearRenting Per-Item Calendar Integration
- Integrated AvailabilityCalendar into each GearCard (per-item calendars)
- Removed shared RentalDatePicker from section level
- Each equipment card owns its date selection state (selectedDate, calendarOpen)
- Calendar shows item-specific unavailable dates with strikethrough
- WhatsApp CTA includes selected date in pre-filled message
- Updated aluguel page to remove legacy props from GearRenting
- Commit: a97ac4e

**Phase 03 Plan 01 (2026-03-11):** Studio Hourly Calendar Foundation
- Rewrote useHourlyAvailability hook to return `ReservationBlock` types.
- Completely redesigned StudioHourlyCalendar into a Google Calendar-style daily timeline with 15-minute grids.
- Added 15-minute selection intervals and visual proportional blocks for reservations.
- Commits: 

**Phase 03 Plan 02 (2026-03-11):** StudioRenting Per-Studio Hourly Calendar Integration
- Integrated StudioHourlyCalendar into each StudioCard (per-studio hourly calendars)
- Removed shared RentalDatePicker and AvailabilityBadge from section level
- Each card owns its booking state (calendarOpen, selectedDate, selectedHour)
- WhatsApp message generated from `getNextHour` to handle minute granularity.
- Commits: 

### Plans Ready for Execution

**Phase 02 — Calendário Público Equip & Cowork:**
- ✅ 02-01: useMonthlyAvailability hook + AvailabilityCalendar component (Wave 1) — COMPLETE
- ✅ 02-02: Integrate into GearRenting — per-item calendars (Wave 2) — COMPLETE
- ✅ 02-03: Integrate into CoworkStandalone + update aluguel page (Wave 2) — COMPLETE

**Phase 03 — Calendário Público Estúdio:**
- ✅ 03-01: useHourlyAvailability hook + StudioHourlyCalendar component (Wave 1) — COMPLETE
- ✅ 03-02: Integrate into StudioRenting + WhatsApp hour prefill + update aluguel page (Wave 2) — COMPLETE

**Phase 04 — Dashboard Admin:**
- ⏳ 04-01: Formulário e Tabela de Reservas (Admin) (Wave 1)
- ⏳ 04-02: Admin Studio & Gear Calendar Component (Wave 2)
- ⏳ 04-03: Interatividade do Calendário (Wave 3)
- ADM-01: Admin hourly calendar view for studios
- ADM-02: Create studio reservation with start/end time
- ADM-03: Edit/delete studio reservations with hours
- ADM-04: Equipment calendar shows days with active reservations per item

**Next:** `/gsd:plan-phase 4` to plan admin dashboard updates.
