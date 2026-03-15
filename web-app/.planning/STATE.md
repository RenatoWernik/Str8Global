# STATE.md

## Current Position

- **Milestone**: v1.3 — Redesign Página Espaço
- **Phase**: Phase 9 — Foundation & Pitfall Prevention (Plan 2/2 complete)
- **Plan**: 09-02 complete
- **Status**: Phase 9 complete, ready for Phase 10
- **Progress**: ███░░░░░░░░░ 25% (milestone: 1/4 phases, project: 9/12 phases shipped)
- **Last activity**: 2026-03-15 — Phase 9 Plan 02 executed (React 19 safety + library separation)

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
- **SYNC-01 (Phase 9)**: Use useLenis callback for ScrollTrigger synchronization to prevent navigation desync
- **ACCESS-01 (Phase 9)**: Disable Lenis completely when prefers-reduced-motion active for legal compliance
- **PARALLAX-01 (Phase 9)**: Zero-movement parallax values (['0%', '0%']) when reduced motion enabled
- **REACT19-01 (Phase 9)**: All useGSAP must use config object format with `scope: containerRef` parameter for React 19 concurrent safety
- **LIBRARY-01 (Phase 9)**: Library ownership comments required in all animation components (documents WHY library chosen)
- **GUIDE-01 (Phase 9)**: ANIMATION_LIBRARY_GUIDE.md is single source of truth for GSAP vs Framer Motion vs RAF decisions

### Critical Pitfalls (from research)

**Phase 9 fixes (COMPLETED):**
1. ✅ **Lenis-ScrollTrigger desync** — FIXED: Added `ScrollTrigger.update()` callback in LenisProvider (09-01)
2. ✅ **React 19 timing bugs** — FIXED: All useGSAP callbacks use explicit null checks + scope parameter (09-02)
3. ✅ **Accessibility violations** — FIXED: Lenis and Hero parallax now respect `prefers-reduced-motion` (09-01)
4. ✅ **GSAP + Framer fighting** — FIXED: Library separation documented in ANIMATION_LIBRARY_GUIDE.md (09-02)

**Later phases must avoid:**
5. **Mobile performance death** — Limit ScrollTrigger instances, test on real devices (see guide for budgets)
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
| 9 | 09-01 | 2 min | 2 | 2 | 2026-03-15 |
| 9 | 09-02 | 3 min | 4 | 5 | 2026-03-15 |

## Current Todos

- [x] Fix LenisProvider with ScrollTrigger sync callback (INFRA-01) — Complete in 09-01
- [x] Add `prefers-reduced-motion` support (INFRA-02, legal blocker) — Complete in 09-01
- [x] Add null checks to all useGSAP callbacks (INFRA-03) — Complete in 09-02
- [x] Document GSAP vs Framer Motion separation pattern (INFRA-04) — Complete in 09-02
- [ ] Execute Phase 10 (next phase in v1.3 milestone)

## Active Blockers

None — Phase 9 complete, ready to proceed to Phase 10.

## Session Continuity

**Last session:** 2026-03-15 23:08 UTC
**Stopped at:** Completed Phase 09 Plan 02 (React 19 Safety + Library Separation)

**Next command:** `/gsd:plan-phase 10` or `/gsd:execute-phase 10` (if plan exists)

**What to tell next Claude:**
"Phase 9 (Foundation & Pitfall Prevention) completo. Fixed all 4 critical infrastructure issues: (1) Lenis-ScrollTrigger sync, (2) accessibility compliance, (3) React 19 concurrent safety, (4) GSAP/Framer Motion separation. All useGSAP now use scope parameter + null checks. ANIMATION_LIBRARY_GUIDE.md created (295 lines) documenting library selection patterns. Ready to proceed to Phase 10. See 09-01-SUMMARY.md and 09-02-SUMMARY.md for details."

---
*State initialized: 2026-03-10 (v1.1)*
*Updated: 2026-03-13 (v1.2 started)*
*Updated: 2026-03-15 (v1.2 shipped, v1.3 roadmap created)*
*Updated: 2026-03-15 23:04 UTC (Phase 9 Plan 01 executed)*
*Updated: 2026-03-15 23:08 UTC (Phase 9 Plan 02 executed — Phase 9 complete)*
