# Stack Research: Mobile-Native Calendar Interactions

**Domain:** Mobile-native calendar experience (bottom sheets, swipe gestures, haptic feedback, touch interactions)
**Researched:** 2026-03-13
**Confidence:** MEDIUM

## Executive Summary

For mobile-native calendar interactions in Next.js 16 + React 19 web app, add **minimal, focused libraries** for native-feeling mobile UX. Existing stack (Framer Motion, matchMedia) handles most needs. Add: vaul (bottom sheets), haptic feedback via Vibration API (no library needed), optional @use-gesture/react for complex swipe patterns.

**Key principle:** Leverage existing Framer Motion + React 19 capabilities where possible. Add libraries only for iOS/Android-specific patterns (bottom sheet snap points, haptic feedback).

---

## Recommended Stack Additions

### Bottom Sheet (Required)

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **vaul** | ^1.0.0 | Drawer/bottom sheet component with native snap points, drag gestures, spring physics | Industry standard for mobile drawer UX. Built on Radix UI (accessibility), uses spring physics matching native iOS/Android. Works with React 19. Minimal bundle (8kB gzipped). |

**Rationale:** Bottom sheets are iOS/Android UI pattern not native to web. Vaul provides:
- Snap points (half-height, full-height)
- Drag-to-dismiss with spring physics
- Accessibility (focus trap, ARIA)
- SSR compatible (Next.js 16)
- Works with existing Framer Motion animations

**Integration point:** Replace mobile `absolute` dropdown positioning in AvailabilityCalendar (line 138) and inline panel in StudioHourlyCalendar (line 365) with vaul `<Drawer.Root>`.

---

### Gesture Handling (Optional — Start Without)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **@use-gesture/react** | ^10.3.1 | Advanced gesture recognition (swipe velocity, direction, multi-touch) | ONLY if you need: swipe-between-dates (carousel pattern), pinch-to-zoom on hourly grid, complex drag thresholds. Start without — vaul handles basic drag. |

**Decision:** DO NOT install initially. Assess after vaul integration. Most calendar gestures (drag drawer, tap slots) work with vaul + onClick. Add @use-gesture only if UX requires:
- Swipe left/right to change dates (alternative to arrow buttons)
- Custom velocity-based transitions
- Multi-finger gestures

**Why defer:** Already have Framer Motion's `drag` and `whileTap`. Overlap with vaul's built-in gestures. Add complexity only if validated by user testing.

---

### Haptic Feedback (Required — No Library Needed)

| Technology | Version | Purpose | Implementation |
|------------|---------|---------|----------------|
| **Vibration API** | Browser native | Tactile feedback on slot selection, drawer snap, errors | Use `navigator.vibrate([pattern])` with feature detection. No dependencies. |

**Pattern recommendations:**
```typescript
// Slot selection: light tap
navigator.vibrate?.(10);

// Drawer snapped to position: subtle confirmation
navigator.vibrate?.(15);

// Error (unavailable slot): double pulse
navigator.vibrate?.([50, 100, 50]);

// Booking confirmed: success pattern
navigator.vibrate?.(200);
```

**Browser support:** iOS Safari 13+, Android Chrome 32+. Feature detection ensures graceful degradation on unsupported devices (desktop).

**Why no library:** Vibration API is simple, well-supported, and zero-bundle-cost. Libraries like `react-native-haptic-feedback` are for React Native (not web).

---

### Touch Optimization (Use Existing Stack)

| Capability | Implementation | Notes |
|------------|---------------|-------|
| **Touch targets (44px min)** | Tailwind classes `min-h-11 min-w-11` | Already in codebase. No library needed. |
| **Prevent tap delay** | CSS `touch-action: manipulation` | Add to interactive elements. Framer Motion applies automatically to `whileTap`. |
| **Smooth scroll** | Existing `@studio-freight/react-lenis` | Already installed. Use for date picker scroll. |
| **Momentum scrolling** | CSS `-webkit-overflow-scrolling: touch` | Apply to scrollable containers (hourly slots grid). |
| **Active states** | Framer Motion `whileTap={{ scale: 0.95 }}` | Already used in StudioHourlyCalendar (line 286). Continue pattern. |

**No new libraries needed.** Optimize with CSS and existing Framer Motion.

---

## Installation

```bash
# Bottom sheet (required)
npm install vaul

# Gesture library (optional — defer until needed)
# npm install @use-gesture/react
```

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| **vaul** | react-spring-bottom-sheet | If you need more control over spring physics and already use react-spring extensively. vaul is simpler, better docs. |
| **vaul** | Framer Motion custom drawer | If design requires non-standard drawer behavior (e.g., radial menu, curved path). For standard bottom sheets, vaul is faster to implement. |
| **Vibration API (native)** | react-haptic-feedback | Never for web. react-haptic-feedback is for React Native only. |
| **@use-gesture/react** | Framer Motion drag | Use Framer Motion for simple draggable elements. Use @use-gesture for velocity-based animations, directional swipe detection. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| **react-native-drawer** | React Native library, not web-compatible | vaul |
| **react-swipeable** | Outdated (last update 2021), poor TypeScript support, conflicts with modern React | @use-gesture/react or Framer Motion drag |
| **jQuery Mobile** | Ancient, massive bundle, imperative API incompatible with React | vaul + Framer Motion |
| **@radix-ui/react-dialog for bottom sheets** | Dialog is modal overlay, not drawer. Missing snap points, drag physics | vaul (built on Radix primitives but adds drawer-specific features) |
| **Custom CSS-only bottom sheets** | No spring physics, poor accessibility, breaks on iOS Safari momentum scroll | vaul |

---

## Stack Integration Patterns

### Pattern 1: Bottom Sheet for Mobile Calendar (AvailabilityCalendar)

**Before (absolute dropdown):**
```tsx
// Mobile: Inline absolute dropdown (line 264)
return (
  <AnimatePresence>
    {calendarContent}
  </AnimatePresence>
);
```

**After (vaul drawer):**
```tsx
import { Drawer } from 'vaul';

// Mobile: Bottom sheet with snap points
return (
  <Drawer.Root open onOpenChange={(open) => !open && onClose()}>
    <Drawer.Portal>
      <Drawer.Overlay className="fixed inset-0 bg-black/60" />
      <Drawer.Content className="fixed bottom-0 left-0 right-0 outline-none">
        {calendarContent}
      </Drawer.Content>
    </Drawer.Portal>
  </Drawer.Root>
);
```

### Pattern 2: Full-Height Bottom Sheet (StudioHourlyCalendar)

**Implementation:**
```tsx
<Drawer.Root
  open
  onOpenChange={(open) => !open && onClose()}
  snapPoints={[0.9, 1]} // 90% and full-height
  fadeFromIndex={0}
>
  <Drawer.Portal>
    <Drawer.Overlay />
    <Drawer.Content>
      {/* Drag handle */}
      <div className="mx-auto w-12 h-1.5 rounded-full bg-white/20 mb-4" />
      {calendarPanel}
    </Drawer.Content>
  </Drawer.Portal>
</Drawer.Root>
```

### Pattern 3: Haptic Feedback on Slot Selection

**Integration point:** StudioHourlyCalendar slot buttons (line 280)

```tsx
const handleSlotClick = (date: string, hour: string) => {
  // Haptic feedback
  if (navigator.vibrate) {
    navigator.vibrate(10); // 10ms light tap
  }

  onSlotSelect(date, hour);
};
```

**Error feedback (line 311 - unavailable slot):**
```tsx
const handleUnavailableClick = () => {
  if (navigator.vibrate) {
    navigator.vibrate([50, 100, 50]); // Double pulse error pattern
  }
};
```

---

## Desktop Compatibility

**Critical:** vaul is mobile-first but works on desktop. However, existing desktop `createPortal` modal should remain unchanged.

**Strategy:**
```tsx
// Keep existing branching logic (line 347)
if (isDesktop) {
  return createPortal(/* existing modal overlay */, document.body);
}

// Mobile only: vaul drawer
return <Drawer.Root>{/* ... */}</Drawer.Root>;
```

**Why:** Desktop users expect modal overlays (centered, ESC to close). Mobile users expect bottom sheets (drag to dismiss, snap points). Don't force drawer UX on desktop.

---

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| vaul@^1.0.0 | React 19.2.3 | Tested with React 19. Peer dep: react@^18.0.0 (React 19 compatible). |
| vaul@^1.0.0 | Next.js 16.1.6 | SSR compatible. Use `'use client'` directive (already in components). |
| vaul@^1.0.0 | Framer Motion 12.33.0 | No conflicts. Can animate Drawer.Content with Framer Motion if needed. |
| @use-gesture/react@^10.3.1 | React 19.2.3 | Compatible. Peer dep: react@^16.8.0 |
| Vibration API | All modern browsers | Feature detection required. iOS Safari 13+, Chrome 32+. Desktop: no-op. |

**Bundle size impact:**
- vaul: ~8kB gzipped (includes Radix UI Dialog primitives)
- @use-gesture/react: ~12kB gzipped (defer until needed)
- Vibration API: 0kB (native browser API)

**Total addition:** 8kB (vaul only, recommended minimum)

---

## Performance Considerations

### Bundle Size Strategy
1. **Install vaul immediately** — 8kB is negligible, provides core mobile UX
2. **Defer @use-gesture** — 12kB saved until swipe gestures validated as needed
3. **Use code splitting** — Already using dynamic imports in Next.js 16

### Animation Performance
- **vaul uses CSS transforms** — GPU-accelerated, smooth 60fps on mobile
- **Spring physics via react-spring** — Built into vaul, optimized for mobile
- **Framer Motion compatibility** — Can disable vaul animations if conflicts arise

### Touch Responsiveness
- **Passive event listeners** — vaul uses passive touch handlers (no scroll blocking)
- **RequestAnimationFrame** — Gesture tracking uses RAF for smooth updates
- **Debouncing** — Haptic feedback should NOT be debounced (feels laggy). Fire immediately on tap.

---

## Migration Path

### Phase 1: Bottom Sheet Foundation (Week 1)
1. Install vaul
2. Replace AvailabilityCalendar mobile rendering (simpler component)
3. Test snap points, drag-to-dismiss, accessibility
4. Add haptic feedback to date selection

### Phase 2: Complex Calendar (Week 2)
1. Migrate StudioHourlyCalendar to full-height drawer
2. Add drag handle UI element
3. Haptic feedback on hourly slot taps, unavailable slot errors
4. Test scroll behavior (hourly grid scrolling vs drawer drag)

### Phase 3: Gesture Enhancements (Week 3 — Optional)
1. Validate need for swipe-between-dates via user testing
2. If needed: install @use-gesture/react
3. Implement swipe left/right to change dates
4. Add velocity-based animations

---

## Testing Requirements

### Bottom Sheet Behavior
- [ ] Drawer opens from bottom on mobile (<768px)
- [ ] Snap points work (half/full height)
- [ ] Drag handle visible and functional
- [ ] Swipe down dismisses drawer
- [ ] Background overlay dismisses on tap
- [ ] Focus trap prevents tab outside drawer
- [ ] ESC key closes drawer

### Haptic Feedback
- [ ] Vibrates on slot selection (iOS Safari, Android Chrome)
- [ ] No errors on desktop (feature detection works)
- [ ] Different patterns for success/error recognizable
- [ ] Respects system haptic settings (iOS)

### Desktop Preservation
- [ ] Desktop modal unchanged (createPortal + overlay)
- [ ] No bottom sheet on desktop (>=768px)
- [ ] Keyboard navigation works (arrows, ESC, TAB)

### Performance
- [ ] 60fps drawer drag on mid-range Android (test on real device)
- [ ] No scroll blocking (can scroll hourly grid while drawer open)
- [ ] Bundle size <10kB added (check with next build --profile)

---

## Sources

**Note:** WebSearch and WebFetch were disabled for this research session. Recommendations based on training data (January 2025 cutoff) and codebase analysis.

- **vaul** — MEDIUM confidence. Known industry standard as of Jan 2025. Version ^1.0.0 should be current, but verify with `npm view vaul version` before install.
- **@use-gesture/react** — MEDIUM confidence. Active library, regular updates. Version ^10.3.1 from training data.
- **Vibration API** — HIGH confidence. Web standard, MDN documentation stable. Browser support well-documented.
- **Existing stack analysis** — HIGH confidence. Direct read of package.json, component files.

**Validation required:**
- [ ] Check vaul current version and React 19 compatibility on npm
- [ ] Verify vaul works with Next.js 16 App Router (should be fine, but test)
- [ ] Confirm @use-gesture/react latest version if installing

---

## Open Questions

1. **Drawer height for AvailabilityCalendar** — Should it be fixed height (320px like current dropdown) or dynamic based on content? Recommend dynamic with `snapPoints={[0.5, 0.9]}`.

2. **Swipe gestures priority** — Is swipe-between-dates core UX or nice-to-have? If core, install @use-gesture in Phase 1. If nice-to-have, defer to Phase 3.

3. **Haptic intensity** — iOS allows intensity control via Taptic Engine (not accessible via Vibration API). Accept platform limitations or explore iOS PWA APIs?

4. **Accessibility testing** — Need to validate bottom sheet + screen reader on iOS VoiceOver and Android TalkBack. vaul provides ARIA, but real-device testing required.

---

*Stack research for: Mobile-native calendar interactions*
*Researched: 2026-03-13*
*Confidence: MEDIUM (training data + codebase analysis, no live verification)*
