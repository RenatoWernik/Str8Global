# SPEC — Restricted Admin Dashboard

## Overview

Build a hidden `/restricted` route (not visible in navigation or to end users) that serves as a complete rental management dashboard for the Str8Global owners (Igor & Marta). This replaces the current Google Spreadsheet workflow entirely. **Supabase** is the single source of truth — Google Sheets is fully deprecated.

## Core Requirements

### Backend — Supabase
- **Full migration from Google Sheets to Supabase** (PostgreSQL)
- Database tables: `reservations`, `cowork_reservations`, `capacity`
- All CRUD operations happen via Supabase client
- The existing public site's availability API (`/api/rental/availability`) must also read from Supabase
- Real-time instant data sync (Supabase real-time subscriptions or on-demand fetching)

### Authentication
- Simple login form protecting the dashboard
- Credentials stored as environment variables (not a Supabase auth user)
- Session-based auth via cookies with signed JWT
- Auto-redirect unauthenticated users to login

### Dashboard — Rental Management
- **Create/Edit/Delete reservations** for all item types (gear, studios, cowork, cowork+studio)
- **Calendar view** showing all bookings with visual timeline
- **Reservation list** with filters by item type, date range, client
- **Item availability overview** at a glance

### Dashboard — Metrics & KPIs
- Revenue by period (daily/weekly/monthly/yearly)
- Occupancy rates (studios, cowork spots)
- Most rented items ranking
- Revenue by category (gear vs studio vs cowork)
- Active vs upcoming vs past reservations count
- Month-over-month growth comparisons

### Dashboard — Insights
- Revenue trends chart
- Booking frequency patterns
- Client history and repeat-customer tracking

### UX/Visual Requirements
- Dark theme matching Str8Global brand identity
- "Iron Man / Jarvis" aesthetic: futuristic, data-driven, intimate control feel
- Animated data visualizations with GSAP/Framer Motion
- Mobile responsive for on-the-go access
- No Navbar/Footer from main site — standalone layout
- Portuguese (PT-PT) language throughout

## Technical Constraints
- Backend: **Supabase** (PostgreSQL) — replaces Google Sheets entirely
- Auth via Next.js API routes + HttpOnly cookies
- Charts rendered client-side (Recharts or custom SVG)
- Must migrate existing availability API to read from Supabase
- Must not affect existing public-facing pages or SEO (except backend swap)

## Status
**FINALIZED**
