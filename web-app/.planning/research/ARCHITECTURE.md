# Architecture Patterns: Creative Photography Portfolio Page

**Domain:** Immersive photography agency page with scroll-driven effects
**Researched:** 2026-03-15

## Recommended Architecture

**Layer-based approach** leveraging existing GSAP + Framer Motion + Lenis stack:

```
┌─────────────────────────────────────────────────┐
│ Page Layer (src/app/espaco/page.tsx)            │
│ - Section composition                           │
│ - Scroll context (Lenis provider active)        │
│ - GSAP context (GSAPProvider active)            │
└──────────────────┬────────────────────────────────┘
                   │
    ┌──────────────┴──────────────┐
    │                             │
┌───▼─────────────────┐  ┌────────▼────────────────┐
│ Scroll Layer (GSAP)  │  │ Interaction Layer       │
│ - Image reveals      │  │ (Framer Motion)         │
│ - Parallax effects   │  │ - Cursor tracking       │
│ - Pin sections       │  │ - Hover effects         │
│ - Timeline sequences │  │ - Layout animations     │
└──────────────────────┘  │ - Lightbox transitions  │
                          └─────────────────────────┘
                                     │
                          ┌──────────▼──────────────┐
                          │ Layout Layer (CSS Grid) │
                          │ - Bento grid            │
                          │ - Responsive breakpoints│
                          │ - Safe areas            │
                          └─────────────────────────┘
```

**Key principle:** Each layer uses its specialized tool. Don't use GSAP for interactions (use Framer). Don't use Framer for scroll (use GSAP). Don't use JS for layout (use CSS Grid).

---

## Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| **EspacoPage** | Section orchestration, scroll context, data fetching | Lenis provider, GSAP provider, section components |
| **HeroSection** | Text reveal, gradient animation, intro copy | HeroText, Balancer |
| **HeroText** | Character-by-character reveal using Splitting.js | GSAP ScrollTrigger |
| **GallerySection** | Bento grid layout, category filter state | FilterButtons, ImageGrid, Lightbox |
| **ImageGrid** | CSS Grid layout, responsive breakpoints | RevealImage components |
| **RevealImage** | Individual image with clip-path reveal on scroll | GSAP ScrollTrigger, Next Image |
| **FilterButtons** | Category selection UI (Studios/Cowork/Amenities) | GallerySection state |
| **Lightbox** | Fullscreen image expansion with layoutId | Framer Motion AnimatePresence |
| **MagneticCursor** | Custom cursor follower (desktop only) | Framer Motion useMotionValue |
| **ParallaxImage** | Image with scroll-linked transform | GSAP ScrollTrigger scrub |

---

## Data Flow

**Static content flow:**
```
espaco-content.ts (data file)
    ↓
EspacoPage (fetch/import content)
    ↓
Section components (receive via props)
    ↓
Image/text components (render with effects)
```

**Animation flow:**
```
User scrolls page
    ↓
Lenis smooth scroll (intercepts, smooths)
    ↓
GSAP ScrollTrigger (monitors scroll position)
    ↓
Trigger animations (clip-path, parallax, pin)
    ↓
GPU-accelerated CSS transforms (render)
```

**Interaction flow:**
```
User hovers/clicks element
    ↓
Framer Motion event handlers (onHoverStart, onClick)
    ↓
Spring physics calculations (useSpring)
    ↓
MotionValue updates (x, y, scale)
    ↓
Re-render with new transform
```

**State flow (category filter):**
```
User clicks filter button
    ↓
FilterButtons updates local state (activeCategory)
    ↓
GallerySection filters image array
    ↓
Framer Motion layout prop detects DOM changes
    ↓
Automatic layout animation (fade out/in)
```

---

## Patterns to Follow

### Pattern 1: Scroll-Triggered Image Reveal

**What:** Images reveal via animated clip-path as they enter viewport.

**When:** For all 13 portfolio images. Creates dramatic entrance effect.

**Example:**
```tsx
'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

interface RevealImageProps {
  src: string;
  alt: string;
  priority?: boolean;
}

export function RevealImage({ src, alt, priority }: RevealImageProps) {
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!imageRef.current) return;

    // Clip-path reveal animation
    gsap.fromTo(
      imageRef.current,
      { clipPath: 'inset(0 100% 0 0)' },
      {
        clipPath: 'inset(0 0% 0 0)',
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: imageRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, []);

  return (
    <div ref={imageRef} className="relative aspect-[4/3] overflow-hidden">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={priority}
      />
    </div>
  );
}
```

**Why:** GSAP ScrollTrigger provides precise scroll position detection. Clip-path animates on GPU (performant). Cleanup automatic on unmount.

---

### Pattern 2: Text Character Reveal

**What:** Split headline into individual characters, stagger-reveal with GSAP.

**When:** Hero headline, section titles. Creates cinematic text entrance.

**Example:**
```tsx
'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface HeroTextProps {
  children: string;
  className?: string;
}

export function HeroText({ children, className }: HeroTextProps) {
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Dynamic import to avoid SSR issues with Splitting
    import('splitting').then((module) => {
      const Splitting = module.default;

      if (!textRef.current) return;

      // Split text into characters
      const results = Splitting({
        target: textRef.current,
        by: 'chars',
      });

      const chars = results[0]?.chars;
      if (!chars) return;

      // Stagger animation
      gsap.from(chars, {
        opacity: 0,
        y: 20,
        stagger: 0.02,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 80%',
        },
      });
    });

    // Note: Splitting wraps each char in span, no manual cleanup needed
  }, []);

  return (
    <h1 ref={textRef} className={className}>
      {children}
    </h1>
  );
}
```

**Why:** Splitting.js handles character wrapping (complex DOM manipulation). GSAP provides stagger timing. Dynamic import prevents SSR issues.

---

### Pattern 3: Magnetic Cursor (Framer Motion)

**What:** Custom cursor that springs towards hover targets.

**When:** Desktop only (≥768px). Adds premium agency feel.

**Example:**
```tsx
'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export function MagneticCursor() {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    if (!isDesktop) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [isDesktop, cursorX, cursorY]);

  if (!isDesktop) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-[#FF10F0] pointer-events-none z-50 mix-blend-difference"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        translateX: '-50%',
        translateY: '-50%',
      }}
    />
  );
}
```

**Why:** Framer Motion's spring physics feel natural. MotionValue avoids re-renders (performance). Desktop-only guard prevents mobile issues.

---

### Pattern 4: Category Filter with Layout Animation

**What:** Filter gallery by category (Studios/Cowork/Amenities) with automatic layout animation.

**When:** GallerySection with 13 photos split across categories.

**Example:**
```tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Category = 'all' | 'studios' | 'cowork' | 'amenities';

interface Image {
  id: string;
  src: string;
  alt: string;
  category: Category;
}

interface GallerySectionProps {
  images: Image[];
}

export function GallerySection({ images }: GallerySectionProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('all');

  const filteredImages =
    activeCategory === 'all'
      ? images
      : images.filter((img) => img.category === activeCategory);

  return (
    <section className="py-20">
      {/* Filter buttons */}
      <div className="flex gap-4 mb-12">
        {['all', 'studios', 'cowork', 'amenities'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat as Category)}
            className={activeCategory === cat ? 'active' : ''}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Image grid with layout animations */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredImages.map((img) => (
            <motion.div
              key={img.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <RevealImage src={img.src} alt={img.alt} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
```

**Why:** Framer Motion's `layout` prop automatically animates position/size changes. `AnimatePresence` handles enter/exit animations. No manual position calculations needed.

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Installing Duplicate Scroll Libraries

**What:** Installing locomotive-scroll when Lenis already active.

**Why bad:** Both intercept scroll events. Double event listeners cause janky performance, unpredictable behavior. Scroll position calculations conflict.

**Instead:** Use Lenis (already installed) for smooth scroll. GSAP ScrollTrigger for scroll-driven animations. Never install locomotive-scroll, react-parallax, or react-scroll-parallax.

---

### Anti-Pattern 2: Using Framer Motion for Scroll Animations

**What:** Using Framer Motion's `useScroll` + `useTransform` for complex scroll-driven reveals.

**Why bad:** Less powerful than GSAP ScrollTrigger. No pin/scrub, limited timeline control, harder to debug. GSAP is industry standard for scroll.

**Instead:** Use GSAP ScrollTrigger for scroll. Reserve Framer Motion for interactions (hover, click, drag, layout animations).

---

### Anti-Pattern 3: Animating Layout Properties

**What:** Animating `width`, `height`, `top`, `left` with GSAP or Framer Motion.

**Why bad:** Triggers layout reflow (expensive). 30fps on mobile instead of 60fps. Battery drain.

**Instead:** Animate GPU-accelerated properties only: `transform` (translateX/Y, scale, rotate), `opacity`, `clip-path`. Use Framer Motion's `layout` prop if you MUST animate size.

---

### Anti-Pattern 4: Manual Character Wrapping

**What:** Manually splitting text into `<span>` elements per character in React.

**Why bad:** Complex, error-prone, breaks accessibility (screen readers announce each span). Hard to maintain.

**Instead:** Use Splitting.js (handles wrapping, preserves semantics). Import dynamically to avoid SSR issues.

---

### Anti-Pattern 5: Heavy Animations on Mobile

**What:** Running parallax, magnetic cursor, character reveal on mobile without guards.

**Why bad:** Mobile CPUs are slower. Battery drain. Janky scrolling. Users expect simpler mobile UX.

**Instead:** Desktop-only progressive enhancement:
```tsx
const isDesktop = useMediaQuery('(min-width: 768px)');
const shouldAnimate = isDesktop && !prefersReducedMotion;

if (!shouldAnimate) return <SimpleVersion />;
```

---

## Scalability Considerations

| Concern | At 13 photos (current) | At 50+ photos | At 100+ photos |
|---------|------------------------|---------------|----------------|
| **Image loading** | Lazy load below fold | Lazy load + blur placeholder | Virtualized gallery (react-window) |
| **GSAP ScrollTrigger** | 13 triggers = fine | 50 triggers = OK | 100+ triggers = use batch mode |
| **Framer Motion layout** | 13 elements = smooth | 50 elements = may lag | Consider CSS-only transitions |
| **Category filtering** | Client-side array filter | Client-side (instant) | Consider pagination or search |
| **Bundle size** | 3.5kB added (Splitting + Balancer) | Watch for GSAP plugins | Code-split by section |

**Current architecture is fine for 13 photos.** If expanding to 50+, consider:
1. **Virtualized gallery** (only render visible images)
2. **GSAP batch mode** (group triggers for better performance)
3. **Pagination** (load more pattern instead of showing all)
4. **Image CDN** (Cloudflare Images, Imgix for dynamic optimization)

---

## File Structure

```
src/
├── app/
│   └── espaco/
│       ├── page.tsx                 # Main page, section orchestration
│       └── espaco-content.ts        # Static content (image paths, copy)
│
├── components/
│   ├── sections/
│   │   └── espaco/
│   │       ├── HeroSection.tsx      # Hero with HeroText + Balancer
│   │       ├── GallerySection.tsx   # Gallery with filter + grid
│   │       └── AmenitiesSection.tsx # Amenities (optional horizontal scroll)
│   │
│   ├── animations/
│   │   ├── HeroText.tsx             # Splitting.js + GSAP character reveal
│   │   ├── RevealImage.tsx          # GSAP clip-path reveal
│   │   ├── ParallaxImage.tsx        # GSAP parallax transform
│   │   └── MagneticCursor.tsx       # Framer Motion custom cursor
│   │
│   └── ui/
│       ├── Lightbox.tsx             # Framer Motion layoutId expansion
│       └── FilterButtons.tsx        # Category filter UI
│
└── providers/
    ├── GSAPProvider.tsx             # Already exists (GSAP registration)
    └── LenisProvider.tsx            # Already exists (smooth scroll)
```

**Naming convention:**
- `*Section.tsx` = Page sections (Hero, Gallery, Amenities)
- `*Image.tsx` = Image components with effects (Reveal, Parallax)
- `*Text.tsx` = Text animation components (Hero, Section headers)
- `*Cursor.tsx` = Cursor effects (Magnetic, Image preview)

---

## Integration with Existing Architecture

**Already in place (DO NOT change):**
1. **Lenis smooth scroll** — LenisProvider wraps app
2. **GSAP registration** — GSAPProvider registers ScrollTrigger
3. **Tailwind CSS** — Design system, breakpoints, utility classes
4. **Next.js Image** — Automatic optimization, lazy loading, responsive images
5. **useMediaQuery hook** — Desktop/mobile branching

**Add to existing:**
1. **Splitting.js dynamic import** in text animation components
2. **react-wrap-balancer** in headline components
3. **Framer Motion patterns** already used, extend with layoutId/springs

**DO NOT add:**
- New scroll library (locomotive-scroll)
- New animation library (anime.js, react-spring for animations)
- New CSS framework (keep Tailwind)

---

## Performance Monitoring

**Metrics to track:**
1. **Lighthouse Performance score** — Target: >90
2. **Cumulative Layout Shift (CLS)** — Target: <0.1 (filter animation must not shift)
3. **Total Blocking Time (TBT)** — Target: <200ms (GSAP/Framer Motion optimized)
4. **Largest Contentful Paint (LCP)** — Target: <2.5s (hero image critical)

**Tools:**
- Chrome DevTools Performance tab (60fps scroll check)
- Lighthouse CI (automated performance regression detection)
- WebPageTest (real-world mobile device testing)

**Red flags:**
- Frame rate <60fps during scroll (simplify parallax)
- TBT >300ms (too much JS execution, code-split)
- CLS >0.1 (reserve space for images, avoid layout shifts)

---

## Sources

- **GSAP ScrollTrigger docs** (training data) — Scroll animation patterns
- **Framer Motion docs** (training data) — Layout animations, layoutId, springs
- **Next.js Image docs** (training data) — Optimization, lazy loading
- **Existing codebase** (package.json, providers, hooks) — Current architecture

**Confidence:** HIGH — Architecture extends existing patterns without major changes.

---

*Architecture patterns for: Creative Photography Portfolio Page (Espaço redesign)*
*Researched: 2026-03-15*
