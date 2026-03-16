---
phase: 11-visual-redesign-image-effects
plan: 02
subsystem: ui
tags: [css-grid, bento-layout, gsap, clip-path, asymmetric-design]

# Dependency graph
requires:
  - phase: 11-visual-redesign-image-effects
    plan: 01
    provides: RevealImage component, useSectionInView hook
  - phase: 10-text-animations-section-extraction
    provides: CharReveal, BalancedHeadline, espacoData.ts
provides:
  - EstudiosSection with asymmetric bento grid layout
  - VFX-02 compliance (creative layout pattern)
  - Single IntersectionObserver for 5 images (VFX-06)
affects: [11-03, 11-04]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "CSS Grid 12-column asymmetric bento layout"
    - "Explicit grid-rows with fixed heights for creative sizing"
    - "Section-level viewport observer with child prop passing"

key-files:
  created: []
  modified:
    - src/components/sections/espaco/EstudiosSection.tsx

key-decisions:
  - "Desktop: 3-row CSS Grid (300px/300px/280px) with 12-column asymmetric areas creates visual hierarchy"
  - "Mobile: Single column with varying aspect ratios (4/5, 16/9, 3/2) degrades gracefully"
  - "Stagger delays: 0/0.1/0.2/0.15/0.25 create cascading reveal pattern"
  - "Reveal directions: up/left/left/up/right add visual interest"

patterns-established:
  - "Pattern 1: Bento grid uses explicit grid-rows with fixed pixel heights instead of aspect-ratio for desktop"
  - "Pattern 2: Mobile layout uses aspect-ratio classes for responsive sizing"
  - "Pattern 3: All grid cells have consistent border and rounded-xl styling"

# Metrics
duration: 2 min
completed: 2026-03-16
---

# Phase 11 Plan 02: Bento Grid Studios Section Summary

**Asymmetric CSS Grid bento layout with GSAP clip-path reveals replaces Masonry + Framer Motion whileInView**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-16T09:45:31Z
- **Completed:** 2026-03-16T09:47:47Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments
- Completely rewrote EstudiosSection with asymmetric bento grid layout (VFX-02 compliance)
- Removed all Framer Motion dependencies (no motion.div, no whileInView)
- Implemented CSS Grid 12-column layout with varying cell sizes for visual hierarchy
- All 5 studio images now use GSAP clip-path reveal via RevealImage
- Single section-level IntersectionObserver reduces overhead (VFX-06)
- Mobile layout degrades to single column with varying aspect ratios

## Task Commits

1. **Task 1: Rewrite EstudiosSection with bento grid and RevealImage** - `a3c964c` (feat)
   - Desktop: 12-column grid with 3 fixed-height rows (300px/300px/280px)
   - Image 1: 7-span tall hero (spans 2 rows), reveal up
   - Image 2: 5-span top right, reveal left, delay 0.1
   - Image 3: 5-span middle right, reveal left, delay 0.2
   - Image 4: 4-span bottom left, reveal up, delay 0.15
   - Image 5: 8-span wide bottom right, reveal right, delay 0.25
   - Mobile: Single column with aspect-[4/5], aspect-video, aspect-[3/2]
   - Removed Masonry component and all Framer Motion imports

## Files Created/Modified
- `src/components/sections/espaco/EstudiosSection.tsx` - Complete rewrite: removed Framer Motion whileInView, replaced Masonry with CSS Grid 12-column bento layout, integrated RevealImage with useSectionInView (1 observer for 5 images)

## Decisions Made

**Bento Grid Layout:**
- Desktop uses explicit `grid-rows-[300px_300px_280px]` for fixed-height creative layout
- 12-column grid allows flexible span sizing: 7/5/5/4/8 creates asymmetry
- Image 1 as tall hero (row-span-2) establishes visual hierarchy
- Bottom row has shorter height (280px) for visual balance

**Reveal Pattern:**
- Stagger delays create cascading effect: first image instant, last at 0.25s
- Directions vary to add visual interest: up from bottom, left from right, right from left
- All reveals use clip-path animation (not fade) for sharp, modern aesthetic

**Mobile Degradation:**
- Single column maintains content order (1→2→3→4→5)
- Varying aspect ratios (4/5, 16/9, 3/2) prevent monotony
- No reveals on mobile (standard Image component) for performance

**Performance:**
- Single useSectionInView call creates ONE IntersectionObserver
- All 5 RevealImage components share same isInView boolean
- Reduces observer overhead from 5 to 1 (VFX-06 compliance)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

**Build lock conflict:**
- Next.js dev server was running, blocking build command
- Verified changes via grep instead (TypeScript already passed)
- All verification criteria met: no Framer Motion, no whileInView, grid-cols-12 present, RevealImage/useSectionInView imported, all 5 images used

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Bento grid pattern established for remaining sections:
- **11-03 (Cowork)**: Will use similar CSS Grid approach with different layout (5 images)
- **11-04 (Comodidades)**: Will adapt pattern for 3 images
- Pattern proven: Section-level observer → shared isInView → individual RevealImage delays/directions
- Performance baseline maintained: 1 observer per section regardless of image count

## Self-Check: PASSED

All claimed files and commits verified:
- ✓ src/components/sections/espaco/EstudiosSection.tsx modified (120 insertions, 37 deletions)
- ✓ Commit a3c964c exists (Task 1: bento grid rewrite)
- ✓ No Framer Motion imports in file
- ✓ No whileInView props in file
- ✓ RevealImage and useSectionInView imported
- ✓ CSS Grid with grid-cols-12 present
- ✓ All 5 estudiosImages used (10 total uses: 5 desktop + 5 mobile)

---
*Phase: 11-visual-redesign-image-effects*
*Completed: 2026-03-16*
