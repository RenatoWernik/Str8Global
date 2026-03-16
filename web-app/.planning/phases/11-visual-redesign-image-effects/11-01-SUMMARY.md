---
phase: 11-visual-redesign-image-effects
plan: 01
subsystem: ui
tags: [gsap, animations, clip-path, intersection-observer, performance]

# Dependency graph
requires:
  - phase: 10-text-animations-section-extraction
    provides: CharReveal, BalancedHeadline, espacoData.ts structure
  - phase: 09-animation-infrastructure
    provides: ANIMATION_LIBRARY_GUIDE.md, useReducedMotion hook, GSAP patterns
provides:
  - RevealImage component with GSAP clip-path reveal animation
  - useSectionInView hook for section-level viewport observation
  - Foundation for 1-observer-per-section pattern (VFX-06)
affects: [11-02, 11-03, 11-04]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Section-level IntersectionObserver pattern (VFX-06)"
    - "Parent-controlled animation via isInView prop"
    - "GSAP clip-path reveal with configurable direction"

key-files:
  created:
    - src/components/animations/RevealImage.tsx
    - src/hooks/useSectionInView.ts
  modified:
    - src/hooks/index.ts

key-decisions:
  - "RevealImage accepts isInView from parent instead of creating its own observer (VFX-06 compliance)"
  - "useSectionInView hardcodes triggerOnce: true to minimize observer overhead"
  - "Default rootMargin -5% triggers animation slightly before section fully visible"
  - "Four reveal directions supported (up/down/left/right) via configurable clip-path inset"

patterns-established:
  - "Pattern 1: Section component creates ONE useSectionInView → passes isInView to ALL child RevealImages"
  - "Pattern 2: RevealImage uses loading='eager' to prevent LCP delay on scroll-revealed images (VFX-05)"
  - "Pattern 3: All animations respect prefers-reduced-motion via gsap.set() immediate display"

# Metrics
duration: 1 min
completed: 2026-03-16
---

# Phase 11 Plan 01: Foundation Components Summary

**GSAP clip-path reveal animation component and section-level viewport observer hook to replace 13 per-image IntersectionObservers with 1 per section**

## Performance

- **Duration:** 1 min
- **Started:** 2026-03-16T09:40:17.691Z
- **Completed:** 2026-03-16T09:42:16.391Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Created RevealImage component with GSAP clip-path animation (4 directions: up/down/left/right)
- Created useSectionInView hook reducing observer overhead from 13 to 3 (1 per section)
- Both components fully accessibility-compliant with prefers-reduced-motion support
- Established parent-controlled animation pattern for VFX-06 compliance

## Task Commits

Each task was committed atomically:

1. **Task 1: Create RevealImage component** - `1982850` (feat)
   - GSAP-based clip-path reveal with configurable direction
   - Stagger delay support for cascading reveals
   - Parent-controlled via isInView prop
   - loading='eager' on all images (VFX-05)

2. **Task 2: Create useSectionInView hook** - `87e8c47` (feat)
   - Section-level viewport observation with native IntersectionObserver
   - Returns sectionRef and isInView boolean
   - triggerOnce: true for performance
   - Exported from hooks barrel

## Files Created/Modified
- `src/components/animations/RevealImage.tsx` - Reusable image wrapper with GSAP clip-path reveal animation, accepts isInView from parent section
- `src/hooks/useSectionInView.ts` - Section-level IntersectionObserver hook returning ref and boolean state
- `src/hooks/index.ts` - Added useSectionInView export to hooks barrel

## Decisions Made

**VFX-06 Compliance (1-observer-per-section):**
- RevealImage accepts `isInView` prop instead of creating its own observer
- Parent section uses useSectionInView once, passes boolean to all child images
- Reduces 13 IntersectionObservers to 3 (one per section: Estudios, Cowork, Comodidades)

**Direction Configuration:**
- Four reveal directions via clip-path inset mappings:
  - `up`: `inset(100% 0 0 0)` → `inset(0)` (bottom to top)
  - `down`: `inset(0 0 100% 0)` → `inset(0)` (top to bottom)
  - `left`: `inset(0 100% 0 0)` → `inset(0)` (right to left)
  - `right`: `inset(0 0 0 100%)` → `inset(0)` (left to right)

**Performance Optimizations:**
- `loading="eager"` on all revealed images prevents LCP delay (VFX-05)
- `triggerOnce: true` in useSectionInView automatically disconnects after first trigger
- Default rootMargin `-5%` triggers animations before section fully visible for smoother UX

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Foundation components ready for section rewrites:
- **11-02**: Estudios section rewrite will be first to use RevealImage + useSectionInView pattern
- **11-03**: Cowork section rewrite will follow same pattern
- **11-04**: Comodidades section rewrite will complete the trilogy
- Pattern established: Section calls useSectionInView once → passes isInView to all RevealImage children
- Performance baseline: Reduces from 13 IntersectionObservers to 3 (one per section)

## Self-Check: PASSED

All claimed files and commits verified:
- ✓ src/components/animations/RevealImage.tsx exists
- ✓ src/hooks/useSectionInView.ts exists
- ✓ Commit 1982850 exists (Task 1: RevealImage)
- ✓ Commit 87e8c47 exists (Task 2: useSectionInView)

---
*Phase: 11-visual-redesign-image-effects*
*Completed: 2026-03-16*
