# SPEC — Restricted Admin Dashboard

## Overview

Build a hidden `/restricted` route (not visible in navigation or to end users) that serves as a complete rental management dashboard for the Str8Global owners (Igor & Marta). This replaces the current Google Spreadsheet workflow with a premium, "Jarvis-style" command center interface.

## Core Requirements

### Authentication
- Simple login form protecting the dashboard
- Credentials stored as environment variables (not a user DB)
- Session-based auth via cookies or JWT token
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
- Seasonal demand patterns

### UX/Visual Requirements
- Dark theme matching Str8Global brand identity
- "Iron Man / Jarvis" aesthetic: futuristic, data-driven, intimate control feel
- Animated data visualizations with GSAP/Framer Motion
- Mobile responsive for on-the-go access
- No Navbar/Footer from main site — standalone layout
- Portuguese (PT-PT) language throughout

## Technical Constraints
- Backend: Google Sheets API (existing integration) — upgrade to read+write
- No external database — Sheets remain the single source of truth
- Auth via Next.js API routes + HttpOnly cookies
- Charts rendered client-side with a lightweight library (Recharts or similar)
- Must not affect existing public-facing pages or SEO

## Status
**FINALIZED**
