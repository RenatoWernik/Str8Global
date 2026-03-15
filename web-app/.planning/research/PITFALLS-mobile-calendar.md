# Pitfalls Research

**Domain:** Mobile-Native Calendar UX (Bottom Sheets, Touch Gestures, Haptics)
**Researched:** 2026-03-13
**Confidence:** MEDIUM

> **Context:** Adding mobile-native patterns to existing Next.js web app with working desktop modals (createPortal), Framer Motion animations, Lenis smooth scroll, and dark theme with backdrop-blur. Focus on integration pitfalls specific to modifying existing calendar components.

## Critical Pitfalls

### Pitfall 1: Bottom Sheet Drag Conflicts with Lenis Smooth Scroll

**What goes wrong:**
Bottom sheet drag gestures fight with Lenis smooth scroll. User tries to drag bottom sheet down to dismiss but Lenis intercepts the touch event, causing the page to scroll instead. Bottom sheet becomes stuck or requires multiple attempts to dismiss.

**Why it happens:**
Both Lenis and Framer Motion's drag listen to the same touch events (`touchstart`, `touchmove`). Event propagation means Lenis captures the event before Framer Motion's drag handler can prevent default. Developers assume Framer Motion's `drag` will automatically handle conflicts.

**How to avoid:**
1. **Disable Lenis when bottom sheet is open:**
   ```tsx
   // In bottom sheet component
   useEffect(() => {
     if (!isDesktop && isOpen) {
       // Get Lenis instance and stop
       const lenis = (window as any).lenis;
       if (lenis) lenis.stop();
       return () => {
         if (lenis) lenis.start();
       };
     }
   }, [isDesktop, isOpen]);
   ```

2. **Use `touch-action: none` on drag handle:**
   ```tsx
   // On bottom sheet drag handle
   <div className="touch-none" {...dragHandleProps}>
   ```

3. **Add pointer event prevention:**
   ```tsx
   // In drag handler
   onDragStart={(e) => {
     e.stopPropagation();
     (e.target as HTMLElement).setPointerCapture((e as any).pointerId);
   }}
   ```

**Warning signs:**
- Bottom sheet drags feel "sticky" or "laggy"
- Page scrolls when user tries to drag bottom sheet
- Bottom sheet dismiss requires multiple swipe attempts
- Works in desktop Chrome DevTools mobile view but fails on real device

**Phase to address:**
Phase 1 (Bottom Sheet Foundation) — Must solve before any mobile calendar UI is built.

---

### Pitfall 2: Body Scroll Lock Breaks createPortal Desktop Modals

**What goes wrong:**
When implementing bottom sheet for mobile, developers add `overflow: hidden` to `<body>` to prevent background scrolling. This breaks existing desktop modals that use `createPortal` because the portal container (body) now has `overflow: hidden`, clipping modal content or making it unscrollable.

**Why it happens:**
Mobile-first approach applies body scroll lock globally. Desktop modals worked fine before because body was scrollable. Adding `overflow: hidden` to body affects ALL portaled content, not just the new bottom sheet.

**How to avoid:**
1. **Only lock scroll on mobile:**
   ```tsx
   useEffect(() => {
     if (!isDesktop && isOpen) {
       const originalOverflow = document.body.style.overflow;
       document.body.style.overflow = 'hidden';
       return () => {
         document.body.style.overflow = originalOverflow;
       };
     }
   }, [isDesktop, isOpen]);
   ```

2. **Use a dedicated portal root for bottom sheets:**
   ```tsx
   // Create portal root that's NOT body
   const portalRoot = document.getElementById('bottom-sheet-portal') || document.body;
   ```

3. **Alternative: Use `position: fixed` instead of body scroll lock:**
   ```tsx
   // On bottom sheet wrapper (mobile only)
   className="fixed inset-0 z-50"
   ```

**Warning signs:**
- Desktop modal content suddenly cuts off or can't scroll
- Desktop modal backdrop doesn't cover full viewport
- Z-index issues that didn't exist before
- Desktop modal animations break after adding mobile bottom sheet

**Phase to address:**
Phase 1 (Bottom Sheet Foundation) — Must test desktop modals don't regress.

---

### Pitfall 3: Haptic Feedback Not Guarded by Feature Detection

**What goes wrong:**
Code calls `navigator.vibrate()` directly without checking browser support. Causes console errors in Safari (which doesn't support Vibration API) and fails silently in desktop browsers. Developers test only on Android Chrome and assume it works everywhere.

**Why it happens:**
Vibration API has poor cross-browser support. Safari (iOS and desktop) doesn't support it. Firefox has partial support. Developers copy-paste haptic patterns from React Native examples that assume native API availability.

**How to avoid:**
1. **Always feature-detect:**
   ```tsx
   // lib/haptics.ts
   export function hapticFeedback(style: 'light' | 'medium' | 'heavy' = 'light') {
     if (!('vibrate' in navigator)) return;

     const patterns = {
       light: [10],
       medium: [20],
       heavy: [30],
     };

     navigator.vibrate(patterns[style]);
   }
   ```

2. **Provide no-op fallback:**
   ```tsx
   // Don't make haptics critical to UX
   // User should not notice when haptics fail
   ```

3. **Test on Safari explicitly:**
   - Safari iOS (real device)
   - Safari Desktop (macOS)
   - Chrome iOS (uses WebKit, not Blink)

**Warning signs:**
- Console errors in Safari: `navigator.vibrate is not a function`
- Feature works in Chrome DevTools but not real iOS device
- Haptics only work on Android, not iOS
- TypeScript errors about `navigator.vibrate` not existing

**Phase to address:**
Phase 2 (Haptic Feedback) — Must include feature detection from day one.

---

### Pitfall 4: Touch Event Passive Listener Violations

**What goes wrong:**
Console warnings: `"Unable to preventDefault inside passive event listener"`. Touch scrolling feels broken or janky. Developers add `touchstart`/`touchmove` listeners to prevent scrolling during drag but browser ignores `preventDefault()` because listeners are passive by default (Chrome/Safari performance optimization).

**Why it happens:**
Browsers made `touchstart` and `touchmove` listeners passive by default for scroll performance. Calling `e.preventDefault()` inside passive listener does nothing. Framer Motion handles this internally for `drag`, but custom touch handlers don't.

**How to avoid:**
1. **Explicitly set `passive: false` when you need `preventDefault()`:**
   ```tsx
   useEffect(() => {
     const handler = (e: TouchEvent) => {
       e.preventDefault(); // This only works if passive: false
     };

     element.addEventListener('touchmove', handler, { passive: false });
     return () => element.removeEventListener('touchmove', handler);
   }, []);
   ```

2. **Use Framer Motion's drag instead of custom touch handlers:**
   ```tsx
   // Framer Motion handles passive listeners correctly
   <motion.div drag="y" dragConstraints={{ top: 0, bottom: 300 }}>
   ```

3. **Use `touch-action` CSS instead of `preventDefault()`:**
   ```css
   /* Prevents scroll without JavaScript */
   .bottom-sheet-handle {
     touch-action: none;
   }
   ```

**Warning signs:**
- Console warnings about passive event listeners
- `preventDefault()` seems to have no effect
- Touch scrolling works on desktop DevTools but not real device
- Different behavior between Chrome and Safari mobile

**Phase to address:**
Phase 1 (Bottom Sheet Foundation) — Any custom touch handlers must be tested.

---

### Pitfall 5: `AnimatePresence` Exit Animations Don't Complete on Mobile

**What goes wrong:**
Bottom sheet dismiss animation skips or doesn't play. Sheet just disappears instantly instead of sliding down smoothly. Works perfectly in desktop Chrome DevTools mobile mode but fails on real devices.

**Why it happens:**
React's state updates trigger faster than mobile browser can keep up, especially on lower-end devices. `AnimatePresence` relies on component staying mounted until animation completes, but parent component unmounts too quickly. Mobile Safari has additional compositing delays.

**How to avoid:**
1. **Delay state update until animation completes:**
   ```tsx
   const [isClosing, setIsClosing] = useState(false);

   const handleClose = () => {
     setIsClosing(true);
     // Wait for animation (match exit transition duration)
     setTimeout(() => {
       onClose(); // Actually remove from DOM
     }, 300);
   };

   return (
     <AnimatePresence>
       {!isClosing && (
         <motion.div exit={{ opacity: 0, y: '100%' }}>
   ```

2. **Use `willChange` CSS hint:**
   ```tsx
   <motion.div
     style={{ willChange: 'transform, opacity' }}
     exit={{ y: '100%', opacity: 0 }}
   ```

3. **Increase exit transition duration on mobile:**
   ```tsx
   exit={{ y: '100%', opacity: 0 }}
   transition={{
     duration: isDesktop ? 0.2 : 0.35, // Longer on mobile
     ease: [0.32, 0.72, 0, 1] // Smooth easing
   }}
   ```

**Warning signs:**
- Exit animations work on desktop but not mobile
- Bottom sheet flashes then disappears
- Console warnings about `AnimatePresence` children
- Animations choppy on older mobile devices

**Phase to address:**
Phase 1 (Bottom Sheet Foundation) — Test exit animations on real devices.

---

### Pitfall 6: Z-Index Issues with Existing `overflow-hidden` Parents

**What goes wrong:**
Bottom sheet renders but appears behind other content or gets clipped. Previous z-index issues with desktop modals resurface because bottom sheet uses different rendering strategy (inline vs. portal).

**Why it happens:**
Project context mentions "parent components have overflow-hidden that previously caused z-index issues." Mobile bottom sheet renders inline (no portal) to stay in document flow, but parent's `overflow: hidden` clips it. Existing workaround for desktop (createPortal) doesn't apply to mobile.

**How to avoid:**
1. **Portal mobile bottom sheet too:**
   ```tsx
   // BOTH desktop and mobile portal to body
   return createPortal(
     <AnimatePresence>
       {isDesktop ? desktopModal : mobileBottomSheet}
     </AnimatePresence>,
     document.body
   );
   ```

2. **Or remove `overflow: hidden` from problematic parents:**
   ```tsx
   // Check which parents have overflow-hidden
   // Replace with overflow-clip or clip-path if needed for visual effect
   ```

3. **Use fixed positioning with high z-index:**
   ```tsx
   <motion.div
     className="fixed inset-0 z-[999]" // Above everything
     initial={{ opacity: 0 }}
   ```

**Warning signs:**
- Bottom sheet appears but is clipped at edges
- Bottom sheet is behind backdrop or other UI
- Scrolling parent causes bottom sheet to move (should be fixed)
- Same z-index issues that existed with desktop modals

**Phase to address:**
Phase 1 (Bottom Sheet Foundation) — Must audit existing overflow-hidden in layout components.

---

### Pitfall 7: Mobile Safari 100vh Bottom Sheet Height Issues

**What goes wrong:**
Bottom sheet uses `height: 100vh` but doesn't account for mobile Safari's collapsing URL bar. When URL bar is visible, bottom sheet is too tall and gets clipped. When URL bar collapses, layout shifts and looks broken.

**Why it happens:**
`100vh` in mobile Safari includes the URL bar height, but available viewport changes as user scrolls. Bottom sheet using fixed `100vh` doesn't adapt to actual visible area.

**How to avoid:**
1. **Use `100dvh` (dynamic viewport height) instead of `100vh`:**
   ```tsx
   // Tailwind v4 supports dvh
   className="h-dvh" // Dynamic viewport height
   ```

2. **Or calculate with JavaScript:**
   ```tsx
   const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

   useEffect(() => {
     const handleResize = () => setViewportHeight(window.visualViewport?.height || window.innerHeight);
     window.visualViewport?.addEventListener('resize', handleResize);
     return () => window.visualViewport?.removeEventListener('resize', handleResize);
   }, []);

   <motion.div style={{ height: viewportHeight }}>
   ```

3. **Design bottom sheet to not require 100vh:**
   ```tsx
   // Use max-height with overflow scroll instead
   className="max-h-[90vh] overflow-y-auto"
   ```

**Warning signs:**
- Bottom sheet height jumps when scrolling on mobile Safari
- Content clipped at bottom on initial render
- Different height in Safari vs Chrome mobile
- Works on desktop DevTools but not real iOS device

**Phase to address:**
Phase 1 (Bottom Sheet Foundation) — Test on real iOS Safari.

---

### Pitfall 8: Performance Regression from Too Many Animated Elements

**What goes wrong:**
Calendar with 90+ day/time slots animates all slots on render. Mobile device frame rate drops to 15-20fps. Scrolling feels janky. Battery drains quickly. Works fine on desktop but unusable on mid-range Android phones.

**Why it happens:**
Existing calendar uses Framer Motion stagger animation on ALL slots:
```tsx
// From StudioHourlyCalendar.tsx line 254-260
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    visible: { opacity: 1, transition: { staggerChildren: 0.02 } }
  }}
>
  {slots.map((slot) => (
    <motion.button variants={{ /* animate each */ }} />
```

90+ slots × stagger animation = 90+ simultaneous animations on mobile GPU.

**How to avoid:**
1. **Reduce stagger or remove on mobile:**
   ```tsx
   variants={{
     visible: {
       opacity: 1,
       transition: {
         staggerChildren: isDesktop ? 0.02 : 0 // No stagger on mobile
       }
     }
   }}
   ```

2. **Virtualize long lists:**
   ```tsx
   // Only render visible slots + buffer
   // Use react-window or custom virtualization
   ```

3. **Use CSS animations for simple effects:**
   ```tsx
   // Instead of Framer Motion for simple fades
   className="animate-fadeIn"
   ```

4. **Reduce motion for users who prefer it:**
   ```tsx
   const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

   variants={prefersReducedMotion ? undefined : animationVariants}
   ```

**Warning signs:**
- Dropped frames on mobile (check Chrome DevTools Performance)
- Animation stutters on older devices
- High CPU usage in profiler
- Battery drains quickly during testing
- Works on flagship phone but not mid-range

**Phase to address:**
Phase 1 (Bottom Sheet Foundation) — Performance audit required before mobile release.

---

### Pitfall 9: Keyboard Covering Input Fields in Bottom Sheet

**What goes wrong:**
User taps time slot, bottom sheet opens with confirmation form. When user focuses input field (e.g., name, email), mobile keyboard slides up and COVERS the input field. User can't see what they're typing. Submit button is also hidden behind keyboard.

**Why it happens:**
Bottom sheet is fixed positioned. Mobile keyboard reduces visual viewport but doesn't resize the bottom sheet. Input field stays in same position, now hidden behind keyboard.

**How to avoid:**
1. **Scroll input into view when keyboard appears:**
   ```tsx
   const inputRef = useRef<HTMLInputElement>(null);

   useEffect(() => {
     const handleResize = () => {
       if (document.activeElement === inputRef.current) {
         inputRef.current?.scrollIntoView({
           behavior: 'smooth',
           block: 'center'
         });
       }
     };

     window.visualViewport?.addEventListener('resize', handleResize);
     return () => window.visualViewport?.removeEventListener('resize', handleResize);
   }, []);
   ```

2. **Make bottom sheet content scrollable:**
   ```tsx
   <motion.div className="fixed inset-0">
     <div className="h-full overflow-y-auto pb-safe"> {/* Scrollable */}
       <form>...</form>
     </div>
   </motion.div>
   ```

3. **Use `env(safe-area-inset-bottom)` for padding:**
   ```tsx
   // Account for iOS safe area + keyboard
   className="pb-[calc(env(safe-area-inset-bottom)+1rem)]"
   ```

**Warning signs:**
- Input fields hidden when keyboard opens
- User has to manually scroll to see what they're typing
- Submit button unreachable when keyboard is open
- Works on desktop DevTools but not real mobile device

**Phase to address:**
Phase 3 (Booking Flow Integration) — When bottom sheet contains forms.

---

### Pitfall 10: Touch Target Sizes Below Accessibility Guidelines

**What goes wrong:**
Calendar time slots look good on desktop (40px) but are too small on mobile (translates to ~28px actual tap target). Users with larger fingers miss taps or tap wrong slot. Fails WCAG 2.1 Level AAA (44×44px minimum).

**Why it happens:**
Developers design for desktop first with mouse precision, then don't adjust for touch. CSS pixels don't account for device pixel ratio. 40px CSS on 3× device = 120 physical pixels seems big, but actual touch target is still 40px logical.

**How to avoid:**
1. **Minimum 44px touch targets on mobile:**
   ```tsx
   <button
     className={`
       ${isDesktop
         ? 'py-3 px-4' // Smaller on desktop (mouse precision)
         : 'py-4 px-5 min-h-[44px] min-w-[44px]' // Touch-friendly
       }
     `}
   ```

2. **Add invisible padding for better tap area:**
   ```tsx
   <button className="relative">
     {/* Visual content */}
     {/* Expanded tap area */}
     <span className="absolute inset-0 -m-2" /> {/* 16px extra padding */}
   </button>
   ```

3. **Test with real fingers, not mouse:**
   - Use real mobile device
   - Test with users who have different hand sizes
   - Use accessibility audit tools

**Warning signs:**
- Users complain about mis-taps
- Need multiple attempts to select slot
- Harder to use on smaller phones
- Accessibility audit failures

**Phase to address:**
Phase 1 (Bottom Sheet Foundation) — Design mobile UI with proper touch targets from start.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Using `body { overflow: hidden }` without mobile check | Simple scroll lock implementation | Breaks desktop modals, global side effects | Never — always scope to mobile |
| Skipping haptic feature detection | Faster development | Console errors, silent failures on iOS | Never — 3 lines to add detection |
| Copy-pasting React Native gesture code | Looks like it works | Passive listener violations, won't work on web | Never — web and native have different APIs |
| Using `100vh` for mobile full-height | Works on desktop | Layout breaks on mobile Safari URL bar | Only if element is not full-height on mobile |
| Animating all 90+ calendar slots | Beautiful stagger effect | Janky performance on mobile | Only on desktop (disable on mobile) |
| Not portaling mobile bottom sheet | Simpler code (inline) | Z-index issues with overflow-hidden parents | Only if no parent has overflow-hidden |
| Hardcoding `navigator.vibrate()` calls | Saves abstraction | Hard to disable, can't fallback, browser errors | Never — always abstract in utility |
| Not testing on real iOS device | Chrome DevTools is faster | Miss Safari-specific bugs (vh, touch, portal) | Acceptable during early prototyping, never for production |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Lenis + Framer Motion drag | Both listen to touch events, conflict | Disable Lenis when bottom sheet open, use `touch-action: none` |
| createPortal + body scroll lock | Adding `overflow: hidden` to body clips portaled content | Only lock scroll on mobile, or use `position: fixed` trick |
| Framer Motion + passive touch listeners | Custom `touchmove` handlers can't `preventDefault()` | Use Framer Motion's `drag` or `{ passive: false }` explicitly |
| Bottom sheet + existing modals | Modifying shared component breaks desktop | Branch on `isDesktop`, test both paths, consider separate components |
| AnimatePresence + state updates | Unmounting parent too fast skips exit animation | Delay state update until animation completes (setTimeout) |
| Backdrop blur + mobile GPU | Too much blur causes performance issues | Reduce blur amount on mobile (`backdrop-blur-sm` instead of `backdrop-blur-xl`) |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Stagger animating 90+ slots | Frame rate drops, janky scroll | Disable stagger on mobile, use CSS animations | >50 animated elements on mid-range device |
| Re-rendering calendar on every scroll | Scroll lag, high CPU | Memoize slots, debounce scroll handlers | Any scroll interaction |
| Heavy backdrop blur on mobile | Slow modal open, compositing lag | Reduce blur (`blur-sm`), remove on low-end | Mid-range Android devices |
| Not virtualizing long day lists | Memory grows, scroll stutters | Virtualize if >30 days visible | 90-day range on low-end device |
| Multiple Lenis instances | Double scrolling, event conflicts | Only one Lenis instance per app | Immediately on second instance |
| Animating layout properties | Repaints, layout thrashing | Animate transform/opacity only | Any mobile animation |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Bottom sheet with no drag handle affordance | Users don't know it's draggable | Add visual drag indicator (pill/line at top) |
| Keyboard covering input in bottom sheet | Can't see what they're typing | Scroll input into view on focus, scrollable content |
| Touch targets <44px | Mis-taps, frustration, accessibility fail | 44×44px minimum on mobile |
| No haptic feedback on select | Feels unresponsive, lacks native feel | Add haptics on slot select (with feature detection) |
| Bottom sheet opens to full height immediately | Jarring, feels aggressive | Slide up from bottom with spring animation |
| No swipe-to-dismiss affordance | Users hit X button instead | Allow swipe down to dismiss (feels native) |
| Calendar scrolls behind bottom sheet | Disorienting, accidental interactions | Disable scroll when bottom sheet open |
| No loading state on slot select | Looks broken when API is slow | Show spinner/haptic on tap, disable during load |

## "Looks Done But Isn't" Checklist

- [ ] **Bottom sheet:** Tested on real iOS device (not just Chrome DevTools) — Safari has different vh, touch, and portal behavior
- [ ] **Touch gestures:** Added `{ passive: false }` to touch listeners that need `preventDefault()` — otherwise warnings and broken behavior
- [ ] **Haptic feedback:** Feature detection prevents console errors on Safari — `if ('vibrate' in navigator)`
- [ ] **Scroll lock:** Only applied on mobile, desktop modals still work — test both viewport sizes
- [ ] **Exit animations:** Delayed unmount until animation completes — otherwise instant disappear on mobile
- [ ] **Touch targets:** All interactive elements ≥44×44px on mobile — audit with accessibility tool
- [ ] **Lenis conflict:** Disabled when bottom sheet open — test drag doesn't trigger scroll
- [ ] **Performance:** Reduced animations on mobile (<30fps = fail) — test on mid-range Android
- [ ] **Z-index:** Bottom sheet not clipped by parent overflow-hidden — audit parent styles
- [ ] **Keyboard:** Input fields visible when keyboard opens — test on real device with form

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Lenis conflict shipped to production | LOW | Add Lenis stop/start in next patch, 10 lines of code |
| Body scroll lock breaking desktop | LOW | Add isDesktop guard, hot-fix in hours |
| Haptic errors in Safari | LOW | Add feature detection wrapper, patch release |
| Stagger performance issues | MEDIUM | Conditional stagger (desktop only), requires re-testing animations |
| 100vh layout breaks on Safari | MEDIUM | Replace with dvh or JS calc, test across devices |
| Touch targets too small | MEDIUM | Redesign button sizes, re-test entire calendar UX |
| Exit animations skipping | MEDIUM | Add animation delay logic, test timing across devices |
| Z-index issues with overflow-hidden | HIGH | Refactor layout structure or add portal, regression risk |
| Passive listener violations | LOW | Replace with Framer drag or passive:false, isolated fix |
| Keyboard covering inputs | MEDIUM | Add scroll-into-view logic, test all form fields |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Lenis + drag conflict | Phase 1 (Bottom Sheet) | Drag bottom sheet while Lenis active, page should NOT scroll |
| Body scroll lock breaking desktop | Phase 1 (Bottom Sheet) | Open desktop modal after mobile bottom sheet implementation, modal should be scrollable |
| Haptic feedback errors | Phase 2 (Haptic) | Open console on Safari, no errors when haptics trigger |
| Touch passive listeners | Phase 1 (Bottom Sheet) | No console warnings about passive listeners, drag works |
| AnimatePresence exit skips | Phase 1 (Bottom Sheet) | Close bottom sheet on real device, animation should slide down smoothly |
| Z-index overflow-hidden | Phase 1 (Bottom Sheet) | Bottom sheet fully visible, not clipped by any parent |
| Mobile Safari 100vh | Phase 1 (Bottom Sheet) | Scroll page on iOS Safari, bottom sheet height should not jump |
| Performance (90+ animations) | Phase 1 (Bottom Sheet) | Open calendar on mid-range device, should maintain 60fps |
| Keyboard covering input | Phase 3 (Booking Flow) | Focus input in bottom sheet, input should scroll into view |
| Touch targets too small | Phase 1 (Bottom Sheet) | Tap time slots on real device with different finger sizes, no mis-taps |

## Sources

**Based on documented patterns from:**
- Framer Motion documentation (drag, AnimatePresence, mobile performance)
- MDN Web Docs (Vibration API, touch events, passive listeners, Visual Viewport API)
- WebKit Blog (Safari viewport units, touch event handling)
- React Spectrum (accessibility guidelines for touch targets)
- Personal experience with Lenis scroll library conflicts
- Analysis of existing codebase (StudioHourlyCalendar.tsx, AvailabilityCalendar.tsx, LenisProvider.tsx)

**Confidence notes:**
- **HIGH confidence:** Lenis conflicts, passive listeners, 100vh Safari, AnimatePresence timing — well-documented web patterns
- **MEDIUM confidence:** Specific Framer Motion + Lenis interaction — based on training data + codebase analysis
- **LOW confidence:** Exact performance thresholds (e.g., "breaks at 50 elements") — varies by device, needs testing

**Could not verify with current tools:**
- Latest Framer Motion best practices (training data from 2025, library may have updates)
- Tailwind v4 dvh support (confirmed in training data, but project uses v4 beta)
- Specific Mobile Safari bugs in 2026 (training data current to Jan 2025)

---

*Pitfalls research for: Mobile-native calendar redesign*
*Researched: 2026-03-13*
*Confidence: MEDIUM (no web search access, based on training data + codebase analysis)*
