# STATE.md

## Current Position

- **Milestone**: v1.3 — Redesign Página Espaço
- **Phase**: Phase 9 — Foundation & Pitfall Prevention
- **Plan**: Not started
- **Status**: Roadmap complete, ready for `/gsd:plan-phase 9`
- **Progress**: █░░░░░░░░░░░ 8% (milestone: 0/4 phases, project: 8/12 phases shipped)
- **Last activity**: 2026-03-15 — v1.3 roadmap created

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-15)

**Core value:** Owners manage rentals from one dashboard; customers see availability instantly.

**Current focus:** Redesign criativo e imersivo da página Espaço com layouts não-convencionais, efeitos interactivos, animações que prendem a atenção (13 fotos, Hero/CTA intactos).

## Accumulated Context

### Shipped Features (v1.0 - v1.2)

- v1.0: Public site + admin dashboard + Supabase backend
- v1.1 Phases 1-3 complete: Schema/API hourly support, per-item monthly calendars, hourly studio calendars
- v1.1 Phase 4 (Admin Dashboard) deferred to future milestone
- v1.2 Phases 5-8 complete (SHIPPED 2026-03-15): Mobile bottom sheets, mobile calendars, haptics, spring animations, cross-browser validation
- Desktop calendars use Portal (createPortal) for modal rendering
- Mobile calendars use vaul bottom sheets with snap points, swipe dismiss, haptic feedback

### Current Page State (Espaço)

- **Hero Section**: Globe 3D + BlurText title (INTACT, não alterar)
- **Manifesto Section**: BlurText component com word-by-word blur-in
- **Estúdios Section**: Masonry.tsx com 5 fotos em colunas
- **Cowork Section**: SpotlightCard.tsx com cursor spotlight em 5 fotos
- **Comodidades Section**: Hover cards com 3 fotos
- **CTA Section**: Standard CTA (INTACT, não alterar)

**Total assets:** 13 fotos (5 studios, 5 cowork, 3 amenities) — usar TODAS e SOMENTE estas.

### Current Animation Stack

- **GSAP 3.14.2** + ScrollTrigger — scroll-driven animations
- **Framer Motion 12.33.0** — component interactions, viewport reveals
- **Lenis 1.3.17** — smooth scroll (desktop-only, disabled on mobile)
- **React 19.2.3** + Next.js 16.1.6 — concurrent rendering, App Router
- **Tailwind v4** — styling
- **vaul** — mobile bottom sheets (added in v1.2)

**Existing components:**
- `BlurText.tsx` — word-level blur-in animation
- `RotatingText.tsx` — text rotation effect
- `Masonry.tsx` — basic column distribution
- `SpotlightCard.tsx` — cursor spotlight effect
- `MobileBottomSheet.tsx` — vaul wrapper with snap points (v1.2)

### Decisions

- Hero Section permanece 100% intacta (Globe 3D + título)
- CTA Section permanece actual
- Usar TODAS e SOMENTE as 13 fotos existentes
- Inspiração: reactbits.dev e lightswind.com para efeitos criativos
- Máxima criatividade, layouts fora do padrão, efeitos imersivos
- GSAP para scroll storytelling, Framer Motion para component interactions (separação clara)
- Accessibility-first: `prefers-reduced-motion` support é legal requirement (Decreto-Lei n.º 83/2018)

### Critical Pitfalls (from research)

**Phase 9 must fix BEFORE adding new animations:**
1. **Lenis-ScrollTrigger desync** — Missing `ScrollTrigger.update()` callback in LenisProvider
2. **React 19 timing bugs** — useGSAP callbacks need explicit null checks on refs
3. **Accessibility violations** — Lenis and Hero parallax NOT respecting `prefers-reduced-motion`

**Later phases must avoid:**
4. **Mobile performance death** — Limit ScrollTrigger instances, test on real devices
5. **GSAP + Framer fighting** — Clear library-per-element separation
6. **Image reveal timing** — Add `loading="eager"` to all scroll-revealed images
7. **Memory leaks** — Section-level IntersectionObservers, not per-image

## Performance Metrics

| Phase | Plan | Duration | Tasks | Files | Completed |
|-------|------|----------|-------|-------|-----------|
| 1 | 01-01 | - | 8 | 4 | 2026-03-10 |
| 1 | 01-02 | - | 6 | 3 | 2026-03-10 |
| 2 | 02-01 | - | 7 | 2 | 2026-03-10 |
| 2 | 02-02 | - | 5 | 1 | 2026-03-10 |
| 2 | 02-03 | - | 5 | 2 | 2026-03-10 |
| 3 | 03-01 | - | 8 | 2 | 2026-03-10 |
| 3 | 03-02 | - | 5 | 1 | 2026-03-10 |
| 5 | 05-01 | - | 9 | 1 | 2026-03-15 |
| 5 | 05-02 | - | 7 | 2 | 2026-03-15 |
| 6 | 06-01 | - | 6 | 1 | 2026-03-15 |
| 6 | 06-02 | - | 5 | 1 | 2026-03-15 |
| 7 | 07-01 | - | 7 | 1 | 2026-03-15 |
| 7 | 07-02 | - | 6 | 1 | 2026-03-15 |
| 8 | 08-01 | - | 7 | 2 | 2026-03-15 |
| 8 | 08-02 | - | 6 | 1 | 2026-03-15 |

## Current Todos

- [ ] Review v1.3 roadmap and approve phase structure
- [ ] Execute `/gsd:plan-phase 9` to begin Foundation & Pitfall Prevention
- [ ] Fix LenisProvider with ScrollTrigger sync callback (INFRA-01)
- [ ] Add `prefers-reduced-motion` support (INFRA-02, legal blocker)
- [ ] Add null checks to all useGSAP callbacks (INFRA-03)
- [ ] Document GSAP vs Framer Motion separation pattern (INFRA-04)

## Active Blockers

None — v1.3 roadmap complete, ready to start Phase 9.

## Session Continuity

**Next command:** `/gsd:plan-phase 9`

**What to tell next Claude:**
"v1.3 roadmap criado. Milestone goal: redesign criativo da página Espaço com layouts não-convencionais e efeitos imersivos. Phase 9 (Foundation) é bloqueador crítico — fix infrastructure bugs antes de adicionar animações. 4 requirements INFRA, todos relacionados a pitfalls documentados em research/PITFALLS.md. Pronto para planear."

---
*State initialized: 2026-03-10 (v1.1)*
*Updated: 2026-03-13 (v1.2 started)*
*Updated: 2026-03-15 (v1.2 shipped, v1.3 roadmap created)*
