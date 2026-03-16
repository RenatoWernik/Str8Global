---
phase: 11-visual-redesign-image-effects
plan: 04
subsystem: ui
tags: [gsap, animations, clip-path, layout, asymmetric-grid, hover-effects]

# Dependency graph
requires:
  - phase: 11-visual-redesign-image-effects
    plan: 01
    provides: RevealImage component, useSectionInView hook, 1-observer-per-section pattern
  - phase: 10-text-animations-section-extraction
    provides: CharReveal, BalancedHeadline, espacoData.ts structure
provides:
  - Full-bleed horizontal showcase layout for amenities section
  - Asymmetric grid layout (4-3-3 column spans) distinct from bento and staggered
  - Curtain opening reveal effect with directional clip-path animations
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Asymmetric grid layout (grid-cols-10 with 4-3-3 spans)"
    - "Tall portrait aspect ratio (3/4) for premium immersive cards"
    - "Curtain opening effect with directional reveals (left/up/right)"
    - "Hover overlays with gradient, title, accent bar, description"

key-files:
  created: []
  modified:
    - src/components/sections/espaco/ComodidadesSection.tsx

key-decisions:
  - "Asymmetric 4-3-3 grid creates visual interest vs equal 3-column layout"
  - "Tall portrait aspect ratio (3/4) differentiates from landscape formats in Studios/Cowork"
  - "Curtain opening effect (left/up/right directions) creates cohesive reveal experience"
  - "Hover overlays degrade gracefully on mobile (tap/focus accessible)"

patterns-established:
  - "Pattern 1: Full-bleed showcase with asymmetric proportions for premium gallery feel"
  - "Pattern 2: Directional reveals create narrative flow (opening curtains)"
  - "Pattern 3: Tall portrait format creates immersive vertical cards distinct from other sections"

# Metrics
duration: 2 min
completed: 2026-03-16
---

# Phase 11 Plan 04: Amenities Showcase Summary

**Full-bleed horizontal showcase with asymmetric grid, tall portrait images, and curtain opening reveal effect**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-16T11:18:56Z
- **Completed:** 2026-03-16T11:21:28Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments
- Rewrote ComodidadesSection with full-bleed asymmetric horizontal showcase
- Replaced Framer Motion with GSAP-based RevealImage + useSectionInView
- Implemented 4-3-3 asymmetric grid for visual interest (NOT equal columns)
- Used tall portrait aspect ratio (3/4) creating premium immersive feel
- Created curtain opening effect with directional reveals (left/up/right)
- Maintained hover overlays with title, accent bar, and description
- Layout visually distinct from bento grid (Studios) and staggered offset (Cowork)

## Task Commits

1. **Task 1: Rewrite ComodidadesSection with full-bleed showcase** - `0bd81b1` (feat)
   - Removed Framer Motion whileInView, replaced with RevealImage
   - Asymmetric grid-cols-10 with 4-3-3 column spans
   - Tall portrait aspect-[3/4] for immersive vertical cards
   - Curtain opening effect (left/up/right reveal directions)
   - Single useSectionInView call (VFX-06 compliance)
   - Enhanced hover overlays with larger text on desktop

## Files Created/Modified
- `src/components/sections/espaco/ComodidadesSection.tsx` - Rewritten with asymmetric horizontal showcase, tall portrait images, GSAP clip-path reveals, and single section-level IntersectionObserver

## Decisions Made

**Layout Architecture:**
- Asymmetric 10-column grid with 4-3-3 spans creates visual rhythm
- First image slightly wider (col-span-4) draws initial attention
- Images 2-3 equal width (col-span-3) create balance
- This layout is distinct from bento grid (Studios) and zigzag offset (Cowork)

**Aspect Ratio Choice:**
- Tall portrait format (3/4) instead of square creates premium gallery feel
- Differentiates from landscape formats used in Studios and Cowork sections
- Works beautifully on mobile as immersive vertical cards

**Reveal Animation:**
- Curtain opening effect: left → up → right directions
- Creates narrative flow as if curtains are being pulled aside
- Stagger delays (0.15s per image) enhance the effect
- Single IntersectionObserver reduces overhead (VFX-06)

**Hover Interactions:**
- Gradient overlay reveals title + accent bar + description
- Larger text on desktop (text-2xl → text-3xl for titles)
- Transforms degrade gracefully on mobile (tap/focus accessible)
- Scale + opacity transitions create premium polish

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

**Next.js Turbopack race condition:**
- Initial build failed with ENOENT error on _ssgManifest.js
- Resolution: Clean .next directory and rebuild
- Non-blocking: Known intermittent issue with Next.js 16 + Turbopack

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Phase 11 complete! All three sections (Studios, Cowork, Amenities) now use:
- RevealImage with GSAP clip-path animations
- Single IntersectionObserver per section (VFX-06 compliance)
- Distinct layouts creating visual variety:
  - Studios: Bento grid with asymmetric masonry
  - Cowork: Staggered offset with spotlight effects
  - Amenities: Full-bleed horizontal showcase with tall portrait cards
- All images use loading="eager" (VFX-05)
- All animations respect prefers-reduced-motion

**Visual impact achieved:**
- 13 photos showcased with maximum creative variety
- Three distinct layout systems prevent visual fatigue
- GSAP clip-path reveals add premium polish
- Performance optimized (3 observers instead of 13)

Ready for next milestone!

## Self-Check: PASSED

All claimed files and commits verified:
- ✓ src/components/sections/espaco/ComodidadesSection.tsx modified
- ✓ Commit 0bd81b1 exists (Task 1: Full-bleed showcase rewrite)
- ✓ No Framer Motion imports
- ✓ RevealImage and useSectionInView imported
- ✓ Asymmetric grid-cols-10 layout (NOT equal grid)
- ✓ Tall portrait aspect-[3/4] (NOT square)
- ✓ All 3 images rendered with hover overlays

---
*Phase: 11-visual-redesign-image-effects*
*Completed: 2026-03-16*
