# Architecture Research

**Domain:** Creative Page Redesign Integration (Espaço Page)
**Researched:** 2026-03-15
**Confidence:** HIGH

## Executive Summary

The Espaço page redesign requires integrating new creative sections with existing scroll-driven animations while maintaining performance. The current architecture uses a **hybrid animation approach** (GSAP ScrollTrigger for complex effects, Framer Motion for component-level animations) coordinated through global providers. The recommended pattern is **separate section component files** with **lazy-loading for heavy animations**, following the existing pattern in `page.tsx` (homepage).

Critical architectural decision: **GSAP for scroll-driven storytelling across sections, Framer Motion for viewport-triggered reveals within sections**. This separation prevents conflicts and maintains performance.

## Current Architecture Analysis

### Espaço Page Structure (BEFORE Redesign)

```
src/app/espaco/page.tsx (single file, ~220 lines)
├── Hero Section (Globe 3D + parallax) — KEEP INTACT
│   ├── Dynamic import: Globe (Three.js)
│   ├── Framer Motion: parallax effect (useScroll + useTransform)
│   └── Initial animations: fade-in title
├── Manifesto Section (BlurText) — REDESIGN TARGET
│   └── BlurText component: staggered word reveal
├── Studios Section (Masonry) — REDESIGN TARGET
│   └── Framer Motion: whileInView stagger
├── Cowork Section (SpotlightCards) — REDESIGN TARGET
│   └── Framer Motion: whileInView + hover effects
├── Amenities Section (Hover Cards) — REDESIGN TARGET
│   └── Framer Motion: hover + reveal animations
└── CTA Section — KEEP INTACT
```

**Current limitations:**
- All sections inline in single `page.tsx` file (220 lines)
- No scroll-driven storytelling coordination across sections
- Each section animates independently via Framer Motion `whileInView`
- No performance budget for 4 concurrent creative effects

### Global Animation Infrastructure

```
RootLayout (app/layout.tsx)
├── LenisProvider (smooth scroll, desktop-only)
│   └── lerp: 0.12, duration: 1.2s
│   └── Disabled on mobile (isMobile check)
├── GSAPProvider (GSAP registration + cleanup)
│   └── Registers ScrollTrigger + useGSAP
│   └── Debounced refresh on resize (200ms)
│   └── Kills all on unmount + prefers-reduced-motion
└── Page Components
    └── Can use both GSAP and Framer Motion
```

**Key finding:** Both animation systems are globally available. The **coexistence pattern** is already proven:
- **GSAP**: Complex scroll-driven effects (HorizontalGallery, CapabilitiesOrbit orbital rotation)
- **Framer Motion**: Component-level animations (whileInView, hover, initial/animate)

## Recommended Architecture for Redesign

### Proposed Page Structure (AFTER Redesign)

```
src/app/espaco/page.tsx (~100 lines)
├── Hero Section — UNCHANGED
│   └── Dynamic import: Globe
├── Dynamic import: ManifestoSection (NEW)
│   └── Creative scroll-driven effect
├── Dynamic import: StudiosSection (NEW)
│   └── Creative scroll-driven effect
├── Dynamic import: CoworkSection (NEW)
│   └── Creative scroll-driven effect
├── Dynamic import: AmenitiesSection (NEW)
│   └── Creative scroll-driven effect
└── CTA Section — UNCHANGED
```

```
src/components/sections/espaco/
├── ManifestoSection.tsx       # Replaces inline Manifesto
├── StudiosSection.tsx         # Replaces inline Studios
├── CoworkSection.tsx          # Replaces inline Cowork
└── AmenitiesSection.tsx       # Replaces inline Amenities
```

### Rationale for Separate Component Files

| Factor | Single File | Separate Components | Recommendation |
|--------|-------------|---------------------|----------------|
| **Maintainability** | 220 lines → 500+ lines with effects | ~100 lines each (self-contained) | ✅ Separate |
| **Lazy loading** | Cannot lazy-load sections independently | Can lazy-load each heavy section | ✅ Separate |
| **Code splitting** | Single bundle chunk | 4 separate chunks (better performance) | ✅ Separate |
| **Parallel development** | Conflicts on single file | Independent work per section | ✅ Separate |
| **Reusability** | Hard to extract later | Reusable on other pages if needed | ✅ Separate |

**Existing evidence:** Homepage (`src/app/page.tsx`) uses this pattern successfully — 30 lines total, all sections dynamically imported.

## Architectural Patterns

### Pattern 1: GSAP + Framer Motion Coexistence

**What:** Use GSAP for scroll-driven effects across sections, Framer Motion for component-level animations within sections.

**When to use:**
- GSAP: Multi-section scroll progress, horizontal scrolling, complex timelines, parallax depth layers
- Framer Motion: Viewport reveals, hover states, entrance animations, simple spring physics

**Trade-offs:**
- ✅ Pro: Each library excels at its specialty
- ✅ Pro: Proven pattern in existing codebase (HorizontalGallery, CapabilitiesOrbit)
- ⚠️ Con: Two animation libraries in bundle (~100KB combined, acceptable for premium site)
- ⚠️ Con: Must understand which to use when (clear guidelines below)

**Example from HorizontalGallery.tsx:**
```typescript
'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function HorizontalGallery() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Framer Motion: Scroll-linked horizontal transform
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollDistance]);

  return (
    <section ref={containerRef} className="h-[200vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div style={{ x }} className="flex">
          {items.map((item, i) => (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {item}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
```

**When to use GSAP instead:**
- Complex timelines with multiple scroll-linked properties
- Direct DOM manipulation for performance (bypassing React renders)
- Orbital/circular motion (CapabilitiesOrbit example: direct `setAttribute` on SVG nodes)

### Pattern 2: Dynamic Import for Heavy Animations

**What:** Lazy-load section components with creative effects to defer JavaScript execution until needed.

**When to use:**
- Sections below the fold
- Sections with heavy animation libraries or effects
- Sections with 3D elements (Three.js)

**Trade-offs:**
- ✅ Pro: Faster initial page load (defers 50-100KB per section)
- ✅ Pro: Sections load as user scrolls (better Time to Interactive)
- ⚠️ Con: Slight delay on first appearance (acceptable with `loading` fallback)

**Example from existing page.tsx:**
```typescript
// Homepage pattern — proven at scale
import dynamic from 'next/dynamic';
import { Hero } from '@/components/sections'; // Above fold: eager load

const Services = dynamic(() => import('@/components/sections/Services'), { ssr: false });
const HorizontalGallery = dynamic(() => import('@/components/sections/HorizontalGallery'), { ssr: false });

export default function Home() {
  return (
    <main>
      <Hero /> {/* Eager: visible immediately */}
      <Services /> {/* Lazy: loads when scrolling down */}
      <HorizontalGallery /> {/* Lazy: loads when approaching */}
    </main>
  );
}
```

**Apply to Espaço page:**
```typescript
// src/app/espaco/page.tsx
'use client';
import dynamic from 'next/dynamic';
import { CTASection } from '@/components/sections/CTASection';

const ManifestoSection = dynamic(() => import('@/components/sections/espaco/ManifestoSection'), { ssr: false });
const StudiosSection = dynamic(() => import('@/components/sections/espaco/StudiosSection'), { ssr: false });
const CoworkSection = dynamic(() => import('@/components/sections/espaco/CoworkSection'), { ssr: false });
const AmenitiesSection = dynamic(() => import('@/components/sections/espaco/AmenitiesSection'), { ssr: false });

export default function EspacoPage() {
  return (
    <main>
      {/* Hero stays inline (or extract if redesigning) */}
      <section>...</section>
      <ManifestoSection />
      <StudiosSection />
      <CoworkSection />
      <AmenitiesSection />
      <CTASection />
    </main>
  );
}
```

**Loading placeholder:** Not needed for sections (content loads fast, no jarring layout shift).

### Pattern 3: Per-Section Scroll Triggers (Loose Coupling)

**What:** Each section manages its own scroll effects independently using per-section scroll refs.

**When to use:**
- When effects are section-specific (fade in, parallax within bounds)
- When sections need to be reorderable without breaking animations

**Trade-offs:**
- ✅ Pro: Sections are independent (can reorder, remove, or reuse)
- ✅ Pro: Easier to test in isolation
- ⚠️ Con: Cannot create effects that span multiple sections (acceptable trade-off)

**Recommended approach for Espaço:**
```typescript
// src/components/sections/espaco/ManifestoSection.tsx
'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export function ManifestoSection() {
  const sectionRef = useRef<HTMLElement>(null);

  // This section's scroll progress (0 = entering viewport, 1 = exiting)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.section ref={sectionRef} style={{ opacity }}>
      {/* Section content */}
    </motion.section>
  );
}
```

**Avoid shared scroll context** unless effects truly need cross-section coordination (adds complexity).

### Pattern 4: Performance Budget for Multiple Scroll Effects

**What:** Limit concurrent scroll-driven effects to maintain 60fps on mid-range devices.

**Budget for 4 creative sections:**
- **Max 4 concurrent `useScroll` hooks** (1 per section)
- **Max 2 transform properties per hook** (e.g., `opacity + y` OR `scale + rotate`, not all 4)
- **Avoid layout thrashing:** Use `transform` and `opacity` only (GPU-accelerated, no reflow)
- **Use `will-change` sparingly:** Only on actively animating elements

**Optimization checklist:**
- Use `useReducedMotion` hook to disable animations when `prefers-reduced-motion: reduce`
- Debounce scroll listeners (GSAPProvider already does this at 200ms for `resize`)
- Memoize heavy calculations with `useMemo`
- Use `viewport={{ once: true }}` for entrance animations (don't re-trigger on scroll back)

## Component Responsibilities

| Component | Responsibility | Data Sources | Animation Library |
|-----------|----------------|--------------|-------------------|
| **HeroSection** | Globe 3D + title + parallax | Static copy | Framer Motion (parallax) |
| **ManifestoSection** | Scroll-driven text reveal | Static manifesto text | GSAP or Framer Motion |
| **StudiosSection** | Image grid with creative layout | `estudiosImages` array | Framer Motion (reveals) |
| **CoworkSection** | Interactive cards with effects | `coworkImages` array | Framer Motion (hover + reveals) |
| **AmenitiesSection** | Hover-activated content | `comodidadesImages` array | Framer Motion (hover) |
| **CTASection** | Standard CTA (reused) | `ctaCopy.espaco` | Framer Motion (entrance) |

### Shared UI Components (Reused)

| Component | Purpose | Current Usage | Decision |
|-----------|---------|---------------|----------|
| `Masonry.tsx` | CSS-based masonry grid | Studios section | Keep if masonry layout still needed |
| `SpotlightCard.tsx` | Mouse-tracking spotlight effect | Cowork section | Keep if spotlight effect still needed |
| `BlurText.tsx` | Staggered word-by-word blur reveal | Manifesto section | Keep if word reveal still needed |

**Decision:** Keep these if the redesign still needs them. Replace if creative direction changes.

## Data Flow

### Scroll-Driven Animation Flow

```
User Scrolls
    ↓
Lenis (smooth scroll, desktop only)
    ↓
GSAP ScrollTrigger.refresh() (debounced 200ms)
    ↓
Framer Motion useScroll hooks (per section)
    ↓
useTransform calculations (opacity, y, scale, etc.)
    ↓
DOM updates (GPU-accelerated transforms)
    ↓
Browser repaint (60fps target)
```

### Component Initialization Flow

```
Page Load
    ↓
RootLayout providers initialized (Lenis, GSAP)
    ↓
HeroSection renders (eager, above fold)
    ↓
User scrolls down
    ↓
Dynamic imports trigger (ManifestoSection, StudiosSection, etc.)
    ↓
Section components mount
    ↓
useScroll hooks initialize (per section)
    ↓
Animations start on scroll
```

### State Management

**Current state:** None. All sections are stateless (data is static arrays/copy).

**Future consideration:** If adding interactivity (e.g., filter studios by type), use local `useState` in section component. No global state needed.

## Integration Points

### New Components vs Modified Components

| File | Status | Action | Notes |
|------|--------|--------|-------|
| `src/app/espaco/page.tsx` | **MODIFY** | Extract sections to separate files, add dynamic imports | Existing Hero + CTA stay inline |
| `src/components/sections/espaco/ManifestoSection.tsx` | **NEW** | Creative redesign of Manifesto | Replaces inline section |
| `src/components/sections/espaco/StudiosSection.tsx` | **NEW** | Creative redesign of Studios | Replaces inline section |
| `src/components/sections/espaco/CoworkSection.tsx` | **NEW** | Creative redesign of Cowork | Replaces inline section |
| `src/components/sections/espaco/AmenitiesSection.tsx` | **NEW** | Creative redesign of Amenities | Replaces inline section |
| `src/components/ui/Masonry.tsx` | **KEEP** | Reuse if masonry layout still needed | No changes |
| `src/components/ui/SpotlightCard.tsx` | **KEEP** | Reuse if spotlight effect still needed | No changes |
| `src/components/animations/BlurText.tsx` | **KEEP** | Reuse if word reveal still needed | No changes |
| `src/data/espacoData.ts` | **NEW** | Extract image arrays from page.tsx | Static data centralization |

**Build order (respecting dependencies):**
1. **First:** Create `src/data/espacoData.ts` (extract data from page.tsx)
2. **Second:** Create section component files (empty shells with static content)
3. **Third:** Add scroll-driven effects to each section independently
4. **Fourth:** Integrate into page.tsx with dynamic imports
5. **Fifth:** Test performance across all 4 sections together
6. **Sixth:** Optimize (reduce transforms, add `useReducedMotion`)

### File Structure Recommendation

```
src/
├── app/
│   └── espaco/
│       ├── page.tsx                  # Main page (minimal, imports sections)
│       └── layout.tsx                # Existing layout (no changes)
├── components/
│   ├── sections/
│   │   ├── espaco/                   # NEW folder for Espaço sections
│   │   │   ├── ManifestoSection.tsx
│   │   │   ├── StudiosSection.tsx
│   │   │   ├── CoworkSection.tsx
│   │   │   └── AmenitiesSection.tsx
│   │   └── CTASection.tsx            # Existing (reused)
│   ├── animations/
│   │   └── BlurText.tsx              # Existing (reuse if needed)
│   └── ui/
│       ├── Masonry.tsx               # Existing (reuse if needed)
│       └── SpotlightCard.tsx         # Existing (reuse if needed)
└── data/
    └── espacoData.ts                 # NEW: Extract image arrays from page.tsx
```

**Why `src/components/sections/espaco/` folder:**
- Groups Espaço-specific sections together
- Prevents cluttering `src/components/sections/` root
- Allows reuse on other pages if needed (e.g., `/aluguel` page might show Studios section)

## Animation Decision Matrix

**When to use GSAP vs Framer Motion:**

| Use Case | GSAP ScrollTrigger | Framer Motion useScroll | Rationale |
|----------|-------------------|------------------------|-----------|
| **Horizontal scroll** | ✅ Recommended | ⚠️ Possible (see HorizontalGallery) | GSAP handles better at scale |
| **Parallax (simple)** | ⚠️ Overkill | ✅ Recommended | Framer simpler for opacity/y |
| **Parallax (complex depth layers)** | ✅ Recommended | ❌ Hard to manage | GSAP timelines excel here |
| **Viewport reveals** | ❌ Use Framer | ✅ Recommended | `whileInView` is perfect |
| **Hover states** | ❌ Use Framer | ✅ Recommended | `whileHover` is declarative |
| **Scroll-linked SVG drawing** | ✅ Recommended | ❌ Not supported | GSAP `drawSVG` plugin |
| **Stagger animations** | ✅ Powerful | ✅ Also great | Both work, prefer Framer for React components |
| **Orbital/circular motion** | ✅ Recommended (see CapabilitiesOrbit) | ❌ Complex math | GSAP direct DOM manipulation wins |

**Rule of thumb:** If you need `requestAnimationFrame` or direct DOM manipulation → GSAP. If you can use React state/props → Framer Motion.

## Scaling Considerations

| Concern | Current | At 10 Sections | Mitigation |
|---------|---------|----------------|------------|
| **JavaScript bundle size** | ~150KB (GSAP + Framer Motion + Three.js) | Same (lazy-loaded) | Dynamic imports per section |
| **Scroll event listeners** | 4 sections = 4 `useScroll` hooks | 10 sections = 10 hooks | Use `viewport={{ once: true }}` for entrance animations |
| **Repaints per frame** | 4 sections × 2 properties = 8 GPU layers | 10 sections × 2 = 20 layers | Limit to `transform` + `opacity` only |
| **Memory (images)** | ~5MB (all Espaço images) | ~12MB | Next.js Image lazy-loads automatically |

**Performance target:** 60fps on MacBook Air M1 (mid-range 2025 device). Test on throttled CPU (4× slowdown in Chrome DevTools).

### First Bottleneck: Too Many Concurrent Transforms

**Symptom:** Frame drops during scroll on mid-range devices.

**Fix:**
1. Profile with Chrome DevTools → Performance tab
2. Identify slow sections (look for long frames >16ms)
3. Reduce transforms per section (e.g., only animate opacity, not opacity + y + scale)
4. Add `will-change: transform` only to actively animating elements

### Second Bottleneck: Image Loading During Scroll

**Symptom:** Janky scroll as images lazy-load.

**Fix:**
1. Use Next.js Image `priority` prop for above-fold images
2. Use `loading="eager"` for first 3 images per section
3. Preload critical images in `<head>` via `<link rel="preload">`

## Anti-Patterns

### Anti-Pattern 1: Animating Layout Properties

**What people do:**
```typescript
// ❌ BAD: Animates width (causes reflow)
const width = useTransform(scrollYProgress, [0, 1], ['50%', '100%']);
<motion.div style={{ width }} />
```

**Why it's wrong:** Animating `width`, `height`, `top`, `left`, `margin`, `padding` triggers **layout recalculation** (expensive, causes janky scroll).

**Do this instead:**
```typescript
// ✅ GOOD: Animates transform (GPU-accelerated)
const scaleX = useTransform(scrollYProgress, [0, 1], [0.5, 1]);
<motion.div style={{ scaleX }} />
```

### Anti-Pattern 2: Shared Scroll Context for Independent Sections

**What people do:**
```typescript
// ❌ BAD: Single scroll progress for entire page
const { scrollYProgress } = useScroll(); // Listens to entire document
```

**Why it's wrong:**
- Tight coupling: sections can't be reordered without breaking animations
- Hard to test sections in isolation
- Performance: one listener for all sections (less efficient than per-section)

**Do this instead:**
```typescript
// ✅ GOOD: Per-section scroll progress
export function ManifestoSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  // ...
}
```

### Anti-Pattern 3: Ignoring `prefers-reduced-motion`

**What people do:**
```typescript
// ❌ BAD: Always animate, even for users with motion sensitivity
<motion.div
  initial={{ opacity: 0, y: 100 }}
  animate={{ opacity: 1, y: 0 }}
/>
```

**Why it's wrong:** Accessibility violation. Users with vestibular disorders can experience nausea from motion.

**Do this instead:**
```typescript
// ✅ GOOD: Respect user preference
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function ManifestoSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.8 }}
    />
  );
}
```

**Note:** GSAPProvider already handles this globally (kills all GSAP animations when `prefers-reduced-motion: reduce`). Framer Motion requires per-component handling.

## Technical Constraints

### Lenis Smooth Scroll Behavior

**Key finding:** Lenis is **disabled on mobile** (`LenisProvider.tsx` line 21: `if (isMobile) return <>{children}</>;`).

**Implications for scroll-driven effects:**
- ✅ Desktop: Smooth scroll with `lerp: 0.12` (inertial scrolling)
- ❌ Mobile: Native scroll (no smooth easing)

**Design consideration:** Scroll-driven effects must work on BOTH:
1. **Desktop:** Smooth, slow scroll (users can see subtle parallax)
2. **Mobile:** Fast, native scroll (keep effects subtle, or they'll blur)

**Recommendation:** Test all effects on mobile with fast scroll. If effect is jarring, reduce intensity on mobile:
```typescript
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
const yRange = isMobile ? [0, -20] : [0, -100]; // Subtler parallax on mobile
const y = useTransform(scrollYProgress, [0, 1], yRange);
```

### GSAP ScrollTrigger Refresh

**Key finding:** GSAPProvider debounces `ScrollTrigger.refresh()` at 200ms on resize (`GSAPProvider.tsx` line 37).

**Implications:**
- After window resize, scroll positions may be incorrect for up to 200ms
- This is intentional (prevents dozens of refreshes during drag-resize)

**If using GSAP ScrollTrigger:** No action needed, already handled.
**If using Framer Motion useScroll:** Framer handles this internally, no issues.

## Sources

### Codebase Analysis (HIGH Confidence)
- `src/app/espaco/page.tsx` — Current page structure
- `src/app/page.tsx` — Homepage pattern (dynamic imports, lazy-loading)
- `src/components/sections/HorizontalGallery.tsx` — GSAP + Framer Motion coexistence example
- `src/components/sections/CapabilitiesOrbit.tsx` — GSAP direct DOM manipulation pattern
- `src/providers/LenisProvider.tsx` — Smooth scroll setup (desktop-only)
- `src/providers/GSAPProvider.tsx` — GSAP registration + cleanup pattern
- `src/hooks/useReducedMotion.ts` — Accessibility pattern

### Official Documentation (HIGH Confidence)
- Next.js Dynamic Imports: https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading
- Framer Motion useScroll: https://www.framer.com/motion/use-scroll/
- GSAP ScrollTrigger: https://gsap.com/docs/v3/Plugins/ScrollTrigger/

### Best Practices (MEDIUM Confidence — Derived from Codebase Patterns)
- Lazy-loading pattern: Proven in homepage (8 sections dynamically imported)
- Per-section scroll hooks: Recommended based on loose coupling principle
- Performance budget: Derived from Chrome DevTools 60fps target on M1 MacBook Air

---

*Architecture research for: Espaço Page Creative Redesign*
*Researched: 2026-03-15*
*Confidence: HIGH (based on existing codebase patterns + official documentation)*
