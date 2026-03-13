# Feature Research: Mobile-Native Calendar Redesign

**Domain:** Mobile booking calendar experience (web app)
**Researched:** 2026-03-13
**Confidence:** MEDIUM (based on training data through January 2025 + established mobile UX patterns)

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist in mobile booking calendars. Missing these = product feels broken or frustrating.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Bottom Sheet / Modal Drawer** | iOS/Android native pattern — users expect calendars to slide up from bottom on mobile | MEDIUM | Needs: dismissible by swipe-down gesture, backdrop tap, safe area insets, proper z-index layering. Already have portal logic in existing calendars. |
| **Swipe to Dismiss** | Standard mobile gesture — pulling down to close feels natural | MEDIUM | Requires: pan gesture detection, threshold velocity/distance, spring animation back if threshold not met. Library: Framer Motion drag constraints. |
| **Touch-Optimized Tap Targets** | Apple HIG: minimum 44x44pt, Material: 48x48dp — current 320px calendar likely has small targets | LOW | Already have aspect-square grid cells. Need to verify min-height (currently responsive). |
| **Day-of-Week Headers** | Users need Monday/Tuesday context to avoid booking wrong day | LOW | Already implemented (`WEEKDAYS_PT`). Table stakes to keep. |
| **Visual Unavailable States** | Users must see what's blocked before tapping (avoid frustration) | LOW | Already have: `line-through` for unavailable dates, `Lock` icon for occupied slots. Table stakes. |
| **Loading States** | Mobile networks are slow/unreliable — must show fetch progress | LOW | Already have: `loading` flag, `Loader2` spinner. Need to preserve for mobile. |
| **Today Shortcut** | Users frequently book "today" or "tomorrow" — quick access reduces friction | LOW | Already have "Hoje" button. Common pattern in booking flows. |
| **Scroll Snappin g (Date Picker)** | When swiping through months/dates horizontally, should snap to full view | MEDIUM | Not yet implemented. Needed for carousel-style date navigation. CSS `scroll-snap-type: x mandatory`. |
| **Pull-to-Refresh (Optional)** | Mobile pattern to reload availability — less expected in modals, more in full-page views | MEDIUM | May not be table stakes for modal calendars. Evaluate if needed. |
| **Safe Area Padding** | iOS notch/dynamic island, Android gesture bars — content must not be obscured | LOW | Not yet implemented. Critical for bottom sheets. CSS `env(safe-area-inset-bottom)`. |

### Differentiators (Competitive Advantage)

Features that set mobile booking apart. Not required, but create delight or solve common frustrations.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Horizontal Swipe Date Navigation** | Faster than tap-left/tap-right arrows — native calendar app pattern (iOS Calendar) | MEDIUM | Alternative to current ChevronLeft/ChevronRight buttons. Use `react-swipeable` or Framer Motion `drag` + `onDragEnd`. Snap to full dates. |
| **Multi-Month Preview (Peek)** | See edges of prev/next month while swiping — reduces cognitive load | MEDIUM-HIGH | Requires: carousel with partial views (show 10-20% of adjacent months). CSS `scroll-padding` or custom carousel. |
| **Inline Mini Calendar (Collapsed State)** | Full bottom sheet for first interaction, then collapses to mini date strip for quick re-selection | HIGH | Two-state component: full (initial) vs mini (after first selection). Saves vertical space. Seen in Airbnb mobile. |
| **Haptic Feedback on Selection** | Tactile confirmation when tapping date/time — feels premium | LOW | Web: `navigator.vibrate(50)` (iOS Safari doesn't support, Android Chrome does). Graceful degradation. |
| **Time Slot Grouping (Already Have)** | Manhã/Tarde/Noite sections reduce overwhelming grid — easier to scan | LOW | Already implemented in `StudioHourlyCalendar`. Differentiator vs flat 8-23h list. Keep and optimize. |
| **Visual Time Density Heat Map** | Show "busier" hours with color intensity (e.g., more red = fewer slots) | MEDIUM | Helps users pick less-popular times. Requires aggregating availability across time ranges. Not critical for MVP. |
| **Quick Filters (Morning/Afternoon/Evening)** | Tap to jump to time period — faster than scrolling | LOW-MEDIUM | Add pill buttons above hourly grid: "Manhã" → scroll to 8h, "Tarde" → 12h, "Noite" → 18h. |
| **Optimistic UI Updates** | Show selection immediately, sync in background — feels instant | MEDIUM | Risk: conflicts if unavailable. Need rollback UX. Consider for post-MVP. |
| **Persistent Selection Summary Bar** | Sticky footer showing "22 Mar, 14:00" while scrolling time slots — context reminder | MEDIUM | Prevents "wait, what date did I pick?" Useful for hourly calendar with long scroll. |
| **Gesture-Based Time Scrolling** | Scrub through hours by dragging a slider (like iOS alarm picker) | HIGH | Novel but potentially confusing for first-time users. Probably not worth complexity. |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems in mobile booking calendars.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| **Infinite Scroll Calendar** | "Users should scroll forever through months" | Performance degrades with hundreds of DOM nodes. Also: 90-day booking window is business constraint. | Keep current: ChevronLeft/ChevronRight with disabled state at limits. Or carousel with lazy-loaded months (max 3 rendered). |
| **Multi-Date Selection (Range)** | "Let users book multiple days at once" | Adds complexity: range validation, partial unavailability, UI for clearing ranges. Your flow is WhatsApp CTA (not direct booking), so range isn't needed. | Single-date selection → user contacts via WhatsApp to discuss multi-day. |
| **Native Date Picker (`<input type="date">`)** | "Browser's built-in picker is faster to implement" | Ugly, inconsistent across browsers (especially iOS Safari), can't show unavailable dates, can't theme to dark + magenta. | Custom calendar with touch-optimized UI. Already implemented. |
| **Auto-Advance After Selection** | "Automatically move to next step after picking date" | Disorienting on mobile — users want to confirm their choice first. Also prevents multi-step edits (e.g., "oops, wrong date"). | Explicit "Confirm" or "Continue" button. Or make selection trigger WhatsApp CTA directly (current pattern). |
| **Pinch-to-Zoom Calendar** | "Let users zoom in to see more detail" | Conflicts with browser's page zoom. Adds gesture complexity. Not useful for calendars (dates are discrete, not continuous like maps). | Ensure adequate font size (already using `text-sm` to `text-xl` responsive). |
| **Custom Week Start (Sunday vs Monday)** | "Some users prefer Sunday first" | Adds settings complexity. PT-PT convention is Monday-first (ISO 8601). | Keep Monday-first (`WEEKDAYS_PT` already starts Seg). |
| **Time Zone Selector** | "Users might book from different time zones" | Over-engineering for local Lisboa studio. Adds cognitive load. | Assume Lisboa time (UTC+0/+1). Show "Horário de Lisboa" label if international users expected. |

## Feature Dependencies

```
Bottom Sheet Container
    └──requires──> Swipe to Dismiss Gesture
    └──requires──> Safe Area Padding
    └──enhances──> Backdrop Blur + Tap to Close (already have)

Horizontal Swipe Date Navigation
    └──requires──> Scroll Snapping
    └──conflicts──> Swipe to Dismiss (different gestures on same axis)
    └──solution──> Lock swipe-to-dismiss to vertical-only pan

Inline Mini Calendar (Collapsed State)
    └──requires──> Bottom Sheet Container
    └──requires──> Animation between expanded/collapsed states
    └──conflicts──> Current portal-to-body pattern (needs shared state)

Persistent Selection Summary Bar
    └──requires──> Bottom Sheet Container (sticky positioning context)
    └──enhances──> Long hourly time grids

Haptic Feedback
    └──requires──> Feature detection (not supported on iOS)
    └──enhances──> Touch interaction (any button/selection)
```

### Dependency Notes

- **Bottom Sheet requires Swipe to Dismiss:** Core mobile pattern — users expect to pull down to close. Not having this feels "stuck".
- **Bottom Sheet requires Safe Area Padding:** Without `env(safe-area-inset-bottom)`, content hides under iOS home indicator or Android gesture bar.
- **Horizontal Swipe conflicts with Swipe to Dismiss:** Both use pan gestures. Solution: restrict swipe-to-dismiss to vertical (`dragConstraints={{ top: 0, bottom: 300 }}` in Framer Motion), allow horizontal swipe for date navigation.
- **Scroll Snapping enhances Horizontal Swipe:** Without snap, user might land "between" two dates — confusing. CSS `scroll-snap-type: x mandatory` on container + `scroll-snap-align: center` on date cards.
- **Inline Mini Calendar conflicts with current portal pattern:** Current `createPortal(document.body)` makes bottom sheet global. Mini calendar needs to live in page flow for collapsed state. May need to rethink portal strategy or have two calendar modes (full-screen modal vs in-flow bottom sheet).

## MVP Definition

### Launch With (Phase 1: Mobile Bottom Sheet Foundation)

Minimum viable mobile-native experience — what's needed to make mobile feel "native" instead of "desktop squeezed".

- [x] **Bottom Sheet Container** — Slide up from bottom, replaces current desktop modal on mobile
  - **Why essential:** Current 320px dropdown feels cramped. Bottom sheet is expected mobile pattern.
  - **Complexity:** MEDIUM (gesture detection, spring animation, safe areas)

- [x] **Swipe to Dismiss (Vertical)** — Pull down to close calendar
  - **Why essential:** Expected mobile gesture. Improves one-handed usability.
  - **Complexity:** MEDIUM (Framer Motion `drag` + velocity threshold)

- [x] **Safe Area Padding** — Respect iOS notch/home indicator, Android gesture bars
  - **Why essential:** Content visibility. Without this, buttons are un-tappable.
  - **Complexity:** LOW (CSS `env()` variables)

- [x] **Touch-Optimized Tap Targets** — Minimum 44x44pt for all interactive elements
  - **Why essential:** Current calendar might be too small on phones. Avoid mis-taps.
  - **Complexity:** LOW (adjust `min-h-[44px]` on date cells)

- [x] **Preserve Existing Features** — All current functionality must work in bottom sheet
  - Month navigation (ChevronLeft/ChevronRight)
  - Unavailable date display (line-through, Lock icon)
  - Loading states (spinner)
  - Today shortcut ("Hoje" button)
  - Hourly slot grouping (Manhã/Tarde/Noite)
  - **Why essential:** Redesign should enhance mobile, not remove working features.
  - **Complexity:** LOW (refactor, not rebuild)

### Add After Validation (Phase 2: Gesture Enhancements)

Features to add once core bottom sheet is working and validated with users.

- [ ] **Horizontal Swipe Date Navigation** — Swipe left/right to change dates (alternative to arrow buttons)
  - **Trigger for adding:** User testing shows arrow buttons are slow/annoying
  - **Complexity:** MEDIUM (carousel pattern, scroll snap)

- [ ] **Multi-Month Preview (Peek)** — See edges of prev/next month while swiping
  - **Trigger for adding:** Users report "not knowing what's ahead" when swiping
  - **Complexity:** MEDIUM-HIGH (carousel with partial views)

- [ ] **Haptic Feedback on Selection** — Subtle vibration when tapping date/time
  - **Trigger for adding:** Want to add premium feel after core UX is solid
  - **Complexity:** LOW (one line: `navigator.vibrate(50)`, with feature detection)

- [ ] **Quick Filters for Time Periods** — "Manhã" / "Tarde" / "Noite" pill buttons to jump
  - **Trigger for adding:** Analytics show users scroll heavily through hourly grid
  - **Complexity:** LOW-MEDIUM (scroll-to logic)

- [ ] **Persistent Selection Summary Bar** — Sticky footer showing selected date/time while scrolling
  - **Trigger for adding:** Hourly grid is long, users lose context
  - **Complexity:** MEDIUM (sticky positioning, state management)

### Future Consideration (Phase 3+: Advanced UX)

Features to defer until mobile calendar is validated and showing strong engagement.

- [ ] **Inline Mini Calendar (Collapsed State)** — Two-state bottom sheet (full vs mini)
  - **Why defer:** High complexity. Need to rethink portal architecture. Not critical if bottom sheet is fast to open/close.

- [ ] **Visual Time Density Heat Map** — Show busier hours with color intensity
  - **Why defer:** Requires aggregating availability data. Nice-to-have, not blocking.

- [ ] **Optimistic UI Updates** — Show selection immediately, sync in background
  - **Why defer:** Risk of conflicts. Need robust rollback UX. Current flow (select → WhatsApp) is fast enough.

- [ ] **Pull-to-Refresh** — Reload availability by pulling down
  - **Why defer:** Less common in modal contexts. Evaluate if users report stale data issues.

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority | Notes |
|---------|------------|---------------------|----------|-------|
| Bottom Sheet Container | HIGH | MEDIUM | **P1** | Foundation for all mobile improvements |
| Swipe to Dismiss | HIGH | MEDIUM | **P1** | Expected mobile gesture |
| Safe Area Padding | HIGH | LOW | **P1** | Critical for iOS/Android usability |
| Touch-Optimized Tap Targets | HIGH | LOW | **P1** | Avoid mis-taps |
| Horizontal Swipe Navigation | MEDIUM | MEDIUM | **P2** | Nice-to-have, not blocking |
| Haptic Feedback | LOW | LOW | **P2** | Premium feel, easy to add |
| Quick Time Filters | MEDIUM | LOW-MEDIUM | **P2** | Reduces scrolling friction |
| Persistent Summary Bar | MEDIUM | MEDIUM | **P2** | Helpful for long grids |
| Multi-Month Preview | MEDIUM | HIGH | **P3** | Complex, uncertain ROI |
| Inline Mini Calendar | LOW | HIGH | **P3** | Over-engineering for MVP |
| Visual Density Heat Map | LOW | MEDIUM | **P3** | Informational, not critical |
| Optimistic UI | LOW | MEDIUM | **P3** | Current sync is fast enough |

**Priority key:**
- **P1:** Must have for mobile-native feel — blocks launch
- **P2:** Should have — add after P1 validation
- **P3:** Nice to have — future consideration

## Existing Features to Preserve

These are already implemented in `AvailabilityCalendar` and `StudioHourlyCalendar` — must carry forward to mobile redesign.

| Existing Feature | Status | Mobile Consideration |
|------------------|--------|----------------------|
| **Portal to body (desktop)** | ✅ Implemented | Keep for desktop. Mobile uses bottom sheet (in-flow or portal with different positioning). |
| **Month navigation (prev/next)** | ✅ Implemented | Keep. Potentially enhance with swipe gestures (Phase 2). |
| **Unavailable date display** | ✅ Implemented (`line-through`) | Keep. Visual clarity is table stakes. |
| **Hourly slot grouping** | ✅ Implemented (Manhã/Tarde/Noite) | Keep. Differentiator vs flat grids. |
| **Today shortcut** | ✅ Implemented ("Hoje" button) | Keep. Frequently used in booking flows. |
| **Loading states** | ✅ Implemented (`Loader2`, `loading` flag) | Keep. Mobile networks are slower. |
| **90-day booking window** | ✅ Implemented (`maxDate = today + 90`) | Keep. Business constraint. |
| **Click outside to close** | ✅ Implemented | Keep for desktop. Mobile uses swipe-to-dismiss + backdrop tap. |
| **Escape key to close** | ✅ Implemented | Keep for desktop. Less relevant on mobile (no physical keyboard). |
| **Portuguese localization** | ✅ Implemented (`MONTHS_PT`, `WEEKDAYS_PT`) | Keep. Non-negotiable for PT-PT market. |
| **Dark theme + magenta accent** | ✅ Implemented | Keep. Brand identity. |
| **Framer Motion animations** | ✅ Implemented (spring transitions) | Keep. Enhance with gesture-based animations (drag, swipe). |

## Mobile-Specific Patterns (Industry Standards)

Based on common mobile booking calendar implementations (Airbnb, Booking.com, Google Calendar mobile):

### Pattern 1: Bottom Sheet vs Full-Screen Modal

**Industry consensus:**
- **Bottom Sheet (half-screen):** Date pickers, simple selections (1-2 taps to complete)
- **Full-Screen Modal:** Complex calendars with filters, ranges, multi-step flows

**Recommendation for Str8Global:**
- **Monthly date picker (equipment/cowork):** Bottom sheet (simple: pick 1 date → close)
- **Hourly slot picker (studios):** Bottom sheet with scroll (more content, but still single-selection)
- Both are single-step selections leading to WhatsApp CTA — bottom sheet is appropriate

### Pattern 2: Gesture Hierarchy

**Conflict resolution when multiple gestures exist:**

| Gesture | Direction | Priority | Example |
|---------|-----------|----------|---------|
| Swipe to Dismiss | Vertical (down) | HIGH | Pull down bottom sheet to close |
| Scroll Content | Vertical (up/down) | HIGH | Scroll through time slots |
| Navigate Dates | Horizontal (left/right) | MEDIUM | Swipe between days/months |
| Pinch to Zoom | Multi-touch | LOW | Usually disabled in calendars |

**Implementation notes:**
- Use Framer Motion `dragConstraints` to separate vertical (dismiss) from horizontal (navigate)
- Disable scroll when dragging to dismiss (check `isDragging` flag)
- Use `overscroll-behavior-y: contain` to prevent pull-to-refresh browser default

### Pattern 3: Selection Feedback Loop

**Expected feedback on tap:**

1. **Visual change** (immediate): Selected date/time highlights with accent color
2. **Haptic feedback** (optional, 50ms vibration): Tactile confirmation
3. **UI update** (immediate): Update summary text ("22 de Março, 14:00")
4. **State persistence** (immediate): Remember selection if user closes/reopens
5. **Action trigger** (on confirm): Show WhatsApp CTA or auto-advance to next step

**Current implementation:** ✅ Has #1 (magenta highlight), ✅ Has #3 (date string in state), ✅ Has #5 (WhatsApp CTA)
**Missing:** #2 (haptic, optional), #4 (persistence across modal close/reopen — currently resets)

## Complexity Estimates (For Roadmap Planning)

| Feature Category | Complexity | Est. Dev Time | Dependencies |
|------------------|------------|---------------|--------------|
| **Bottom Sheet Foundation** | MEDIUM | 2-3 days | Framer Motion (already installed), safe area CSS |
| **Swipe to Dismiss** | MEDIUM | 1-2 days | Bottom Sheet foundation |
| **Safe Area Padding** | LOW | 0.5 day | CSS only |
| **Touch Target Optimization** | LOW | 0.5 day | CSS only |
| **Horizontal Swipe Navigation** | MEDIUM | 2-3 days | Carousel logic, scroll snap |
| **Multi-Month Preview** | MEDIUM-HIGH | 3-4 days | Carousel with partial views |
| **Haptic Feedback** | LOW | 0.5 day | Feature detection + single API call |
| **Quick Time Filters** | LOW-MEDIUM | 1-2 days | Scroll-to logic, pill button UI |
| **Persistent Summary Bar** | MEDIUM | 1-2 days | Sticky positioning, state management |
| **Inline Mini Calendar** | HIGH | 4-5 days | Rethink portal architecture, two-state animation |

**Total for Phase 1 (MVP):** ~4-6 days
**Total for Phase 2 (Enhancements):** ~5-8 days
**Total for Phase 3 (Advanced):** ~5-6 days

## Sources

**Confidence Assessment:**
- **MEDIUM overall** — Based on training data through January 2025 + established mobile UX patterns from iOS HIG, Material Design, and common web booking flows (Airbnb, Booking.com, Google Calendar).
- **No web search available** — Could not verify 2026-specific trends or new libraries. Recommendations are based on stable, long-standing patterns (bottom sheets, swipe gestures, touch targets) that are unlikely to have changed.
- **Code analysis** — HIGH confidence on current implementation (read `AvailabilityCalendar.tsx`, `StudioHourlyCalendar.tsx`, hooks). All feature dependencies verified against existing codebase.

**Known gaps:**
- Latest mobile UX trends (2025-2026) — may exist newer patterns not in training data
- React/Framer Motion updates post-January 2025 — API changes possible
- Mobile-specific calendar libraries (e.g., `react-mobile-datepicker`, `react-swipeable-views`) — versions and best practices may have evolved

**Verification recommended:**
- Check Framer Motion docs for latest `drag` / `dragConstraints` API (training data: v10-11)
- Verify `navigator.vibrate()` browser support in 2026 (training data: supported in Chrome Android, not iOS Safari)
- Review latest iOS HIG / Material Design for touch target sizes (training data: 44pt / 48dp)

---
*Feature research for: Mobile-native calendar redesign (Str8Global)*
*Researched: 2026-03-13*
*Confidence: MEDIUM (training data + established patterns, no web search verification)*
