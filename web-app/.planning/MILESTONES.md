# Milestones

## v1.3 Redesign Página Espaço (Shipped: 2026-03-16)

**Phases:** 9-12 (4 phases, 12 plans)
**Timeline:** 2026-03-15 → 2026-03-16
**Files modified:** 53 | **LOC:** +7,400 / -116
**Requirements:** 23/23 satisfied (INFRA: 4, TEXT: 4, ARCH: 4, VFX: 6, POLISH: 5)

**Key accomplishments:**
- Lenis-ScrollTrigger sync + prefers-reduced-motion legal compliance (WCAG 2.1 Level AA)
- Character-by-character text reveals (Splitting.js + GSAP) + react-wrap-balancer typography
- 3 visually distinct creative layouts: asymmetric bento grid, staggered zigzag, full-bleed showcase
- GSAP clip-path image reveals on all 13 images (IntersectionObservers reduced from 13 to 3)
- Desktop polish: GSAP parallax scrub, Framer Motion fullscreen lightbox, magnetic cursor
- Code-split architecture with dynamic imports for all 4 sections

**Archive:** milestones/v1.3-ROADMAP.md, milestones/v1.3-REQUIREMENTS.md

---

## v1.2 Mobile-Native Calendar Experience (Shipped: 2026-03-15)

**Phases:** 5-8 (4 phases, 8 plans)
**Requirements:** 21/21 satisfied

**Key accomplishments:**
- Mobile bottom sheets with vaul (snap points, swipe-to-dismiss, haptic feedback)
- Monthly calendar with 44x44px touch targets and swipe navigation
- Hourly studio calendar grouped by period (Morning/Afternoon/Night)
- Spring animations, haptic feedback, cross-browser validation (Safari iOS + Chrome Android)

---

## v1.1 Calendarios Publicos (Shipped: 2026-03-10)

**Phases:** 1-3 (3 phases + Phase 4 deferred, 7 plans)

**Key accomplishments:**
- Supabase schema with hourly reservation support and overlap validation
- Per-item monthly availability calendars for equipment and cowork
- Hourly studio calendar (Google Calendar style) with WhatsApp CTA prefill

---
