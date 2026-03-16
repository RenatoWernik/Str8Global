# STATE.md

## Current Position

- **Milestone**: v1.3 — Redesign Página Espaço
- **Phase**: Phase 11 — Visual Redesign & Image Effects (COMPLETE - 4/4 plans)
- **Plan**: 11-04 complete
- **Status**: All three sections rewritten with distinct creative layouts and GSAP reveals
- **Progress**: ████████████████████████ 100% (milestone: 4/4 phases complete, project: 12/12 phases shipped)
- **Last activity**: 2026-03-16 — Phase 11 Plan 04 executed (full-bleed showcase Comodidades section)

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
- `RevealImage.tsx` — GSAP clip-path reveal animation (v1.3, Phase 11)
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
- **VFX-05 (Phase 11)**: All scroll-revealed images use loading="eager" to prevent LCP delay
- **VFX-06 (Phase 11)**: One IntersectionObserver per section (not per image) - sections use useSectionInView, pass isInView to child RevealImages

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
| 11 | 11-01 | 1 min | 2 | 3 | 2026-03-16 |
| 11 | 11-02 | 2 min | 1 | 1 | 2026-03-16 |
| 11 | 11-03 | 2 min | 1 | 1 | 2026-03-16 |
| 11 | 11-04 | 2 min | 1 | 1 | 2026-03-16 |

## Current Todos

- [x] Fix LenisProvider with ScrollTrigger sync callback (INFRA-01) — Complete in 09-01
- [x] Add `prefers-reduced-motion` support (INFRA-02, legal blocker) — Complete in 09-01
- [x] Add null checks to all useGSAP callbacks (INFRA-03) — Complete in 09-02
- [x] Document GSAP vs Framer Motion separation pattern (INFRA-04) — Complete in 09-02
- [x] Create text animation components + data extraction (TEXT-01) — Complete in 10-01
- [x] Extract all 4 middle sections with text animations (10-02) — Complete in 10-02
- [x] Dynamic import sections in page.tsx (10-03) — Complete in 10-03
- [x] Create RevealImage + useSectionInView foundation (11-01) — Complete in 11-01
- [x] Rewrite Estudios section with creative layout (11-02) — Complete in 11-02
- [x] Rewrite Cowork section with creative layout (11-03) — Complete in 11-03
- [x] Rewrite Comodidades section with creative layout (11-04) — Complete in 11-04

## Active Blockers

None — Phase 11 complete! All sections rewritten with creative layouts.

## Session Continuity

**Last session:** 2026-03-16T11:21:28Z
**Stopped at:** Completed Phase 11 Plan 04 (Full-bleed Showcase: Comodidades Section)

**Next milestone:** v1.3 COMPLETE! All 4 phases shipped.

**What to tell next Claude:**
"Phase 11 completo (7 min total, 4 plans, 6 files). All three Espaço sections rewritten with distinct creative layouts: Bento grid (Estudios), staggered offset with spotlight (Cowork), full-bleed showcase (Comodidades). All use GSAP clip-path reveals via RevealImage + useSectionInView pattern. Performance: 13 IntersectionObservers reduced to 3 (VFX-06). All animations respect prefers-reduced-motion, images use loading='eager' (VFX-05). Milestone v1.3 complete! See 11-01-SUMMARY.md through 11-04-SUMMARY.md for full details."

---
*State initialized: 2026-03-10 (v1.1)*
*Updated: 2026-03-13 (v1.2 started)*
*Updated: 2026-03-15 (v1.2 shipped, v1.3 roadmap created)*
*Updated: 2026-03-15 23:04 UTC (Phase 9 Plan 01 executed)*
*Updated: 2026-03-15 23:08 UTC (Phase 9 Plan 02 executed — Phase 9 complete)*
*Updated: 2026-03-16 09:08 UTC (Phase 10 Plan 01 executed)*
*Updated: 2026-03-16 09:13 UTC (Phase 10 Plan 02 executed)*
*Updated: 2026-03-16 09:17 UTC (Phase 10 Plan 03 executed — Phase 10 complete)*
*Updated: 2026-03-16 09:42 UTC (Phase 11 Plan 01 executed — foundation components)*
*Updated: 2026-03-16 09:50 UTC (Phase 11 Plan 02 executed — bento grid Estudios)*
*Updated: 2026-03-16 10:58 UTC (Phase 11 Plan 03 executed — staggered offset Cowork)*
*Updated: 2026-03-16 11:21 UTC (Phase 11 Plan 04 executed — full-bleed showcase Comodidades — Phase 11 complete — Milestone v1.3 SHIPPED)*
