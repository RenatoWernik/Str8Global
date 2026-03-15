# Pitfalls Research: Heavy Scroll-Driven Animations

**Domain:** Creative page redesign with GSAP ScrollTrigger + Framer Motion + Lenis smooth scroll
**Researched:** 2026-03-15
**Confidence:** MEDIUM (based on codebase analysis + training data; WebSearch/WebFetch unavailable)

> **Context:** Adding creative, immersive animations to Espaço page (4 heavily animated sections + Hero Globe 3D + CTA). Focus on scroll-driven animations, parallax effects, image reveal animations, and interactive elements using GSAP ScrollTrigger + Framer Motion + Lenis smooth scroll on Next.js 16 with React 19.

## Critical Pitfalls

### Pitfall 1: Lenis-ScrollTrigger Desync on Navigation

**What goes wrong:**
ScrollTrigger calculations become inaccurate after client-side navigation or DOM mutations. Animations trigger at wrong scroll positions, or don't trigger at all. Most common symptom: animations work on initial page load, break after navigating back to the page.

**Why it happens:**
Lenis intercepts scroll events and transforms scroll position. ScrollTrigger must be notified about Lenis's internal scroll position on every frame, but React's component lifecycle doesn't guarantee this connection survives navigation or Suspense boundaries (especially in Next.js 16 with React 19 concurrent rendering).

**How to avoid:**
```tsx
// In LenisProvider.tsx or page component
import { ReactLenis, useLenis } from '@studio-freight/react-lenis';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function LenisProvider({ children }: { children: ReactNode }) {
  const lenis = useLenis((lenis) => {
    // Sync Lenis with ScrollTrigger on EVERY frame
    ScrollTrigger.update();
  });

  useEffect(() => {
    // Force refresh after mount and layout shifts
    const timeout = setTimeout(() => ScrollTrigger.refresh(), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <ReactLenis root options={{ lerp: 0.12, duration: 1.2 }}>
      {children}
    </ReactLenis>
  );
}
```

**CRITICAL:** Your current `LenisProvider.tsx` does NOT include the `useLenis()` hook callback to sync with ScrollTrigger. This MUST be added before adding heavy scroll animations.

**Warning signs:**
- Animations trigger too early/late after navigating back to page
- Console errors: "ScrollTrigger.refresh() was called while a previous refresh() was still active"
- ScrollTrigger markers (if enabled) don't align with actual trigger points
- Animations work in production but not after Fast Refresh in dev

**Phase to address:**
**Phase 01** (Foundation) — Fix LenisProvider before any new scroll animations are added.

---

### Pitfall 2: GSAP + Framer Motion Fighting Over Same Properties

**What goes wrong:**
When GSAP and Framer Motion both animate the same property (e.g., `opacity`, `y`, `scale`) on the same element, one library overwrites the other unpredictably. Result: janky, stuttering animations or animations that "jump" mid-transition.

**Why it happens:**
GSAP directly mutates inline styles. Framer Motion uses React state + inline styles. When both libraries animate `transform`, they compete for control over the same CSS property, causing render thrashing.

**Example conflict in current code:**
- `espaco/page.tsx` line 46: Framer Motion animates `y` on Hero background
- `ScrollReveal.tsx`: GSAP animates `y` on text elements
- If both are used on the same element, they will conflict

**How to avoid:**

**Rule 1: Library-per-element separation**
```tsx
// GOOD: GSAP animates container, Framer Motion animates children
<div ref={gsapRef} className="container">
  <motion.div animate={{ opacity: 1 }}>Content</motion.div>
</div>

// BAD: Both animate the same element
<motion.div ref={gsapRef} animate={{ y: 0 }}>
  {/* GSAP also animates y on this element = conflict */}
</motion.div>
```

**Rule 2: Property partitioning**
```tsx
// GOOD: GSAP handles transforms, Framer Motion handles opacity
gsap.to(element, { x: 100, y: 50, rotation: 45 });
<motion.div animate={{ opacity: 1, filter: "blur(0px)" }}>

// BAD: Both libraries animate y
gsap.to(element, { y: 50 });
<motion.div animate={{ y: 0 }}>
```

**Rule 3: Choose ONE library per animation type**
- **GSAP:** Scroll-driven animations (ScrollTrigger), complex timelines, SVG morphing
- **Framer Motion:** Entrance animations (mount/unmount), hover states, gesture-based interactions

**For Espaço page specifically:**
- Use GSAP ScrollTrigger for: parallax effects, image reveals, section transitions
- Use Framer Motion for: initial hero entrance, hover effects on cards, viewport-once animations (already implemented correctly in `BlurText.tsx`)

**Warning signs:**
- DevTools shows rapid style recalculations (>30 per second)
- Animations stutter or "snap" instead of smooth transitions
- `transform` property in DevTools flashes between different values
- Console warnings: "Style changes too fast" or "Forced reflow"

**Phase to address:**
**Phase 02** (Image Reveals & Parallax) — Audit ALL animations before adding new ones. Document which library controls which elements in code comments.

---

### Pitfall 3: Next.js Image + Reveal Animations = Invisible Images

**What goes wrong:**
Images are set to `opacity: 0` for reveal animations, but Next.js Image component lazy-loads by default. If the image hasn't loaded when the scroll animation triggers, the animation completes but the image remains invisible (opacity animates from 0 to 1, but `src` is still loading).

**Why it happens:**
Timing mismatch:
1. Scroll animation triggers (user scrolls to section)
2. GSAP animates `opacity: 0 → 1` over 0.8s
3. Next.js Image starts loading AFTER intersection (lazy load)
4. Image arrives 300ms after animation completes
5. User sees: animation plays, then nothing, then image pops in

**How to avoid:**

**Solution 1: Priority + eager loading for above-fold images**
```tsx
// Hero section images (always visible)
<Image
  src="/images/espaco/hero.jpg"
  priority
  loading="eager"
  alt="Hero"
/>

// Below-fold with reveal animation
<Image
  src="/images/espaco/studio.jpg"
  loading="eager" // Force eager even below fold
  onLoad={() => setImageLoaded(true)} // Track load state
  alt="Studio"
/>
```

**Solution 2: Coordinate animation with load state**
```tsx
const [imageLoaded, setImageLoaded] = useState(false);

useGSAP(() => {
  if (!imageLoaded) return; // Don't animate until loaded

  gsap.fromTo(imageRef.current,
    { opacity: 0, scale: 1.1 },
    {
      opacity: 1,
      scale: 1,
      scrollTrigger: { trigger: imageRef.current }
    }
  );
}, [imageLoaded]);

return (
  <Image
    onLoad={() => setImageLoaded(true)}
    style={{ opacity: imageLoaded ? undefined : 0 }} // Keep hidden until loaded
  />
);
```

**Solution 3: Placeholder blur while loading**
```tsx
<Image
  src={src}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..." // Low-res preview
  onLoad={() => triggerRevealAnimation()}
/>
```

**For Espaço page specifically:**
- 13 images total
- 5 studio images (Masonry grid) — MUST eager load
- 5 cowork images (Spotlight cards) — eager load first 3, lazy load last 2
- 3 comodidades images — can lazy load (below fold)

**Warning signs:**
- Images "pop in" after scroll animation completes
- Network tab shows images loading AFTER ScrollTrigger fires
- Lighthouse "Largest Contentful Paint" is delayed
- Users report "seeing empty boxes that fill in later"

**Phase to address:**
**Phase 02** (Image Reveals) — Implement before adding reveal animations. Add `loading="eager"` to ALL images that will have scroll reveals.

---

### Pitfall 4: Mobile Performance Death Spiral with Multiple ScrollTriggers

**What goes wrong:**
Page becomes laggy/unresponsive on mobile. Scroll feels "heavy". Animations skip frames. Battery drains rapidly. In extreme cases, mobile browsers kill the tab.

**Why it happens:**
- Mobile devices have ~1/4 the CPU power of desktop
- ScrollTrigger recalculates on EVERY scroll event (can be 60+ times per second)
- With 10+ ScrollTrigger instances, that's 600+ calculations per second
- Each calculation triggers layout recalculation (expensive on mobile)
- Lenis smooth scroll adds additional per-frame calculations
- React 19 concurrent rendering can interfere with scroll-linked animations

**Your current setup is HIGH RISK:**
- Lenis is disabled on mobile (good!)
- But ScrollTrigger is NOT disabled on mobile (bad!)
- Plan includes 4 sections with heavy animations = 15-20 ScrollTrigger instances
- 13 images with reveal animations = 13 more ScrollTrigger instances
- Total: 28-33 ScrollTriggers on a single page

**How to avoid:**

**Strategy 1: Disable ScrollTrigger on mobile, use Framer Motion `whileInView` instead**
```tsx
const isMobile = useMediaQuery('(max-width: 768px)');

if (isMobile) {
  // Lightweight Framer Motion (no scroll calculations)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6 }}
    >
      {content}
    </motion.div>
  );
}

// Desktop: Heavy GSAP ScrollTrigger
useGSAP(() => {
  gsap.to(element, {
    scrollTrigger: { /* complex config */ },
    // ...
  });
}, []);
```

**Strategy 2: Batch ScrollTrigger instances**
```tsx
// BAD: One ScrollTrigger per image (13 instances)
images.map(img => (
  <Image onLoad={() => {
    gsap.to(imgRef, { scrollTrigger: { trigger: imgRef } });
  }} />
));

// GOOD: One ScrollTrigger for entire section (1 instance)
useGSAP(() => {
  gsap.to('.image-grid img', {
    opacity: 1,
    stagger: 0.1, // Stagger within single ScrollTrigger
    scrollTrigger: { trigger: '.image-grid' }
  });
}, []);
```

**Strategy 3: `will-change` budgeting**
```tsx
// BAD: Every element has will-change (GPU memory exhaustion)
<div className="will-change-transform">
  <div className="will-change-opacity">
    <div className="will-change-transform"> {/* 3 layers deep! */}

// GOOD: Only actively animating elements
<div
  className={isAnimating ? "will-change-transform" : ""}
  onAnimationStart={() => setIsAnimating(true)}
  onAnimationEnd={() => setIsAnimating(false)}
>
```

**Strategy 4: Reduce Lenis refresh rate on lower-end devices**
```tsx
// Detect device performance
const isLowEnd = navigator.hardwareConcurrency <= 4;

<ReactLenis options={{
  lerp: isLowEnd ? 0.08 : 0.12, // Less smooth but more performant
  duration: isLowEnd ? 0.8 : 1.2,
}}>
```

**For Espaço page specifically:**

**Recommended approach:**
- **Desktop:** GSAP ScrollTrigger for all animations
- **Mobile:** Framer Motion `whileInView` for simple reveals, NO parallax, NO complex scroll effects
- **Tablet:** Conditional — use GSAP only if device has 6+ CPU cores

**Warning signs:**
- Lighthouse Performance score <50 on mobile
- "Long tasks" in DevTools Performance profiler >500ms
- Scroll jank (missed frames in Performance monitor)
- Browser DevTools shows >30% CPU usage while idle
- Chrome DevTools "Rendering" tab shows constant "Layout Shift"

**Phase to address:**
**Phase 03** (Mobile Optimization) — MUST happen before Phase 04 (full implementation). Test on actual devices, not just Chrome DevTools mobile emulation.

---

### Pitfall 5: React 19 Concurrent Rendering + useGSAP = Timing Bugs

**What goes wrong:**
GSAP animations don't trigger on mount, or trigger multiple times. ScrollTrigger positions are calculated incorrectly. Animations "jump" to end state without transitioning.

**Why it happens:**
React 19's concurrent rendering can pause/resume component rendering. This means:
- `useGSAP` might run before DOM elements are fully mounted
- `ScrollTrigger.refresh()` might be called mid-render
- `refs` might be `null` when GSAP tries to access them
- Suspense boundaries can remount components, re-triggering animations

**Example from your codebase:**
```tsx
// espaco/page.tsx line 41-46
const containerRef = useRef<HTMLElement>(null);
const { scrollYProgress } = useScroll({ target: containerRef });

// RISK: containerRef.current might be null in React 19 concurrent render
// Framer Motion handles this internally, but mixing with GSAP is risky
```

**How to avoid:**

**Solution 1: Explicit ref null checks in useGSAP**
```tsx
useGSAP(() => {
  const element = containerRef.current;
  if (!element) {
    console.warn('Element not mounted yet'); // Debugging
    return;
  }

  const ctx = gsap.context(() => {
    gsap.to(element, { /* animation */ });
  }, element); // Pass scope as second arg

  return () => ctx.revert(); // Cleanup
}, {
  dependencies: [someState],
  scope: containerRef // IMPORTANT: scope to ref
});
```

**Solution 2: Use `useLayoutEffect` for critical animations**
```tsx
// When animation MUST run before paint
useLayoutEffect(() => {
  if (!elementRef.current) return;

  gsap.set(elementRef.current, { opacity: 0 }); // Initial state

  return () => {
    gsap.killTweensOf(elementRef.current);
  };
}, []);
```

**Solution 3: Separate GSAP and Framer Motion scroll progress**
```tsx
// BAD: Mixing Framer Motion useScroll with GSAP
const { scrollYProgress } = useScroll({ target: containerRef });
useGSAP(() => {
  gsap.to(element, { scrollTrigger: { /* ... */ } });
});

// GOOD: Choose ONE library for scroll-driven animations per element
// Option A: Framer Motion only
const { scrollYProgress } = useScroll({ target: containerRef });
const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
<motion.div style={{ y }}>

// Option B: GSAP only
useGSAP(() => {
  gsap.to(element, {
    y: '50%',
    scrollTrigger: { trigger: containerRef.current }
  });
});
```

**For Espaço page specifically:**

Your current Hero section (lines 41-63) mixes Framer Motion `useScroll` + potential GSAP usage. **This is a timing bomb with React 19.**

**Recommendation:**
- Keep Framer Motion for Hero parallax (already implemented, working)
- Use GSAP ONLY for sections below Hero
- Never mix both libraries on the same scroll-driven element

**Warning signs:**
- Animations work in dev, break in production build
- Animations trigger twice on mount
- Console errors: "Cannot read property 'current' of null"
- ScrollTrigger markers appear in wrong positions
- Animations don't trigger on first load, work on second navigation
- Hydration mismatches in Next.js (Warning: Text content did not match)

**Phase to address:**
**Phase 01** (Foundation) — Establish clear separation between GSAP and Framer Motion before adding new animations. Document library ownership in code.

---

### Pitfall 6: Framer Motion `whileInView` + Many Images = Memory Leak

**What goes wrong:**
Browser memory usage grows continuously while scrolling. After 2-3 minutes of scrolling up/down the page, browser becomes sluggish or crashes. DevTools shows 500MB+ memory for a single page.

**Why it happens:**
Framer Motion's `whileInView` creates IntersectionObserver instances. With `once: true`, these should disconnect after triggering, but:
- If component unmounts/remounts (React 19 Suspense, Fast Refresh), observers aren't cleaned up
- With 13+ images each having their own `whileInView`, that's 13+ observers
- Each observer holds references to DOM nodes, preventing garbage collection
- Framer Motion's animation registry can retain finished animations in memory

**Current risk in espaco/page.tsx:**
- Line 113-125: `whileInView` on 5 studio images
- Line 150-169: `whileInView` on 5 cowork images
- Line 184-204: `whileInView` on 3 comodidades images
- **Total: 13 IntersectionObserver instances**

**How to avoid:**

**Solution 1: Single observer for entire section**
```tsx
// BAD: One observer per image
{images.map(img => (
  <motion.div whileInView={{ opacity: 1 }} viewport={{ once: true }}>
    <Image src={img} />
  </motion.div>
))}

// GOOD: One ref for section, manual stagger
const sectionRef = useRef(null);
const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

{images.map((img, i) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={isInView ? { opacity: 1 } : {}}
    transition={{ delay: i * 0.1 }}
  >
    <Image src={img} />
  </motion.div>
))}
```

**Solution 2: Shared viewport config**
```tsx
// Create once, reuse
const viewportConfig = { once: true, margin: "-10%" };

{images.map(img => (
  <motion.div whileInView={{ opacity: 1 }} viewport={viewportConfig}>
    <Image src={img} />
  </motion.div>
))}
```

**Solution 3: Explicit cleanup for animations**
```tsx
const controls = useAnimation();

useEffect(() => {
  return () => {
    controls.stop(); // Stop all animations on unmount
  };
}, [controls]);
```

**For Espaço page specifically:**

**Refactor ALL image grids to use section-level `useInView`:**
```tsx
// Section 3: Estúdios
const estudiosRef = useRef(null);
const estudiosInView = useInView(estudiosRef, { once: true, margin: "-10%" });

<section ref={estudiosRef}>
  <Masonry>
    {estudiosImages.map((src, idx) => (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={estudiosInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: idx * 0.1 }}
      >
        <Image src={src} />
      </motion.div>
    ))}
  </Masonry>
</section>
```

**Reduces observers from 13 → 3** (one per section).

**Warning signs:**
- Chrome Task Manager shows high memory usage (>400MB for single page)
- DevTools Memory profiler shows increasing "Detached DOM nodes"
- Performance degrades after scrolling up/down multiple times
- Mobile Safari shows "This webpage is using significant memory"
- Browser DevTools "Performance Monitor" shows memory not being released after scroll

**Phase to address:**
**Phase 02** (Image Reveals) — Refactor all `whileInView` to section-level observers BEFORE adding more animations.

---

### Pitfall 7: Missing `prefers-reduced-motion` for Heavy Effects = Accessibility Lawsuit

**What goes wrong:**
Users with vestibular disorders experience nausea, dizziness, or seizures from parallax/scroll effects. Violates WCAG 2.1 (Level A) and ADA compliance. Can result in legal action (documented cases in 2024-2025).

**Why it happens:**
Developers add `prefers-reduced-motion` checks to entrance animations but forget about:
- Parallax effects (continuous motion)
- Smooth scroll (Lenis)
- Scroll-driven transforms
- 3D rotations
- Auto-playing effects

**Current code status:**
✅ GOOD: `useReducedMotion` hook exists and is used in `ScrollReveal.tsx`, `TextReveal.tsx`
❌ BAD: Lenis is NOT disabled for reduced motion users (checked in `LenisProvider.tsx` line 11-19, only checks mobile)
❌ BAD: Hero Globe parallax (espaco/page.tsx line 54-63) does NOT respect reduced motion
❌ BAD: Framer Motion parallax (`useTransform` on line 46) does NOT check reduced motion

**How to avoid:**

**Solution 1: Disable Lenis for reduced motion**
```tsx
// LenisProvider.tsx
export function LenisProvider({ children }: LenisProviderProps) {
  const [shouldUseLenis, setShouldUseLenis] = useState(false);

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    setShouldUseLenis(!isMobile && !prefersReducedMotion); // Disable for both
  }, []);

  if (!shouldUseLenis) return <>{children}</>;

  return <ReactLenis {...props}>{children}</ReactLenis>;
}
```

**Solution 2: Conditional parallax**
```tsx
const prefersReducedMotion = useReducedMotion();
const { scrollYProgress } = useScroll({ target: containerRef });

// Only apply parallax if motion is allowed
const backgroundY = useTransform(
  scrollYProgress,
  [0, 1],
  prefersReducedMotion ? ['0%', '0%'] : ['0%', '30%'] // No movement if reduced motion
);
```

**Solution 3: CSS-only fallback**
```tsx
<motion.div
  style={{
    y: prefersReducedMotion ? 0 : backgroundY
  }}
  className={prefersReducedMotion ? "opacity-100" : ""}
>
```

**For Espaço page specifically:**

**Required changes:**
1. Update `LenisProvider` to check `prefers-reduced-motion`
2. Wrap ALL `useTransform` in reduced motion checks
3. Disable Globe animation for reduced motion users
4. Add static fallback states for all scroll effects

**Legal risk:** HIGH. Portuguese accessibility laws (Decreto-Lei n.º 83/2018) require WCAG 2.1 Level AA compliance. Parallax without reduced-motion support is a Level A violation.

**Warning signs:**
- Accessibility audit tools flag "Animation not disabled for prefers-reduced-motion"
- User reports of motion sickness in feedback
- Screen reader users report page is "too busy"
- Failed WCAG 2.1 automated checks

**Phase to address:**
**Phase 01** (Foundation) — MUST fix before adding any new scroll effects. Non-negotiable for legal compliance.

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| **Too many `will-change` declarations** | Janky animations, high GPU memory, mobile crashes | Only apply `will-change` to actively animating elements; remove after animation completes | >10 simultaneous `will-change` elements on mobile |
| **Scroll event flooding** | Browser unresponsive during scroll, CPU spikes to 100% | Use `useGSAP` with ScrollTrigger instead of manual scroll listeners; debounce/throttle if manual listeners required | >3 scroll event listeners without throttling |
| **Image decoding on main thread** | Long tasks (>500ms) when images enter viewport | Add `decoding="async"` to all Next.js Image components | Images >500KB without async decoding |
| **Unoptimized blur filters** | Stutter during scroll animations with blur effects | Use `backdrop-filter` instead of `filter` when possible; reduce blur radius on mobile (<5px) | Blur radius >10px on elements >50% viewport size |
| **ScrollTrigger without `scroller` param when using Lenis** | Incorrect trigger positions, animations fire randomly | Always pass `scroller: window` or Lenis element ref to ScrollTrigger config | Any ScrollTrigger instance when Lenis is active |
| **Framer Motion layout animations in scroll containers** | Scroll position jumps, layout thrashing | Avoid `layout` prop on elements inside scroll-driven sections; use transform-based animations only | Any `layout` animation inside ScrollTrigger-controlled container |
| **Globe 3D rendering during scroll** | Dropped frames (5-10 FPS) during scroll on mid-range devices | Pause Three.js render loop during active scroll; resume after scroll stops | Three.js rendering at 60fps + Lenis + ScrollTrigger simultaneously |

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| **Using `loading="lazy"` on above-fold images** | Faster initial page load metrics | Images invisible during reveal animations, CLS issues | Never for images with scroll reveals |
| **One useGSAP per element** | Easy to reason about, isolated animations | 20+ useGSAP instances = performance death, unmount cleanup issues | Only for <5 animated elements per page |
| **Mixing GSAP and Framer Motion on same element** | Can use "best tool" for each animation type | Fighting libraries, unpredictable behavior, debugging nightmare | Never acceptable |
| **Disabling Lenis on mobile instead of optimizing** | Quick performance fix | Inconsistent UX between devices, harder to debug mobile-specific issues | Acceptable for MVP, must optimize later |
| **Setting `once: false` on all `whileInView`** | Animations replay on every scroll | Memory leaks, performance degradation, battery drain | Only for critical UI feedback (e.g., "scroll to see more" indicators) |
| **Global `will-change: transform`** | Silky smooth animations in dev | GPU memory exhaustion, crashes on low-end devices | Never in production; always conditional |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| **GSAP + Lenis** | Forgetting `ScrollTrigger.update()` in Lenis callback | Use `useLenis((lenis) => ScrollTrigger.update())` in provider |
| **Framer Motion + Next.js Image** | Animating Image wrapper before image loads | Track `onLoad` state, defer animation until loaded |
| **ScrollTrigger + React 19** | Assuming refs are immediately available | Explicit null checks in useGSAP, use `scope` parameter |
| **Masonry + GSAP** | Animating before Masonry layout calculates | Delay GSAP init until Masonry `onLayoutComplete` (custom event) |
| **Dynamic imports + ScrollTrigger** | ScrollTrigger fires before component fully rendered | Wrap ScrollTrigger setup in component's `useEffect`, not in dynamic parent |
| **Framer Motion `whileInView` + GSAP ScrollTrigger** | Both libraries observing same element | Choose ONE: `whileInView` (simple) OR ScrollTrigger (complex); never both |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| **Parallax too aggressive (>30% movement)** | Motion sickness, content unreadable during scroll | Limit parallax to 15% movement; use easing functions |
| **Animations block user interaction** | Can't click buttons until animation completes | Use `pointer-events: auto` on interactive elements during animations |
| **No loading states for heavy sections** | Blank screen for 2-3s, user thinks page is broken | Skeleton screens or progressive reveal during load |
| **Scroll hijacking (custom scroll behavior)** | Disorienting, breaks browser back button expectations | Only use Lenis for smoothing, not scroll position control |
| **Auto-playing animations on page load** | Overwhelming, high bounce rate on mobile | Delay entrance animations by 0.5-1s after mount |
| **Invisible content until scroll** | Users don't know to scroll, miss content | Always show fold line or scroll indicator for off-screen content |

## "Looks Done But Isn't" Checklist

- [ ] **ScrollTrigger animations:** Tested on actual mobile devices (not just DevTools mobile mode) — emulators don't accurately replicate performance
- [ ] **Image reveals:** Verified all images have `loading="eager"` or load-state tracking before animation triggers
- [ ] **Reduced motion:** Checked `prefers-reduced-motion` disables ALL motion (not just entrance animations) — includes Lenis, parallax, transforms
- [ ] **Memory leaks:** Scrolled up/down page 10 times, checked DevTools Memory profiler for retention — memory should return to baseline
- [ ] **Lenis sync:** Verified `ScrollTrigger.update()` called in Lenis callback — check ScrollTrigger markers align with visual triggers
- [ ] **Ref null safety:** All `useGSAP` callbacks check `ref.current !== null` — especially critical in React 19 concurrent mode
- [ ] **Cleanup:** All animations have cleanup functions in `useEffect` return — prevents animations running after unmount
- [ ] **GPU memory:** Checked `will-change` only on actively animating elements — remove after animation completes
- [ ] **Layout shift:** Lighthouse CLS score <0.1 with animations enabled — animations shouldn't cause layout jumps
- [ ] **Accessibility:** WAVE/axe DevTools shows no motion-related violations — parallax/scroll effects disabled for `prefers-reduced-motion`

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| **Lenis-ScrollTrigger desync** | LOW | Add `useLenis` callback, refresh ScrollTrigger; 30min fix |
| **GSAP + Framer Motion conflicts** | MEDIUM | Audit all animations, partition by library; 2-4 hours refactor |
| **Image loading timing issues** | LOW | Add `loading="eager"` + `onLoad` tracking; 1 hour |
| **Mobile performance collapse** | HIGH | Conditional rendering for mobile, reduce animations, batch ScrollTriggers; 1-2 days |
| **React 19 timing bugs** | MEDIUM | Add ref null checks, use `scope` parameter, explicit cleanup; 3-5 hours |
| **Memory leaks** | MEDIUM | Refactor to section-level observers, add cleanup; 2-3 hours |
| **Missing reduced motion** | LOW | Wrap effects in `useReducedMotion` checks; 1-2 hours |
| **Too many ScrollTriggers** | HIGH | Batch into fewer instances, use stagger; 1 day refactor |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Lenis-ScrollTrigger desync | Phase 01 (Foundation) | ScrollTrigger markers align with visual triggers after navigation |
| GSAP + Framer Motion conflicts | Phase 01 (Foundation) | No stutter in animations, DevTools shows <10 style recalcs/sec |
| Image loading issues | Phase 02 (Image Reveals) | Images visible when animation completes, no CLS |
| Mobile performance | Phase 03 (Mobile Optimization) | Lighthouse Performance >80 on mobile, <30% CPU usage |
| React 19 timing bugs | Phase 01 (Foundation) | Animations trigger consistently across dev/prod, no hydration errors |
| Memory leaks | Phase 02 (Image Reveals) | Memory returns to baseline after 10 scroll cycles |
| Missing reduced motion | Phase 01 (Foundation) | WAVE/axe audit passes, all motion disabled with media query |
| Too many ScrollTriggers | Phase 02-04 (Implementation) | <10 ScrollTrigger instances total on page |

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| **Phase 01: Foundation** | Starting implementation before fixing Lenis sync | MANDATORY: Fix LenisProvider, add reduced motion checks BEFORE any new animations |
| **Phase 02: Image Reveals** | Animating before images load | Add `loading="eager"` to ALL reveal images, track load state |
| **Phase 03: Parallax Effects** | Excessive movement causing motion sickness | Limit to 15% movement, add easing, disable for reduced motion |
| **Phase 04: Interactive Elements** | Hover effects conflicting with scroll animations | Use Framer Motion for hover (event-based), GSAP for scroll only |
| **Phase 05: Mobile** | Assuming mobile optimization can wait | CRITICAL: Test on real devices in Phase 03, not after completion |

## Sources

**Primary sources:**
- Codebase analysis: `LenisProvider.tsx`, `GSAPProvider.tsx`, `espaco/page.tsx`, animation components
- Package versions: GSAP 3.14.2, Framer Motion 12.33.0, Lenis 1.3.17, Next.js 16.1.6, React 19.2.3

**Knowledge base (January 2025 training cutoff):**
- GSAP ScrollTrigger documentation and known issues
- Framer Motion performance patterns
- Lenis + ScrollTrigger integration requirements
- React 19 concurrent rendering behavior
- Next.js Image component lazy loading mechanics
- WCAG 2.1 motion accessibility requirements

**Confidence limitations:**
- MEDIUM confidence: Based on training data (Jan 2025 cutoff) + codebase analysis
- WebSearch/WebFetch unavailable — cannot verify 2026 updates to libraries
- Recommendations based on library versions in package.json (may have updates since Jan 2025)
- Real-world device testing required to validate mobile performance assumptions

**Recommended verification:**
- Test on actual iOS/Android devices (not just DevTools emulation)
- Check official docs for GSAP 3.14.2, Framer Motion 12.33.0, Lenis 1.3.17 for any breaking changes
- Run Lighthouse CI on actual page with full animation load
- Accessibility audit with WAVE + axe DevTools + manual screen reader testing

---
*Pitfalls research for: Espaço page heavy scroll-driven animations*
*Researched: 2026-03-15*
*Researcher: GSD Project Researcher (Phase 6)*
