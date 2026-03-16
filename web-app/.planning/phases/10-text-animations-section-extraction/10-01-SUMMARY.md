---
phase: 10-text-animations-section-extraction
plan: 01
subsystem: ui
tags: [gsap, splitting, react-wrap-balancer, animations, text-effects]

# Dependency graph
requires:
  - phase: 09-foundation-pitfall-prevention
    provides: ANIMATION_LIBRARY_GUIDE.md, useReducedMotion hook, GSAP/Framer Motion separation
provides:
  - CharReveal component with GSAP character-by-character animation
  - BalancedHeadline component wrapping react-wrap-balancer
  - espacoData.ts with all static section data
  - TypeScript types for splitting library
affects: [10-02, 10-03, text-animations, espaco-redesign]

# Tech tracking
tech-stack:
  added: [splitting@1.1.0, react-wrap-balancer@1.1.1]
  patterns: [Character-level GSAP animations, Dynamic import for DOM libraries, Balanced typography]

key-files:
  created:
    - src/components/animations/CharReveal.tsx
    - src/components/animations/BalancedHeadline.tsx
    - src/data/espacoData.ts
    - src/types/splitting.d.ts
  modified:
    - package.json
    - package-lock.json

key-decisions:
  - "Used dynamic import for Splitting.js to prevent SSR issues"
  - "Created TypeScript declarations for splitting library (no @types package available)"
  - "Followed LIBRARY-01 pattern: added library ownership comments to animation components"

patterns-established:
  - "Pattern 1: GSAP animations use useInView (native IntersectionObserver), not Framer Motion hooks"
  - "Pattern 2: DOM manipulation libraries must be dynamically imported to avoid SSR/hydration issues"
  - "Pattern 3: All animation components check prefers-reduced-motion for accessibility compliance"

# Metrics
duration: 4min
completed: 2026-03-16
---

# Phase 10 Plan 01: Text Animation Components & Data Extraction Summary

**Character-reveal and balanced headline components created with splitting.js + GSAP, plus centralized espacoData.ts with all 13 photos**

## Performance

- **Duration:** 4 minutes
- **Started:** 2026-03-16T09:04:38Z
- **Completed:** 2026-03-16T09:08:39Z
- **Tasks:** 3
- **Files modified:** 6

## Accomplishments
- CharReveal component with GSAP scroll-triggered character animation and reduced-motion support
- BalancedHeadline component wrapping react-wrap-balancer for responsive typography
- Static data centralized in espacoData.ts (13 images + all section content) ready for section extraction

## Task Commits

Each task was committed atomically:

1. **Task 1: Install libraries and create CharReveal component** - `f57bf9c` (feat)
2. **Task 2: Create BalancedHeadline component** - `1971926` (feat)
3. **Task 3: Extract static data to espacoData.ts** - `ec693b1` (feat)

## Files Created/Modified

### Created
- `src/components/animations/CharReveal.tsx` - Character-by-character reveal using Splitting.js + GSAP stagger, viewport-triggered via useInView, respects prefers-reduced-motion
- `src/components/animations/BalancedHeadline.tsx` - Semantic wrapper around react-wrap-balancer for balanced line breaks
- `src/data/espacoData.ts` - All static content: estudiosImages (5), coworkImages (5), comodidadesImages (3), espacoContent (manifesto + section titles/subtitles), plus TypeScript types
- `src/types/splitting.d.ts` - TypeScript declarations for splitting library (no official @types package)

### Modified
- `package.json` - Added splitting@1.1.0 and react-wrap-balancer@1.1.1
- `package-lock.json` - Dependency lockfile update

## Decisions Made

1. **Dynamic import for Splitting.js** - DOM manipulation library requires client-side execution. Dynamic import in useEffect prevents SSR errors and hydration mismatches.

2. **TypeScript declarations** - Created manual .d.ts file for splitting library since @types/splitting doesn't exist. Provides type safety for Splitting API.

3. **GSAP + useInView pattern** - Following LIBRARY-01 decision from Phase 9: GSAP animations use native IntersectionObserver (via useInView hook), not Framer Motion hooks, for clear library separation.

4. **Library ownership comments** - Added comments documenting WHY GSAP was chosen over alternatives, per GUIDE-01 pattern from Phase 9.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added TypeScript declarations for splitting library**
- **Found during:** Task 1 (CharReveal component creation)
- **Issue:** TypeScript build failed with "Could not find a declaration file for module 'splitting'" - no @types/splitting package exists
- **Fix:** Created `src/types/splitting.d.ts` with manual type declarations for Splitting API (SplittingOptions, SplittingResult interfaces)
- **Files modified:** src/types/splitting.d.ts (new file)
- **Verification:** Build passes, CharReveal component has full type safety
- **Committed in:** f57bf9c (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking issue)
**Impact on plan:** Type declarations essential for TypeScript compilation. No scope creep - standard practice for untyped libraries.

## Issues Encountered

None - all tasks executed cleanly after TypeScript declaration fix.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for Plan 02 (Manifesto & Estudios sections):**
- CharReveal component available for section titles
- BalancedHeadline component available for headlines
- estudiosImages array ready for import from espacoData.ts
- espacoContent.manifesto and espacoContent.estudios ready for import
- All components respect prefers-reduced-motion (legal compliance)

**Ready for Plan 03 (Cowork & Comodidades sections):**
- coworkImages and comodidadesImages arrays ready
- espacoContent.cowork and espacoContent.comodidades ready
- Animation components composable with future layout patterns

**No blockers** - foundation complete for section extraction.

## Self-Check: PASSED

✅ All created files exist:
- `src/components/animations/CharReveal.tsx` exists
- `src/components/animations/BalancedHeadline.tsx` exists
- `src/data/espacoData.ts` exists (13 images confirmed)
- `src/types/splitting.d.ts` exists

✅ All commits exist:
- `f57bf9c` exists in git log
- `1971926` exists in git log
- `ec693b1` exists in git log

✅ Build verification passed (no errors)

---
*Phase: 10-text-animations-section-extraction*
*Completed: 2026-03-16*
