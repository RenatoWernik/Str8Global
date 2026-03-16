---
phase: 11-visual-redesign-image-effects
plan: 03
subsystem: ui
tags: [gsap, animations, clip-path, layout-design, cowork-section]

# Dependency graph
requires:
  - phase: 11-visual-redesign-image-effects
    plan: 01
    provides: RevealImage, useSectionInView foundation
  - phase: 10-text-animations-section-extraction
    provides: CharReveal, BalancedHeadline, espacoData.ts structure
provides:
  - Cowork section with staggered zigzag layout (visually distinct from Studios bento grid)
  - 5 cowork images with GSAP clip-path reveals and title overlays
affects: [11-04]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Staggered alternating offset layout (zigzag pattern)"
    - "Varying image widths (75%, 60%, 80%, 50%, 100%) for visual rhythm"
    - "Varied aspect ratios per image (16/10, 4/3, 16/9, 3/2, 21/9)"
    - "Single section-level IntersectionObserver for 5 images"

key-files:
  created: []
  modified:
    - src/components/sections/espaco/CoworkSection.tsx

key-decisions:
  - "Zigzag layout: images alternate between left-aligned (self-start) and right-aligned (self-end)"
  - "Each image has different width percentage to create varied visual rhythm"
  - "Aspect ratios vary by image to match their width and create flow"
  - "Final image (Cowork-Premium) is full-width cinematic (21/9) as visual anchor"
  - "Reveal directions alternate (right, left, right, left, up) matching layout flow"

patterns-established:
  - "Pattern 1: Staggered offset layout creates zigzag visual rhythm distinct from bento grid"
  - "Pattern 2: Title overlays use gradient backdrop (from-black/70 to-transparent)"
  - "Pattern 3: Mobile degrades to single column (w-full) with consistent aspect-video"

# Metrics
duration: 2 min
completed: 2026-03-16
---

# Phase 11 Plan 03: Cowork Section Zigzag Layout Summary

**Staggered alternating offset layout for cowork section with GSAP clip-path reveals - visually distinct from Studios bento grid**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-16T09:45:36Z
- **Completed:** 2026-03-16T09:48:02Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments

- Rewritten CoworkSection with staggered zigzag layout (NOT bento grid)
- Images alternate between left-aligned wider (75%, 80%) and right-aligned narrower (60%, 50%)
- Final image is full-width cinematic (100% width, 21/9 aspect)
- All 5 images use RevealImage with GSAP clip-path animation
- Single useSectionInView observer for all 5 images (VFX-06 compliant)
- Title overlays on each image with gradient backdrop
- Removed Framer Motion and SpotlightCard dependencies

## Task Commits

Each task was committed atomically:

1. **Task 1: Rewrite CoworkSection with staggered offset layout and RevealImage** - `9f04dfb` (refactor)
   - Removed Framer Motion imports and motion.div wrappers
   - Removed SpotlightCard component usage
   - Added RevealImage and useSectionInView imports
   - Implemented zigzag layout with alternating self-start/self-end alignment
   - Each image has distinct width (75%, 60%, 80%, 50%, 100%)
   - Varied aspect ratios (16/10, 4/3, 16/9, 3/2, 21/9)
   - Title overlays with gradient backdrop on all images
   - Stagger delays: 0, 0.15, 0.1, 0.2, 0.12
   - Reveal directions: right, left, right, left, up

## Files Created/Modified

- `src/components/sections/espaco/CoworkSection.tsx` - Complete rewrite with staggered offset layout, GSAP clip-path reveals via RevealImage, single section-level observer, title overlays on all images

## Decisions Made

**Layout Pattern (VFX-03 compliance):**
- Zigzag/staggered offset layout chosen to be visually distinct from Studios bento grid
- Images alternate alignment: odd images (1, 3) left-aligned, even images (2, 4) right-aligned
- Final image (5) is full-width to act as visual anchor and section finale
- Creates dynamic visual flow completely different from rectangular bento pattern

**Image Sizing Strategy:**
- Image 1 (CoworkGeral): 75% width, aspect-[16/10] - wide landscape opening
- Image 2 (CoworkGeral2): 60% width, aspect-[4/3] - medium right offset
- Image 3 (Cowork-Starter): 80% width, aspect-[16/9] - widest landscape
- Image 4 (Cowork-Prime): 50% width, aspect-[3/2] - narrowest right offset
- Image 5 (Cowork-Premium): 100% width, aspect-[21/9] - cinematic full bleed

**Animation Strategy:**
- Stagger delays vary (0, 0.15, 0.1, 0.2, 0.12) to create cascading effect
- Reveal directions alternate to match layout flow (right for left-aligned, left for right-aligned)
- Final image reveals from bottom (up) as dramatic finale
- Single useSectionInView call reduces from 5 potential observers to 1

**Visual Enhancements:**
- Title overlays use gradient (from-black/70 to-transparent) for readability
- Each image has rounded corners (rounded-xl) and subtle border (border-white/5)
- Mobile uses w-full and aspect-video for consistent single-column layout

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

**Build lock file issue:**
- Encountered .next directory lock and corruption during verification
- TypeScript check passed (primary verification)
- Build verification blocked by running dev server locking cache files
- No code issues - purely operational environment conflict

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Cowork section complete with creative zigzag layout:
- **11-04**: Comodidades section rewrite is next and final section in Phase 11
- Pattern successfully demonstrates visual distinction from bento grid
- All VFX requirements met: single observer (VFX-06), loading="eager" (VFX-05)
- Layout provides clear alternative to rectangular grids for future sections

## Self-Check: PASSED

All claimed files and commits verified:
- ✓ src/components/sections/espaco/CoworkSection.tsx modified (91 insertions, 29 deletions)
- ✓ Commit 9f04dfb exists (Task 1: Cowork zigzag layout)
- ✓ No Framer Motion imports (grep returned nothing)
- ✓ No SpotlightCard imports (grep returned nothing)
- ✓ RevealImage and useSectionInView imported and used
- ✓ All 5 coworkImages rendered with titles
- ✓ Layout uses self-start and self-end for zigzag pattern

---
*Phase: 11-visual-redesign-image-effects*
*Completed: 2026-03-16*
