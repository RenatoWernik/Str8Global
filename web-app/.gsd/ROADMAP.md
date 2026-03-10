# ROADMAP.md

> **Current Milestone**: Restricted Admin Dashboard
> **Goal**: Replace Google Sheets with Supabase and build a premium "Jarvis-style" admin dashboard at `/restricted` for Str8Global owners

## Must-Haves
- [ ] Supabase database setup (tables, RLS, migrations)
- [ ] Migrate public availability API from Google Sheets to Supabase
- [ ] Authentication gate (login page + session management)
- [ ] Rental CRUD operations (create, read, update, delete reservations)
- [ ] Dashboard with KPIs and metrics
- [ ] Calendar/timeline view of all bookings
- [ ] Revenue analytics charts
- [ ] Standalone layout (no public Navbar/Footer)
- [ ] Mobile responsive

## Nice-to-Haves
- [ ] Client history / repeat customer tracking
- [ ] Export data to CSV
- [ ] Email/WhatsApp notification integration
- [ ] Seasonal demand heatmap
- [ ] Real-time data refresh (Supabase subscriptions)

## Phases

### Phase 1: Supabase Setup & Data Migration
**Status**: ⬜ Not Started
**Objective**: Set up Supabase project, create database schema (reservations, cowork_reservations, capacity tables), seed with existing data from Google Sheets, and migrate the public availability API to read from Supabase instead of Sheets.

### Phase 2: Foundation & Auth
**Status**: ⬜ Not Started
**Objective**: Set up `/restricted` route with standalone layout (no Navbar/Footer), login page with authentication via env-var credentials, session management with HttpOnly cookies, and protected route middleware.

### Phase 3: Dashboard Layout & Navigation
**Status**: ⬜ Not Started
**Objective**: Build the main dashboard shell — sidebar navigation, top bar with user info, page structure. Dark theme with Jarvis aesthetic. Animated transitions between dashboard sections.

### Phase 4: Reservation Management UI
**Status**: ⬜ Not Started
**Objective**: Build the reservation management section — CRUD forms, reservation list with filters/search, calendar/timeline view. Full Supabase CRUD API routes. Interactive item selector for new bookings.

### Phase 5: Analytics & KPI Dashboard
**Status**: ⬜ Not Started
**Objective**: Build the metrics/analytics section — revenue cards, occupancy rates, most-rented ranking, category breakdown, trend charts, and month-over-month comparisons.

### Phase 6: Polish & Verification
**Status**: ⬜ Not Started
**Objective**: Mobile responsiveness, animations, loading states, error handling, edge cases. Full end-to-end testing. Performance optimization.
