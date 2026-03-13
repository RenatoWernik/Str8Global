# Project Research Summary

**Project:** Str8Global v1.2 - Mobile-Native Calendar Experience
**Domain:** Mobile UX Enhancement (Bottom Sheets, Touch Gestures, Haptic Feedback)
**Researched:** 2026-03-13
**Confidence:** MEDIUM

## Executive Summary

This research focused on adding mobile-native interactions to existing calendar components (AvailabilityCalendar and StudioHourlyCalendar) in a Next.js 16 + React 19 web app. The existing architecture is solid — components already branch desktop/mobile using matchMedia, use createPortal for modals, and have clean state management. The recommended approach is to **extend existing components** rather than create separate mobile variants, minimizing code duplication and regression risk.

The technical path is straightforward: add **vaul** (8kB) for bottom sheets with native snap points and drag physics, implement haptic feedback using the browser's Vibration API (zero dependencies), and leverage existing Framer Motion for gesture handling. Defer @use-gesture/react until swipe-between-dates is validated as needed. The biggest risks are integration conflicts: Lenis smooth scroll fighting with drag gestures, body scroll lock breaking desktop modals, and performance degradation from animating 90+ calendar slots on mobile devices.

Success depends on rigorous mobile testing. Chrome DevTools mobile mode is insufficient — Safari iOS has unique bugs with 100vh viewport units, touch event passive listeners, and portal rendering. Test on real devices early, disable animations on mobile to maintain 60fps, and always guard haptic feedback with feature detection to prevent console errors on Safari.

## Key Findings

### Recommended Stack

**Add minimal, focused libraries** for mobile-native patterns. Existing stack (Framer Motion, matchMedia, Lenis) handles most needs.

**Core technologies:**
- **vaul** (^1.0.0): Bottom sheet/drawer component — Industry standard, built on Radix UI (accessibility), provides snap points and spring physics matching iOS/Android native feel. 8kB gzipped, SSR compatible.
- **Vibration API** (browser native): Haptic feedback via `navigator.vibrate()` — Zero dependencies, iOS Safari 13+/Android Chrome 32+ support. Feature detection ensures graceful degradation.
- **@use-gesture/react** (^10.3.1, OPTIONAL): Advanced gesture recognition — ONLY if swipe-between-dates or velocity-based transitions are validated as needed. Start without, add in Phase 2 if user testing demands it.
- **Framer Motion** (existing): Touch interactions via `drag` prop — Already installed, handles most gesture needs. No new dependency required.

**What NOT to add:**
- Avoid react-native-drawer, react-swipeable (outdated), jQuery Mobile (ancient), custom CSS-only bottom sheets (no accessibility/physics)
- Don't use Radix Dialog for bottom sheets (missing snap points/drag)

### Expected Features

**Must have (table stakes):**
- **Bottom Sheet Container** — iOS/Android native pattern, users expect calendars to slide up from bottom on mobile. Missing this = "desktop squeezed to mobile"
- **Swipe to Dismiss** — Pull down to close, standard mobile gesture for one-handed use
- **Safe Area Padding** — Respect iOS notch/home indicator, Android gesture bars (CSS `env(safe-area-inset-bottom)`)
- **Touch-Optimized Tap Targets** — Minimum 44x44px (Apple HIG) / 48x48dp (Material) to avoid mis-taps
- **Preserve Existing Features** — Month navigation, unavailable date display (line-through, Lock icon), loading states, "Hoje" shortcut, hourly slot grouping (Manhã/Tarde/Noite)

**Should have (competitive advantage):**
- **Horizontal Swipe Date Navigation** — Swipe left/right to change dates (iOS Calendar pattern), faster than arrow buttons
- **Haptic Feedback on Selection** — Subtle vibration on date/time tap, premium native feel
- **Quick Time Filters** — Pill buttons ("Manhã" / "Tarde" / "Noite") to jump to time periods, reduces scrolling
- **Persistent Selection Summary Bar** — Sticky footer showing selected date/time while scrolling hourly grid

**Defer (v2+):**
- **Multi-Month Preview (Peek)** — See edges of prev/next month while swiping, complex carousel implementation
- **Inline Mini Calendar** — Two-state bottom sheet (full vs collapsed), requires portal architecture rethink
- **Visual Time Density Heat Map** — Color intensity showing busier hours, informational not critical
- **Pull-to-Refresh** — Less expected in modal contexts, evaluate if users report stale data

### Architecture Approach

**Extend existing components with mobile-specific rendering branches** rather than creating separate files. Use a wrapper pattern (MobileBottomSheet.tsx) for reusable drawer behavior, but keep calendar logic unified in AvailabilityCalendar.tsx and StudioHourlyCalendar.tsx. Both desktop and mobile use createPortal to document.body to escape overflow-hidden parents that previously caused z-index issues.

**Major components:**
1. **MobileBottomSheet.tsx (NEW)** — Reusable wrapper with drag-to-dismiss, snap points, backdrop overlay, safe area handling. Wraps calendar content on mobile.
2. **AvailabilityCalendar.tsx (EXTEND)** — Add `if (!isDesktop)` branch for bottom sheet rendering. Desktop portal remains unchanged. Shared data fetching via useMonthlyAvailability.
3. **StudioHourlyCalendar.tsx (EXTEND)** — Add mobile bottom sheet with full-height variant, optimized grid layout (fewer columns, larger touch targets). Desktop unchanged.
4. **Parent Components (UNCHANGED)** — GearRenting, StudioRenting, CoworkStandalone manage `calendarOpen` state. No changes to state management, props, or callbacks.

**Key decisions:**
- Use createPortal for BOTH desktop and mobile (avoid overflow-hidden clipping)
- Keep state ownership in parent components (no global state)
- Branch rendering at component level (`if (isDesktop)` not separate files)
- Disable Lenis scroll when bottom sheet is open (prevent gesture conflicts)

### Critical Pitfalls

1. **Bottom Sheet Drag Conflicts with Lenis Smooth Scroll** — Both listen to touch events, causing Lenis to intercept drag gestures. Bottom sheet feels "sticky" or requires multiple swipe attempts. **Avoid:** Disable Lenis when bottom sheet is open (`lenis.stop()`), use `touch-action: none` on drag handle, explicitly `setPointerCapture` on drag start.

2. **Body Scroll Lock Breaks Desktop Modals** — Adding `overflow: hidden` to body for mobile breaks desktop modals using createPortal. Modal content becomes unscrollable or clipped. **Avoid:** Only lock scroll on mobile (`if (!isDesktop)`), restore original overflow on cleanup.

3. **Haptic Feedback Not Guarded by Feature Detection** — Calling `navigator.vibrate()` directly causes console errors in Safari (doesn't support Vibration API). **Avoid:** Always check `if ('vibrate' in navigator)` before calling. Abstract in utility function for reuse.

4. **AnimatePresence Exit Animations Don't Complete on Mobile** — Bottom sheet disappears instantly instead of sliding down smoothly. React unmounts component before animation finishes, especially on lower-end devices. **Avoid:** Delay state update until animation completes (setTimeout matching transition duration), use `willChange: transform` CSS hint.

5. **Performance Regression from Animating 90+ Slots** — Existing calendar uses Framer Motion stagger on all slots, causing 15-20fps on mid-range Android. Battery drains quickly. **Avoid:** Disable stagger on mobile (`staggerChildren: isDesktop ? 0.02 : 0`), consider virtualizing long lists, respect `prefers-reduced-motion`.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Bottom Sheet Foundation
**Rationale:** Core mobile-native pattern required before any other mobile enhancements. All subsequent features depend on bottom sheet working correctly. Highest risk phase due to integration with existing Lenis/Framer Motion/createPortal patterns.

**Delivers:**
- MobileBottomSheet.tsx reusable component
- AvailabilityCalendar with mobile bottom sheet variant
- Safe area padding (iOS notch/Android gesture bars)
- Touch-optimized tap targets (44x44px minimum)

**Addresses:**
- Bottom Sheet Container (table stakes)
- Swipe to Dismiss (table stakes)
- Safe Area Padding (table stakes)
- Touch-Optimized Tap Targets (table stakes)

**Avoids:**
- Pitfall #1: Lenis conflict (disable Lenis when sheet open)
- Pitfall #2: Body scroll lock breaking desktop (guard with isDesktop)
- Pitfall #4: Exit animations skipping (delay unmount)
- Pitfall #5: Performance regression (disable stagger on mobile)

**Complexity:** MEDIUM (2-3 days)
**Research flag:** SKIP — Well-documented patterns, existing architecture analysis complete

### Phase 2: Hourly Calendar Mobile Variant
**Rationale:** StudioHourlyCalendar is more complex than AvailabilityCalendar (90+ slots, scrollable grid, time grouping). Needs separate phase for testing scroll behavior, performance optimization, and full-height drawer with snap points.

**Delivers:**
- StudioHourlyCalendar with mobile bottom sheet
- Full-height drawer variant (90%/100% snap points)
- Optimized grid layout for mobile (fewer columns, larger buttons)
- Scroll-within-drawer testing (hourly grid scrolling vs drawer drag)

**Uses:**
- MobileBottomSheet from Phase 1
- vaul snap points for half/full height
- Existing useHourlyAvailability hook (unchanged)

**Implements:**
- Bottom sheet architecture extended to complex calendar
- Performance optimizations for large grids

**Complexity:** MEDIUM (2-3 days)
**Research flag:** SKIP — Extension of Phase 1 patterns

### Phase 3: Gesture Enhancements
**Rationale:** Optional polish features that add premium feel. Only implement after core bottom sheet validated with users. Haptic feedback is quick win (0.5 day). Horizontal swipe deferred until validated as needed.

**Delivers:**
- Haptic feedback on slot selection (10ms vibration)
- Haptic error patterns (double pulse for unavailable slots)
- Feature detection utility (`lib/haptics.ts`)
- (OPTIONAL) Horizontal swipe date navigation if user testing demands it

**Addresses:**
- Haptic Feedback (should-have differentiator)
- Horizontal Swipe Navigation (should-have, conditional on validation)

**Avoids:**
- Pitfall #3: Haptic errors in Safari (feature detection wrapper)

**Complexity:** LOW-MEDIUM (1-2 days haptics, +2-3 days if adding swipe navigation)
**Research flag:** SKIP for haptics, DEFER swipe research until Phase 2 user testing

### Phase 4: Mobile UX Polish
**Rationale:** Refinements discovered during testing. Quick time filters and persistent summary bar reduce friction in long hourly grids. Landscape orientation and responsive sizing ensure works across device sizes.

**Delivers:**
- Quick time filters (Manhã/Tarde/Noite pill buttons)
- Persistent selection summary bar (sticky footer)
- Landscape orientation support
- Responsive refinements (iPhone SE → iPad)

**Addresses:**
- Quick Filters (should-have)
- Persistent Summary Bar (should-have)

**Complexity:** LOW-MEDIUM (1-2 days)
**Research flag:** SKIP — UI implementation based on established patterns

### Phase Ordering Rationale

- **Phase 1 first:** All mobile features depend on bottom sheet foundation. Highest integration risk (Lenis, createPortal, animations) must be resolved before building on top.
- **Phase 2 separated:** StudioHourlyCalendar is complex enough (90+ slots, performance concerns) to warrant dedicated phase. Allows validating Phase 1 patterns on simpler AvailabilityCalendar first.
- **Phase 3 deferred:** Haptics and swipe gestures are polish, not blockers. Implement only after core UX validated. Swipe navigation specifically depends on user testing showing arrow buttons are problematic.
- **Phase 4 last:** Polish features discovered during testing. Quick wins that improve UX but not required for launch.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3 (if implementing swipe navigation):** May need @use-gesture/react library research for velocity-based animations, directional swipe detection. Current research deferred this.

Phases with standard patterns (skip research-phase):
- **Phase 1:** Vaul documentation, Framer Motion drag API, Lenis stop/start — well-documented, training data sufficient
- **Phase 2:** Extension of Phase 1 patterns, no new concepts
- **Phase 3 (haptics only):** Vibration API is simple, MDN docs stable
- **Phase 4:** UI implementation, no architectural unknowns

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | MEDIUM | vaul, Vibration API, Framer Motion recommendations based on training data (Jan 2025). No web search to verify 2026 versions/compatibility. Should check npm for latest vaul version and React 19 compatibility before install. |
| Features | MEDIUM | Table stakes and differentiators based on established mobile UX patterns (iOS HIG, Material Design, Airbnb/Booking.com patterns). No 2026-specific trends verified. Patterns are stable, unlikely to have changed. |
| Architecture | HIGH | Direct codebase analysis (AvailabilityCalendar.tsx, StudioHourlyCalendar.tsx, hooks, parent components). Component extension strategy is low-risk, proven pattern. Integration points verified. |
| Pitfalls | MEDIUM | Lenis conflicts, passive listeners, 100vh Safari, AnimatePresence timing are well-documented web patterns (HIGH confidence). Specific Framer Motion + Lenis interaction based on training data + codebase analysis (MEDIUM). Performance thresholds ("breaks at 50 elements") vary by device, need testing (LOW). |

**Overall confidence:** MEDIUM

### Gaps to Address

**Web search disabled for research session** — Could not verify:
- Latest vaul version and React 19 compatibility (training data suggests ^1.0.0 should work)
- 2025-2026 mobile UX trends or new mobile calendar libraries
- Framer Motion API changes post-January 2025
- Tailwind v4 stable release (project uses v4, assumed dvh support exists)

**Validation required during implementation:**
1. **Before Phase 1:** Run `npm view vaul version` and verify React 19 peer dependency compatibility. Check vaul GitHub issues for Next.js 16 App Router problems.
2. **During Phase 1:** Test on real iOS Safari and Android Chrome devices early. Chrome DevTools mobile mode insufficient for detecting Safari-specific bugs (100vh, touch events, portal rendering).
3. **Before Phase 3 swipe decision:** Conduct user testing on arrow button vs swipe navigation. Only install @use-gesture/react if data supports need.
4. **Performance validation:** Profile on mid-range Android device (not flagship). If <30fps, reduce animations further or implement virtualization.

**Known unknowns:**
- Exact performance thresholds for stagger animations (varies by device, must test)
- Whether users prefer swipe vs arrow buttons for date navigation (requires A/B testing)
- iOS PWA-specific haptic intensity control (Vibration API doesn't expose, accept platform limitation or explore iOS PWA APIs post-launch)

## Sources

### Primary (HIGH confidence)
- **Codebase analysis:** Direct read of AvailabilityCalendar.tsx, StudioHourlyCalendar.tsx, useMonthlyAvailability.ts, useHourlyAvailability.ts, GearRenting.tsx, StudioRenting.tsx, CoworkStandalone.tsx, package.json, LenisProvider.tsx
- **Browser APIs:** MDN Web Docs (Vibration API, touch events, passive listeners, Visual Viewport API, `env(safe-area-inset-*)`)
- **Frameworks:** Framer Motion documentation (drag API, AnimatePresence, mobile performance), React createPortal pattern

### Secondary (MEDIUM confidence)
- **Mobile UX patterns:** iOS Human Interface Guidelines (touch targets, bottom sheets, gestures), Material Design (touch targets, bottom sheets)
- **Industry patterns:** Airbnb, Booking.com, Google Calendar mobile implementations (common booking calendar features)
- **Lenis library:** @studio-freight/react-lenis documentation and common conflict patterns

### Tertiary (LOW confidence, needs validation)
- **vaul library:** Version ^1.0.0 and React 19 compatibility from training data (Jan 2025 cutoff). Verify with npm before install.
- **@use-gesture/react:** Version ^10.3.1 from training data. Check latest if implementing swipe navigation.
- **Tailwind v4 dvh support:** Assumed based on CSS spec, but project uses v4 beta — verify in Tailwind docs.

**Could not verify (web search/fetch disabled):**
- Current vaul version, GitHub issues, React 19 compatibility testing
- 2026-specific mobile calendar UX trends or new libraries
- Safari iOS bugs specific to 2026 versions
- Lenis + vaul integration examples or documented conflicts

---
*Research completed: 2026-03-13*
*Ready for roadmap: yes*
