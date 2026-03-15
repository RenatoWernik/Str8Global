# Animation Library Guide: GSAP vs Framer Motion

**Last Updated:** 2026-03-15 (Phase 9: Foundation)
**Applies to:** Str8Global Espaço page redesign (v1.3)

---

## Core Principle: Library-Per-Animation-Type Separation

**Never** animate the same CSS property with both libraries on the same element.
**Never** use both libraries in the same component unless clearly partitioned (e.g., GSAP on parent, Framer Motion on children).

---

## When to Use GSAP

**Use GSAP for:**
- ✅ Scroll-driven animations (parallax, reveals during scroll)
- ✅ Complex timelines with multiple steps
- ✅ SVG morphing or path animations
- ✅ Fine-grained control over easing and timing
- ✅ Animations that need to scrub (tied to scroll position)

**GSAP Pattern:**
```tsx
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function MyScrollComponent() {
  const containerRef = useRef<HTMLDivElement>(null);

  // React 19 safety: Explicit null check + scope parameter
  useGSAP(() => {
    const element = containerRef.current;
    if (!element) return; // CRITICAL: Always check ref before using

    const ctx = gsap.context(() => {
      gsap.to(element, {
        opacity: 1,
        y: 0,
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          end: 'top 50%',
          scrub: true,
        },
      });
    }, element);

    return () => ctx.revert(); // Cleanup
  }, {
    dependencies: [someProp],
    scope: containerRef // React 19: Scope animations to ref
  });

  return <div ref={containerRef}>Content</div>;
}
```

**Examples in codebase:**
- `ScrollReveal.tsx` — Scroll-triggered reveals with rotationX
- Future: Parallax layers, image clip-path reveals

---

## When to Use Framer Motion

**Use Framer Motion for:**
- ✅ Entrance animations (mount/unmount)
- ✅ Hover and gesture interactions
- ✅ Viewport reveals (once per scroll)
- ✅ Layout animations (shared element transitions)
- ✅ Spring physics animations

**Framer Motion Pattern:**
```tsx
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export function MyEntranceComponent() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: 'spring', stiffness: 100, damping: 12 }}
    >
      Content
    </motion.div>
  );
}
```

**Examples in codebase:**
- `TextReveal.tsx` — Word-level stagger on viewport entry
- `ScrollFloat.tsx` — Simple entrance reveal with spring
- `CapabilitiesOrbit.tsx` — Entrance animations for labels

---

## When to Use requestAnimationFrame

**Use RAF for:**
- ✅ Continuous animations (rotation, floating)
- ✅ High-performance animations (60fps requirement)
- ✅ Direct DOM manipulation without React re-renders

**RAF Pattern:**
```tsx
import { useRef, useEffect } from 'react';

export function ContinuousRotation() {
  const elementRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef(0);

  useEffect(() => {
    let animId: number;

    const tick = () => {
      rotationRef.current += 0.5;
      if (elementRef.current) {
        elementRef.current.style.transform = `rotate(${rotationRef.current}deg)`;
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  return <div ref={elementRef}>Content</div>;
}
```

**Examples in codebase:**
- `CapabilitiesOrbit.tsx` — Continuous orbital rotation (lines 56-98)

---

## Common Mistakes to Avoid

### ❌ MISTAKE 1: Both libraries animate the same property
```tsx
// BAD: GSAP and Framer Motion both animate 'y'
<motion.div ref={gsapRef} animate={{ y: 0 }}>
  {/* useGSAP also animates y on this element = CONFLICT */}
</motion.div>
```

**Why it breaks:** Both libraries mutate inline styles. One overwrites the other → janky animations.

**Fix:** Partition properties OR use one library per element.

---

### ❌ MISTAKE 2: Missing ref null checks in useGSAP
```tsx
// BAD: No null check (crashes in React 19 concurrent mode)
useGSAP(() => {
  gsap.to(containerRef.current, { opacity: 1 });
});
```

**Why it breaks:** React 19 can pause rendering. `ref.current` might be `null` when useGSAP runs.

**Fix:**
```tsx
useGSAP(() => {
  const element = containerRef.current;
  if (!element) return; // CRITICAL
  gsap.to(element, { opacity: 1 });
}, { scope: containerRef });
```

---

### ❌ MISTAKE 3: Using GSAP for simple entrance animations
```tsx
// BAD: GSAP overkill for a simple fade-in
useGSAP(() => {
  gsap.to(element, { opacity: 1, duration: 0.5 });
});
```

**Why it's bad:** GSAP adds bundle size + complexity for no benefit.

**Fix:** Use Framer Motion `whileInView`:
```tsx
<motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} />
```

---

## Decision Tree

```
Does the animation need to scrub with scroll position?
├─ YES → Use GSAP ScrollTrigger with scrub: true
└─ NO
   ├─ Is it a continuous animation (rotation, floating)?
   │  └─ YES → Use requestAnimationFrame (best performance)
   └─ NO
      ├─ Is it a complex timeline (multiple steps, precise timing)?
      │  └─ YES → Use GSAP timeline
      └─ NO
         └─ Use Framer Motion (entrance, hover, gestures)
```

---

## React 19 Concurrent Mode Safety Checklist

All GSAP animations MUST follow this pattern:

```tsx
useGSAP(() => {
  const element = containerRef.current;
  if (!element) return; // ✅ Null check

  const ctx = gsap.context(() => {
    gsap.to(element, { /* animation */ });
  }, element); // ✅ Scope to element

  return () => ctx.revert(); // ✅ Cleanup
}, {
  dependencies: [props],
  scope: containerRef // ✅ Scope parameter
});
```

**Why these patterns matter:**
- **Null check:** Prevents crashes when component remounts
- **gsap.context:** Isolates animations to specific DOM scope
- **scope parameter:** Tells useGSAP to wait for ref to be available
- **Cleanup:** Prevents memory leaks and animation conflicts

---

## Performance Budget

| Animation Type | Max Per Page | Library |
|----------------|--------------|---------|
| ScrollTrigger instances | 10 | GSAP |
| whileInView instances | 20 | Framer Motion |
| Continuous animations | 3 | RAF |
| Parallax layers | 3 | GSAP or Framer |

**Mobile:** Reduce all limits by 50%. Use Framer Motion `whileInView` instead of GSAP ScrollTrigger on mobile.

---

## Accessibility Requirements

All animations MUST respect `prefers-reduced-motion`:

**GSAP:**
```tsx
const prefersReducedMotion = useReducedMotion();

useGSAP(() => {
  if (prefersReducedMotion) return; // Skip all GSAP animations
  // ... animation code
}, [prefersReducedMotion]);
```

**Framer Motion:**
```tsx
const prefersReducedMotion = useReducedMotion();

if (prefersReducedMotion) {
  return <div>{children}</div>; // No animation wrapper
}

return <motion.div animate={...}>{children}</motion.div>;
```

**Legal requirement:** Portuguese law (Decreto-Lei n.º 83/2018) requires WCAG 2.1 Level A compliance. Motion must be optional.

---

## Resources

- **GSAP Docs:** https://greensock.com/docs/
- **Framer Motion Docs:** https://www.framer.com/motion/
- **Pitfalls Research:** `.planning/research/PITFALLS.md`
- **React 19 + GSAP:** https://greensock.com/react-advanced/

---

*Guide created: Phase 9 (Foundation & Pitfall Prevention)*
*Addresses: INFRA-04 requirement*
