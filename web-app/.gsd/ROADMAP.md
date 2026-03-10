# ROADMAP.md

> **Current Milestone**: Restricted Admin Dashboard
> **Goal**: Replace Google Sheets manual workflow with a premium "Jarvis-style" admin dashboard at `/restricted` for Str8Global owners

## Must-Haves
- [ ] Authentication gate (login page + session management)
- [ ] Rental CRUD operations (create, read, update, delete reservations)
- [ ] Dashboard with KPIs and metrics
- [ ] Calendar/timeline view of all bookings
- [ ] Revenue analytics charts
- [ ] Standalone layout (no public Navbar/Footer)
- [ ] Mobile responsive
- [ ] Google Sheets read+write integration

## Nice-to-Haves
- [ ] Client history / repeat customer tracking
- [ ] Export data to CSV
- [ ] Email/WhatsApp notification integration
- [ ] Seasonal demand heatmap
- [ ] Real-time data refresh (polling)

## Phases

### Phase 1: Foundation & Auth
**Status**: ⬜ Not Started
**Objective**: Set up `/restricted` route with standalone layout (no Navbar/Footer), login page with authentication via env-var credentials, session management with HttpOnly cookies, and protected route middleware.

### Phase 2: Google Sheets Write API
**Status**: ⬜ Not Started
**Objective**: Upgrade `@/lib/googleSheets.ts` from read-only to full CRUD. Add API routes for creating, updating, and deleting reservations/cowork entries. Update Google Sheets service account scopes to read+write.

### Phase 3: Dashboard Layout & Navigation
**Status**: ⬜ Not Started
**Objective**: Build the main dashboard shell — sidebar navigation, top bar with user info, page structure. Dark theme with Jarvis aesthetic. Animated transitions between dashboard sections.

### Phase 4: Reservation Management UI
**Status**: ⬜ Not Started
**Objective**: Build the reservation management section — CRUD forms, reservation list with filters/search, calendar/timeline view. Interactive item selector for new bookings.

### Phase 5: Analytics & KPI Dashboard
**Status**: ⬜ Not Started
**Objective**: Build the metrics/analytics section — revenue cards, occupancy rates, most-rented ranking, category breakdown, trend charts, and month-over-month comparisons.

### Phase 6: Polish & Verification
**Status**: ⬜ Not Started
**Objective**: Mobile responsiveness, animations, loading states, error handling, edge cases. Full end-to-end testing. Performance optimization.
