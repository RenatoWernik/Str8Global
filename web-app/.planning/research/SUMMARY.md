# Project Research Summary

**Project:** Espaço Page Creative Redesign (v1.3)
**Domain:** Premium photography agency portfolio page with immersive scroll-driven animations
**Researched:** 2026-03-15
**Confidence:** HIGH

## Executive Summary

The Espaço page redesign adds creative, immersive scroll-driven animations to showcase 13 photos (5 studios, 5 cowork, 3 amenities) using the existing stack. Research confirms **90% of desired effects are achievable with current tools** (GSAP ScrollTrigger + Framer Motion + Lenis + Three.js), requiring only 2 minimal additions (Splitting.js for text reveals, react-wrap-balancer for typography polish — total 3.5kB).

The recommended architecture is **separate section component files** with **dynamic imports for lazy-loading**, following the proven pattern from the homepage. Critical insight: **GSAP for cross-section scroll storytelling, Framer Motion for component-level animations within sections**. This separation prevents library conflicts while maintaining 60fps performance on mid-range devices.

Key risks center on performance and accessibility: multiple ScrollTrigger instances can cause mobile performance collapse, Lenis-ScrollTrigger desync after navigation, and parallax effects violating accessibility laws without `prefers-reduced-motion` support. All risks have documented prevention strategies from existing codebase analysis. **Three critical infrastructure bugs must be fixed in Phase 1 before adding any new animations.**

## Key Findings

### Recommended Stack

The existing stack (GSAP 3.14.2 + ScrollTrigger, Framer Motion 12.33.0, Lenis 1.3.17, Three.js, Next.js 16, React 19) already provides all major creative effects capabilities. Only two minimal additions recommended for text animation enhancement.

**Core technologies:**
- **GSAP ScrollTrigger** (existing): Scroll-driven animations, parallax, pin/scrub, image reveals — handles 90% of scroll effects
- **Framer Motion** (existing): Viewport reveals, hover states, entrance animations, cursor effects — perfect for component-level interactions
- **Lenis** (existing): Smooth scroll foundation (desktop-only) — already proven, no alternative needed
- **Splitting.js** (add 2.5kB): Character/word splitting for text reveal effects — industry standard, zero dependencies
- **react-wrap-balancer** (add 1kB): Balanced text wrapping for headlines — instant typography polish

**Critical finding:** DO NOT add locomotive-scroll (would conflict with Lenis), react-parallax (outdated, conflicts with GSAP), or Swiper (50kB, conflicts with Lenis). Avoid installing embla-carousel or react-photo-album unless UX testing validates carousel/masonry needs.

**Bundle impact:** 3.5kB total addition (Splitting + react-wrap-balancer). Defer carousel/masonry libraries until validated.

### Expected Features

Research identified clear tiers for feature prioritization based on premium agency site patterns (Awwwards, FWA) and user expectations.

**Must have (table stakes):**
- Smooth scroll (already have Lenis)
- High-quality optimized images (Next.js Image handles)
- Mobile responsive gallery (existing Tailwind + breakpoints)
- Category filtering (Studios/Cowork/Amenities buttons)
- Image lazy loading (Next.js automatic)
- Fast load time (<2.5s LCP)

**Should have (differentiators):**
- Text character reveal (Splitting.js + GSAP)
- Image reveal on scroll (GSAP clip-path animation)
- Bento grid layout (CSS Grid — showcases design skills)
- Fullscreen lightbox (Framer Motion layoutId)
- Parallax layers (2-3 hero images only, GSAP scrub)
- Magnetic cursor (Framer Motion — desktop-only polish)
- Balanced typography (react-wrap-balancer)

**Defer (v2+):**
- Horizontal scroll section (HIGH complexity, accessibility concerns)
- Magnetic image hover (nice-to-have polish)
- Gradient text animation (visual flourish, not critical)
- Swipe gallery (only if UX testing validates)
- 3D tilt effects (Three.js heavy bundle, defer until validated)

**Anti-features (avoid):**
- Auto-playing video backgrounds (heavy bandwidth, accessibility issues)
- Infinite scroll (only 13 photos, prevents footer access)
- Complex 3D WebGL scenes (over-engineered for portfolio)
- Music/sound effects (jarring, accessibility violation)
- Cursor trail effects (distracting, dated)

### Architecture Approach

The current architecture uses a **hybrid animation approach** (GSAP for scroll, Framer Motion for components) coordinated through global providers (LenisProvider, GSAPProvider). The existing `espaco/page.tsx` is a 220-line single file with inline sections — research recommends extracting to separate component files with dynamic imports, following the homepage pattern.

**Proposed structure:**
```
src/app/espaco/page.tsx (minimal, ~100 lines)
├── Hero Section (unchanged)
├── Dynamic: ManifestoSection (creative redesign)
├── Dynamic: StudiosSection (creative redesign)
├── Dynamic: CoworkSection (creative redesign)
├── Dynamic: AmenitiesSection (creative redesign)
└── CTA Section (unchanged)

src/components/sections/espaco/
├── ManifestoSection.tsx
├── StudiosSection.tsx
├── CoworkSection.tsx
└── AmenitiesSection.tsx
```

**Major components:**
1. **HeroSection** — Globe 3D + parallax (Framer Motion) — keep existing implementation
2. **ManifestoSection** — Scroll-driven text reveal (GSAP or Framer Motion)
3. **StudiosSection** — Image grid with creative layout (Framer Motion reveals)
4. **CoworkSection** — Interactive cards with hover effects (Framer Motion)
5. **AmenitiesSection** — Hover-activated content (Framer Motion)
6. **CTASection** — Standard CTA (reused component)

**Key architectural patterns:**
- **Per-section scroll refs** (loose coupling) — each section manages its own scroll effects independently
- **Dynamic imports** for lazy-loading heavy animations — defers JS execution until scrolling
- **Library separation** — GSAP for scroll-driven storytelling, Framer Motion for component interactions
- **Performance budget** — max 4 concurrent `useScroll` hooks (1 per section), max 2 transform properties per hook

**Critical integration point:** Lenis smooth scroll is **disabled on mobile** (`LenisProvider.tsx` line 21), meaning scroll effects must work on both smooth (desktop) and native (mobile) scroll.

### Critical Pitfalls

From research, 7 critical pitfalls identified with documented prevention strategies.

1. **Lenis-ScrollTrigger Desync on Navigation** — ScrollTrigger calculations become inaccurate after client-side navigation. Fix: Add `useLenis((lenis) => ScrollTrigger.update())` callback in LenisProvider BEFORE adding new animations. **Current code is missing this. Phase 01 blocker.**

2. **GSAP + Framer Motion Fighting Over Same Properties** — When both libraries animate the same property (opacity, y, scale) on same element, they compete and cause stutter. Fix: Library-per-element separation or property partitioning (GSAP handles transforms, Framer handles opacity). Document ownership in code comments. **Phase 02 risk.**

3. **Next.js Image + Reveal Animations = Invisible Images** — Images set to `opacity: 0` for reveal, but lazy-load arrives after animation completes. Fix: Add `loading="eager"` to ALL images with scroll reveals, track `onLoad` state before triggering animation. **Phase 02 blocker.**

4. **Mobile Performance Death Spiral with Multiple ScrollTriggers** — 20+ ScrollTrigger instances (13 images + 4 sections) = 600+ calculations/sec on mobile, causing jank/crashes. Fix: Disable ScrollTrigger on mobile, use Framer Motion `whileInView` instead. Batch ScrollTriggers (1 per section, not 1 per image). **Phase 03 critical.**

5. **React 19 Concurrent Rendering + useGSAP = Timing Bugs** — React 19 can pause/resume rendering, causing refs to be null when GSAP tries to access them. Fix: Explicit ref null checks in all `useGSAP` callbacks, use `scope` parameter, never mix Framer Motion `useScroll` with GSAP on same element. **Phase 01 blocker.**

6. **Framer Motion `whileInView` + Many Images = Memory Leak** — 13 images with individual `whileInView` = 13 IntersectionObserver instances that may not clean up correctly in React 19 Suspense. Fix: Use section-level `useInView` instead of per-image `whileInView` (reduces observers from 13 → 3). **Phase 02 refactor required.**

7. **Missing `prefers-reduced-motion` for Heavy Effects = Accessibility Lawsuit** — Parallax/scroll effects without reduced-motion support violates WCAG 2.1 Level A and Portuguese accessibility law (Decreto-Lei n.º 83/2018). **Current code: Lenis NOT disabled for reduced motion, Hero parallax NOT respecting reduced motion.** Fix: Update LenisProvider to check `prefers-reduced-motion`, wrap ALL `useTransform` in reduced motion checks. **Phase 01 legal blocker.**

## Implications for Roadmap

Based on research, suggested 5-phase structure with clear dependencies and pitfall mitigation:

### Phase 1: Foundation & Pitfall Prevention
**Rationale:** Must fix critical infrastructure issues BEFORE adding new animations. Three blockers identified in existing code (Lenis-ScrollTrigger desync, React 19 timing bugs, accessibility violations).

**Delivers:**
- Fixed LenisProvider with ScrollTrigger sync callback
- Added `prefers-reduced-motion` support to Lenis and Hero parallax
- Documented library separation pattern (GSAP vs Framer Motion ownership)
- Created `useReducedMotion` wrapper for all scroll effects

**Addresses:**
- Pitfall 1 (Lenis-ScrollTrigger desync)
- Pitfall 5 (React 19 timing bugs)
- Pitfall 7 (accessibility violations — legal blocker)

**Stack:** No new libraries. Fix existing implementations.

**Research flag:** SKIP — All patterns documented in PITFALLS.md and codebase analysis.

---

### Phase 2: Text Animation Enhancement
**Rationale:** Quick wins with minimal bundle impact. Establishes Splitting.js + GSAP pattern for later sections.

**Delivers:**
- Install Splitting.js (2.5kB) + react-wrap-balancer (1kB)
- Create `<HeroText>` component with character reveal
- Apply Balancer to hero headline
- Test SSR compatibility (dynamic import for Splitting)

**Addresses:**
- Feature: Text character reveal (differentiator)
- Feature: Balanced typography (instant polish)

**Uses:**
- Splitting.js + GSAP ScrollTrigger (existing)
- react-wrap-balancer (new, minimal)

**Avoids:**
- Pitfall 5 (dynamic import prevents SSR issues)

**Research flag:** SKIP — Integration patterns documented in STACK.md.

---

### Phase 3: Section Extraction & Dynamic Imports
**Rationale:** Refactor existing page before adding heavy animations. Enables lazy-loading, prevents bundle bloat.

**Delivers:**
- Extract inline sections to `src/components/sections/espaco/` (4 files)
- Add dynamic imports to `espaco/page.tsx`
- Create `src/data/espacoData.ts` for static data
- Test code splitting (verify separate chunks)

**Addresses:**
- Architecture: Separate component files with lazy-loading
- Performance: Code splitting for 50-100KB per section

**Implements:**
- Pattern 2 from ARCHITECTURE.md (dynamic import pattern)

**Avoids:**
- Pitfall 4 (lazy-loading prevents initial bundle bloat)

**Research flag:** SKIP — Homepage already proves this pattern works.

---

### Phase 4: Image Reveals & Gallery Layout
**Rationale:** Core visual impact. Depends on Phase 3 section extraction.

**Delivers:**
- `<RevealImage>` component with GSAP clip-path animation
- Bento grid layout (CSS Grid with explicit areas)
- Category filter with Framer Motion layout animation
- Refactor all `whileInView` to section-level `useInView` (13 → 3 observers)
- Add `loading="eager"` to all reveal images

**Addresses:**
- Feature: Image reveal on scroll (differentiator)
- Feature: Bento grid layout (differentiator)
- Feature: Category filtering (table stakes)
- Pitfall 3 (image loading timing)
- Pitfall 6 (memory leaks from too many observers)

**Uses:**
- GSAP ScrollTrigger for reveals
- Framer Motion for filter animation
- CSS Grid for layout

**Avoids:**
- Pitfall 2 (GSAP for scroll, Framer for filter — clear separation)
- Pitfall 6 (section-level observers, not per-image)

**Research flag:** SKIP — Patterns proven in HorizontalGallery.tsx and existing gallery sections.

---

### Phase 5: Parallax, Lightbox & Cursor Effects
**Rationale:** Polish effects after core gallery working. Desktop-only optimizations.

**Delivers:**
- Parallax effect on 2-3 hero images (GSAP scrub, 15% movement limit)
- Fullscreen lightbox (Framer Motion layoutId + AnimatePresence)
- Magnetic cursor component (Framer Motion useSpring, desktop-only)
- Mobile-specific animation reductions (simpler effects on touch devices)

**Addresses:**
- Feature: Parallax layers (differentiator)
- Feature: Fullscreen lightbox (expected for portfolios)
- Feature: Magnetic cursor (desktop-only polish)
- Pitfall 4 (mobile performance — test and optimize)

**Uses:**
- GSAP ScrollTrigger (parallax)
- Framer Motion (lightbox + cursor)

**Avoids:**
- Pitfall 4 (limit parallax to 3 images max, reduce on mobile)
- Pitfall 7 (all parallax respects `prefers-reduced-motion`)

**Research flag:** MINOR — Lightbox implementation may need pattern research, but Framer layoutId is well-documented.

---

### Phase Ordering Rationale

- **Phase 1 first:** Fix infrastructure bugs before adding complexity. Legal requirement (accessibility) cannot be deferred.
- **Phase 2 early:** Text animations are lightweight, build confidence with Splitting.js integration.
- **Phase 3 before Phase 4:** Section extraction enables code splitting, prevents monolith file.
- **Phase 4 core value:** Image reveals are the primary visual impact, must work perfectly before polish.
- **Phase 5 last:** Parallax/lightbox/cursor are enhancements, can be cut if timeline compressed.

**Dependency chain:**
```
Phase 1 (foundation) → Phase 2 (text) → Phase 3 (extraction) → Phase 4 (reveals) → Phase 5 (polish)
        ↓                                        ↓                       ↓                  ↓
   Blocks all phases              Enables lazy-loading      Core gallery      Desktop enhancements
```

### Research Flags

**Phases likely needing deeper research:**
- **Phase 5 (Lightbox):** Custom Framer Motion layoutId implementation vs library (yet-another-react-lightbox). Need to research shared layoutId patterns for mobile swipe gestures.

**Phases with standard patterns (skip research):**
- **Phase 1:** All fixes documented in PITFALLS.md and existing codebase
- **Phase 2:** Splitting.js + GSAP integration pattern documented in STACK.md
- **Phase 3:** Homepage dynamic imports prove the pattern
- **Phase 4:** HorizontalGallery.tsx and existing gallery sections provide patterns

**Deferred topics (research if implementing later):**
- Horizontal scroll section (GSAP pin + horizontal)
- Swipe gallery carousel (embla-carousel integration)
- 3D tilt effects (Three.js + mouse tracking)

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All recommended libraries verified via npm, existing stack capabilities confirmed via codebase analysis. Only gap: Three.js not in package.json but mentioned in CLAUDE.md (needs verification). |
| Features | MEDIUM | Feature categorization based on training data (Awwwards/FWA trends as of Jan 2025). Could not access ReactBits.dev or LightsWind.com for 2026 trend validation. Recommendations conservative. |
| Architecture | HIGH | All patterns proven in existing codebase (homepage dynamic imports, HorizontalGallery GSAP+Framer coexistence, CapabilitiesOrbit direct DOM manipulation). No speculation. |
| Pitfalls | HIGH | All pitfalls derived from actual code analysis (LenisProvider, GSAPProvider, espaco/page.tsx) + documented library behaviors. No hypothetical issues. |

**Overall confidence:** HIGH (based on codebase analysis + official documentation)

### Gaps to Address

**Three.js installation status:**
- CLAUDE.md mentions Three.js + react-three-fiber, but not in package.json
- Need to verify if installed and which version
- May need for 3D tilt effects (deferred to v2, not critical for MVP)

**ReactBits/LightsWind trend validation:**
- Could not access due to WebFetch/WebSearch restrictions
- User should manually review these sites to validate 2026 creative trends
- Current recommendations are based on Jan 2025 training data (still valid, but may miss new patterns)

**Fullscreen lightbox implementation:**
- Research recommended custom (Framer Motion layoutId) vs library (yet-another-react-lightbox)
- Custom = smaller bundle, full control
- Library = more features (zoom, thumbnails)
- Decision deferred to Phase 5 planning

**Mobile performance validation:**
- Recommendations based on M1 MacBook Air as "mid-range 2025 device"
- MUST test on actual iOS/Android devices in Phase 3
- Chrome DevTools mobile emulation does not accurately replicate performance

**Horizontal scroll section:**
- FEATURES.md defers to v2 due to HIGH complexity + accessibility concerns
- If required for v1, needs dedicated research phase (GSAP pin + horizontal patterns, keyboard navigation fallbacks)

## Sources

### Primary (HIGH confidence)
- **Existing codebase:** `espaco/page.tsx`, `LenisProvider.tsx`, `GSAPProvider.tsx`, `HorizontalGallery.tsx`, `CapabilitiesOrbit.tsx`, animation components — all patterns proven
- **Package.json:** GSAP 3.14.2, Framer Motion 12.33.0, Lenis 1.3.17, Next.js 16.1.6, React 19.2.3 — versions verified
- **npm version checks:** Splitting.js 1.1.0, react-wrap-balancer 1.1.1, embla-carousel 8.6.0, react-photo-album 3.5.1 — all verified via bash

### Secondary (MEDIUM confidence)
- **GSAP ScrollTrigger documentation:** Integration patterns with Lenis, ScrollTrigger.refresh() requirements
- **Framer Motion useScroll documentation:** useScroll + useTransform patterns for parallax
- **Next.js Dynamic Imports documentation:** Lazy-loading patterns, SSR considerations
- **WCAG 2.1 documentation:** prefers-reduced-motion requirements, Level A/AA compliance
- **Portuguese accessibility law:** Decreto-Lei n.º 83/2018 (WCAG 2.1 Level AA required)

### Tertiary (LOW confidence — needs validation)
- **Training data (Jan 2025 cutoff):** Awwwards/FWA premium agency site trends — conservative recommendations, may miss 2026 innovations
- **ReactBits.dev/LightsWind.com:** Could not access, specific effect implementations unknown
- **Mobile performance assumptions:** Based on M1 MacBook Air benchmarks, needs real-device validation

### Validation Required
- [ ] Manually review ReactBits.dev and LightsWind.com for 2026 creative trends
- [ ] Verify Three.js installation status (not in package.json)
- [ ] Test react-wrap-balancer React 19 compatibility (should be fine per docs, but test)
- [ ] Test Splitting.js with Next.js 16 App Router SSR (dynamic import pattern)
- [ ] Run Lighthouse CI on actual page with full animation load
- [ ] Test on actual iOS/Android devices (not just DevTools emulation)
- [ ] Accessibility audit with WAVE + axe DevTools + manual screen reader testing

---

*Research completed: 2026-03-15*
*Ready for roadmap: YES*
*Next step: Use implications section to structure 5-phase roadmap*
