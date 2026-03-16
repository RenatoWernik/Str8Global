# Str8Global

## What This Is

Premium marketing and photography agency website for Str8Global, based in Lisbon/Cascais. Includes public-facing portfolio, services, an immersive rental/booking space page, and a hidden admin dashboard for rental management.

## Core Value

Owners (Igor & Marta) can manage all rental operations from one dashboard, and customers can instantly see availability and book via WhatsApp.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

- ✓ Public website with portfolio, services, contact — v1.0
- ✓ Rental page with gear, studio, cowork categories — v1.0
- ✓ WhatsApp CTA integration for bookings — v1.0
- ✓ Basic date-based availability checking — v1.0
- ✓ Restricted admin dashboard with Supabase backend — v1.0
- ✓ CRUD for reservations (gear, studio, cowork) — v1.0
- ✓ Admin calendar month view — v1.0
- ✓ Admin analytics and KPIs — v1.0
- ✓ Supabase Auth for admin login — v1.0
- ✓ Per-item monthly calendars for equipment/cowork — v1.1
- ✓ Hourly studio calendars with Google Calendar style — v1.1
- ✓ Mobile bottom sheet calendars with native UX — v1.2
- ✓ Haptic feedback and spring animations on mobile — v1.2
- ✓ Lenis-ScrollTrigger sync and prefers-reduced-motion compliance — v1.3
- ✓ Character-by-character text reveals and balanced typography — v1.3
- ✓ Section extraction with dynamic imports and code splitting — v1.3
- ✓ Creative non-conventional layouts (bento grid, zigzag, full-bleed) — v1.3
- ✓ GSAP clip-path image reveals on all 13 Espaço images — v1.3
- ✓ Desktop parallax, fullscreen lightbox, magnetic cursor — v1.3
- ✓ Mobile-safe animation degradation (no parallax/magnetic on mobile) — v1.3

### Active

<!-- Next milestone scope goes here -->

(To be defined in next milestone)

### Out of Scope

- Online payment/checkout — Bookings continue via WhatsApp
- Automated email notifications — Not needed for current workflow
- Multi-language — Site is PT-PT only
- Admin hourly calendar view — Deferred from v1.1 Phase 4

## Context

- **Stack:** Next.js 16 + React 19 + TypeScript 5 + Tailwind v4 + GSAP + Framer Motion + Three.js
- **Database:** Supabase PostgreSQL (tables: reservations, cowork_reservations, capacity)
- **Animation stack:** GSAP (scroll storytelling) + Framer Motion (component interactions) + Lenis (smooth scroll)
- **Espaço page:** Hero (Globe 3D, intact) → Manifesto (BlurText) → Estúdios (bento grid) → Cowork (zigzag) → Comodidades (full-bleed) → CTA
- **Components:** 11 new animation/UI components added in v1.3 (CharReveal, BalancedHeadline, RevealImage, ParallaxImage, ImageLightbox, MagneticCursor, 4 section components, useSectionInView)
- **Performance:** 3 IntersectionObservers for 13 images, code-split sections, loading="eager" on revealed images
- **Accessibility:** WCAG 2.1 Level AA — prefers-reduced-motion fully supported (Decreto-Lei n.º 83/2018)
- **Mobile:** Bottom sheets for calendars, simplified animation experience (no parallax, no magnetic cursor)
- **Admin:** Jarvis/dark theme with cyan accents, Phase 4 admin dashboard deferred

## Constraints

- **Stack**: Next.js 16 + React 19 + TypeScript 5 + Tailwind v4
- **Database**: Supabase (existing tables must be migrated, not replaced)
- **Animations**: GSAP for scroll-driven, Framer Motion for interactions (documented separation)
- **No breaking changes**: Public site must continue working during migration
- **Studio hours**: 8h-23h, 1h slots

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Supabase for DB | Already in use, proven reliable | ✓ Good |
| Supabase Auth for login | Replaced .env credentials, more secure | ✓ Good |
| WhatsApp for bookings | No payment integration needed, personal touch | ✓ Good |
| Per-item calendar (equipment) | Users need to see specific item availability | ✓ Good |
| Hourly slots for studios | Studios are priced/booked by hour, not day | ✓ Good |
| Portal rendering for desktop modals | Escapes overflow-hidden + transform parents | ✓ Good |
| Bottom sheet pattern for mobile calendars | Native mobile feel, thumb-zone ergonomics | ✓ Good |
| GSAP vs Framer Motion separation | Clear ownership prevents fighting animations | ✓ Good |
| Section-level IntersectionObserver | 3 observers vs 13, prevents memory leaks | ✓ Good |
| Selective parallax (2 hero images only) | Prevents motion overload, keeps premium feel | ✓ Good |
| Framer Motion layoutId for lightbox | Seamless thumbnail-to-fullscreen morph transition | ✓ Good |
| Dynamic imports with ssr: false | Code splitting for client-only animation libraries | ✓ Good |

## Shipped Milestones

- **v1.0** — Public site + admin dashboard + Supabase backend
- **v1.1** — Per-item calendars, hourly studio calendars, WhatsApp prefill (shipped 2026-03-10)
- **v1.2** — Mobile bottom sheets, spring animations, haptics, cross-browser (shipped 2026-03-15)
- **v1.3** — Espaço page redesign: creative layouts, GSAP reveals, polish effects (shipped 2026-03-16)

---
*Last updated: 2026-03-16 after v1.3 milestone shipped*
