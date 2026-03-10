# STATE.md

## Current Position

- **Milestone**: v1.1 — Novas Versões de Calendários
- **Phase**: 01-schema-api-suporte-horario
- **Plan**: 01-01 complete (1 of ~3 plans)
- **Status**: Ready for next plan
- **Last activity**: 2026-03-10 — Plan 01-01 complete: hourly reservation schema and overlap validation

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-10)

**Core value:** Owners manage rentals from one dashboard; customers see availability instantly.
**Current focus:** Phase 1 — Schema & API Suporte Horário

## Accumulated Context

- Previous milestone (Restricted Admin Dashboard) completed — Supabase backend, auth, CRUD, calendar, analytics all working
- Auth migrated from .env credentials to Supabase Auth (2026-03-10)
- Studios are priced by hour but currently only support day-based reservations — v1.1 fixes this mismatch
- Public site availability API currently returns single-date availability — needs monthly and hourly endpoints

### Decisions

**Phase 01 Plan 01 (2026-03-10):**
- start_time/end_time stored as TEXT in HH:MM format (nullable for backward compatibility)
- Overlap validation only for studio reservations with time fields set
- Gear reservations continue using day-based model without time fields

### Recent Completions

**Phase 01 Plan 01 (2026-03-10):** Schema & API Suporte Horario
- Added start_time/end_time columns to reservations table
- Implemented checkTimeConflict() for overlap validation
- Updated TypeScript types for hourly reservations
- Commit: a102418
