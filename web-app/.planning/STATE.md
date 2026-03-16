# STATE.md

## Current Position

- **Milestone**: v1.3 — Redesign Página Espaço
- **Phase**: Phase 10 — Text Animations & Section Extraction (COMPLETE - 3/3 plans)
- **Plan**: 10-03 complete
- **Status**: Phase 10 complete, ready for Phase 11
- **Progress**: ████████████ 100% (milestone: 3/4 phases complete, project: 11/12 phases shipped)
- **Last activity**: 2026-03-16 — Phase 10 Plan 03 executed (dynamic import integration)

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

- **Hero Section**: Globe 3D + motion title (INTACT, não alterar)
- **Manifesto Section**: ManifestoSection.tsx component (BlurText word-by-word blur-in, dynamically imported)
- **Estúdios Section**: EstudiosSection.tsx component (CharReveal title, BalancedHeadline subtitle, Masonry 5 fotos, dynamically imported)
- **Cowork Section**: CoworkSection.tsx component (CharReveal title, BalancedHeadline subtitle, SpotlightCard 5 fotos, dynamically imported)
- **Comodidades Section**: ComodidadesSection.tsx component (CharReveal title, BalancedHeadline subtitle, hover cards 3 fotos, dynamically imported)
- **CTA Section**: Standard CTA (INTACT, não alterar)
- **Data**: All 13 images + content centralized in espacoData.ts

**Total assets:** 13 fotos (5 studios, 5 cowork, 3 amenities) — usar TODAS e SOMENTE estas.
**Architecture:** Page.tsx uses dynamic imports with ssr: false for all 4 sections (code splitting active).

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
- `CharReveal.tsx` — character-by-character GSAP reveal (v1.3, Phase 10)
- `BalancedHeadline.tsx` — react-wrap-balancer wrapper (v1.3, Phase 10)
- `Masonry.tsx` — basic column distribution
- `SpotlightCard.tsx` — cursor spotlight effect
- `MobileBottomSheet.tsx` — vaul wrapper with snap points (v1.2)

**Espaço section components (v1.3, Phase 10):**
- `ManifestoSection.tsx` — BlurText manifesto with word-level reveal
- `EstudiosSection.tsx` — CharReveal title + Masonry grid (5 studios)
- `CoworkSection.tsx` — CharReveal title + SpotlightCard grid (5 cowork)
- `ComodidadesSection.tsx` — CharReveal title + hover cards (3 amenities)

**Data files:**
- `espacoData.ts` — all 13 photo paths + section content (v1.3, Phase 10)

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
- **TEXT-01 (Phase 10)**: CharReveal uses dynamic import of Splitting.js to prevent SSR issues
- **TEXT-02 (Phase 10)**: GSAP animations use native IntersectionObserver (useInView), not Framer Motion hooks
- **TEXT-03 (Phase 10)**: DOM manipulation libraries require client-side execution only
- **TEXT-04 (Phase 10)**: All text animations must show instantly when prefers-reduced-motion is active
- **ARCH-01 (Phase 10)**: Section components are self-contained with no props, importing data from espacoData.ts
- **ARCH-02 (Phase 10)**: Dynamic imports use ssr: false for client-only animation libraries
- **ARCH-03 (Phase 10)**: Loading fallbacks maintain approximate vertical space (py-24) to prevent layout shift

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
| 10 | 10-01 | 4 min | 3 | 6 | 2026-03-16 |
| 10 | 10-02 | 2 min | 2 | 5 | 2026-03-16 |
| 10 | 10-03 | 2 min | 2 | 1 | 2026-03-16 |
| Phase 10 P10-03 | 2 | 2 tasks | 1 files |

## Current Todos

- [x] Fix LenisProvider with ScrollTrigger sync callback (INFRA-01) — Complete in 09-01
- [x] Add `prefers-reduced-motion` support (INFRA-02, legal blocker) — Complete in 09-01
- [x] Add null checks to all useGSAP callbacks (INFRA-03) — Complete in 09-02
- [x] Document GSAP vs Framer Motion separation pattern (INFRA-04) — Complete in 09-02
- [x] Create text animation components + data extraction (TEXT-01) — Complete in 10-01
- [x] Extract all 4 middle sections with text animations (10-02) — Complete in 10-02
- [x] Dynamic import sections in page.tsx (10-03) — Complete in 10-03
- [ ] Phase 11: Creative Layout Experiments (per v1.3 roadmap)

## Active Blockers

None — Phase 10 complete (3/3 plans), ready to proceed to Phase 11.

## Session Continuity

**Last session:** 2026-03-16T09:17:47Z
**Stopped at:** Completed Phase 10 Plan 03 (Dynamic Import Integration) — PHASE 10 COMPLETE

**Next command:** `/gsd:execute-phase 11` (start Phase 11 per v1.3 roadmap)

**What to tell next Claude:**
"Phase 10 completo (3/3 plans). Espaco page refactored to 109 lines with dynamic imports for all 4 sections (ManifestoSection, EstudiosSection, CoworkSection, ComodidadesSection). Code splitting active with 57 chunks. All inline data removed, sections load lazily with ssr: false. Build passes, all 13 images accounted for. Hero and CTA sections unchanged. Ready for Phase 11 (Creative Layout Experiments). See 10-03-SUMMARY.md for details."

---
*State initialized: 2026-03-10 (v1.1)*
*Updated: 2026-03-13 (v1.2 started)*
*Updated: 2026-03-15 (v1.2 shipped, v1.3 roadmap created)*
*Updated: 2026-03-15 23:04 UTC (Phase 9 Plan 01 executed)*
*Updated: 2026-03-15 23:08 UTC (Phase 9 Plan 02 executed — Phase 9 complete)*
*Updated: 2026-03-16 09:08 UTC (Phase 10 Plan 01 executed)*
*Updated: 2026-03-16 09:13 UTC (Phase 10 Plan 02 executed)*
*Updated: 2026-03-16 09:17 UTC (Phase 10 Plan 03 executed — Phase 10 complete)*
