---
phase: 12-polish-interactivity
plan: 01
subsystem: visual-effects
tags: [parallax, lightbox, gsap, framer-motion, accessibility]

dependency-graph:
  requires: [gsap-scrolltrigger, framer-motion, useReducedMotion]
  provides: [ParallaxImage, ImageLightbox]
  affects: []

tech-stack:
  added:
    - "ParallaxImage: GSAP ScrollTrigger scrub parallax (desktop-only)"
    - "ImageLightbox: Framer Motion layoutId transitions"
  patterns:
    - "Intensity clamping (max 15% vertical movement)"
    - "Mobile detection with matchMedia + change listener"
    - "Reduced-motion bypass with duration: 0"
    - "Body scroll lock on lightbox open"
    - "Escape key handler with cleanup"

key-files:
  created:
    - src/components/animations/ParallaxImage.tsx
    - src/components/ui/ImageLightbox.tsx
  modified: []

decisions:
  - "POLISH-04: ParallaxImage disabled on mobile (<768px) and reduced-motion for legal compliance"
  - "VFX-05: ParallaxImage uses loading='eager' to prevent LCP delay"
  - "REACT19-01: useGSAP uses scope parameter for React 19 concurrent safety"
  - "LIBRARY-01: Both components have library ownership comments explaining WHY library chosen"
  - "Intensity capped at 15%: Maximum yPercent range is -15% to +15% to prevent excessive movement"
  - "layoutId integration: ParallaxImage supports optional layoutId prop for seamless lightbox morph"

metrics:
  duration: "2 min"
  tasks: 2
  files_created: 2
  commits: 2
  completed: "2026-03-16"
---

# Phase 12 Plan 01: Core Polish Components (ParallaxImage + ImageLightbox)

**One-liner:** GSAP ScrollTrigger scrub parallax and Framer Motion layoutId lightbox as reusable building blocks.

## Objective

Create the two core polish components: ParallaxImage (GSAP ScrollTrigger scrub) and ImageLightbox (Framer Motion AnimatePresence + layoutId). These are standalone, reusable building blocks that will be integrated into section components in Plan 12-02.

## Tasks Completed

| Task | Name                                              | Commit  | Files                                        |
| ---- | ------------------------------------------------- | ------- | -------------------------------------------- |
| 1    | Create ParallaxImage with GSAP ScrollTrigger      | b58b539 | src/components/animations/ParallaxImage.tsx  |
| 2    | Create ImageLightbox with Framer Motion           | ea3fc7e | src/components/ui/ImageLightbox.tsx          |

## Implementation Details

### Task 1: ParallaxImage Component

Created a GSAP ScrollTrigger-powered parallax image wrapper with the following features:

**Core functionality:**
- GSAP ScrollTrigger with `scrub: true` for smooth 60fps interpolation
- Vertical parallax movement using `yPercent` animation
- Configurable intensity (0-15%) with automatic clamping to prevent excessive movement
- Image wrapper scaled to 1.15x to accommodate parallax range without cropping

**Responsive behavior:**
- Desktop-only parallax (disabled on mobile <768px)
- Mobile detection using `window.matchMedia` with change listener
- Static image rendering on mobile (zero movement)

**Accessibility:**
- Complete bypass when `prefers-reduced-motion` is active (POLISH-04 compliance)
- Uses `useReducedMotion` hook for consistent detection

**Integration features:**
- Optional `layoutId` prop for Framer Motion lightbox integration
- Optional `onClick` handler for lightbox trigger
- Optional `children` prop for overlay content (gradients, titles)
- Container overflow hidden to clip parallax movement

**Technical implementation:**
- React 19 safe: `useGSAP` with `scope: containerRef` parameter (REACT19-01)
- Proper dependency array includes `[isMobile, prefersReducedMotion, clampedIntensity]`
- Uses `loading="eager"` per VFX-05 decision to prevent LCP delay
- Library ownership comment explains why GSAP chosen over Framer Motion

**Props interface:**
```typescript
interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;        // Container div classes
  imageClassName?: string;   // Next.js Image classes
  aspectRatio?: string;      // Tailwind aspect class, default "aspect-video"
  intensity?: number;        // Parallax intensity 0-15 (percentage), default 10
  children?: ReactNode;      // Overlay content (gradients, titles)
  layoutId?: string;         // Framer Motion layoutId for lightbox integration
  onClick?: () => void;      // Click handler for lightbox trigger
}
```

### Task 2: ImageLightbox Component

Created a Framer Motion AnimatePresence-powered fullscreen image lightbox with the following features:

**Core functionality:**
- AnimatePresence for smooth enter/exit transitions
- `layoutId` for seamless origin-to-fullscreen morph animation
- Fullscreen overlay with `bg-black/90` backdrop
- Next.js Image with `fill` and `object-contain` (shows entire image)

**Close mechanisms:**
- Backdrop click (clicking outside image)
- Escape key handler with proper cleanup
- Close button (X icon) in top-right corner
- All three methods call `onClose` callback

**Accessibility:**
- `role="dialog"` and `aria-modal="true"` on overlay
- Auto-focus close button when lightbox opens
- Focus ring with proper contrast on close button
- Respects `prefers-reduced-motion`: uses `duration: 0` for instant transitions

**UX features:**
- Body scroll lock when lightbox is open (restored on close/unmount)
- Click event stops propagation on image to prevent accidental backdrop close
- Smooth morph transition with custom easing `[0.25, 0.1, 0.25, 1]`
- Transition duration: 0.4s (or 0 if reduced motion)

**Technical implementation:**
- Uses `useReducedMotion` hook for consistent reduced-motion detection
- Proper cleanup of event listeners and body scroll lock in useEffect
- AnimatePresence with `mode="wait"` for clean enter/exit
- Library ownership comment explains why Framer Motion chosen over GSAP

**Props interface:**
```typescript
interface ImageLightboxProps {
  src: string;
  alt: string;
  layoutId: string;           // Must match the triggering element's layoutId
  isOpen: boolean;
  onClose: () => void;
}
```

## Verification Results

All verification criteria passed:

1. ✅ `npx tsc --noEmit` passes with 0 errors
2. ✅ Both files are substantive (ParallaxImage: 130 lines, ImageLightbox: 115 lines)
3. ✅ ParallaxImage contains GSAP ScrollTrigger with scrub and intensity cap
4. ✅ ImageLightbox contains AnimatePresence with layoutId
5. ✅ Both respect prefers-reduced-motion
6. ✅ ParallaxImage disables on mobile
7. ✅ No console.log or TODO/FIXME in either file

## Deviations from Plan

None - plan executed exactly as written.

## Key Decisions

### Intensity Capping Strategy
Capped maximum parallax intensity at 15% vertical movement to prevent excessive motion that could trigger motion sickness or feel unnatural. The clamping logic uses `Math.min(Math.max(intensity, 0), 15)` to ensure values stay within safe range.

### Mobile Detection Pattern
Used `window.matchMedia('(max-width: 767px)')` with change event listener to detect mobile viewport size. This allows the component to respond dynamically to viewport changes (e.g., device rotation) rather than being locked to initial render.

### layoutId Integration Approach
Made `layoutId` an optional prop on ParallaxImage to enable seamless integration with ImageLightbox. When provided, ParallaxImage wraps its content in a `motion.div` with the layoutId, enabling the origin-to-fullscreen morph transition.

### Reduced Motion Implementation
Both components use consistent reduced-motion handling:
- ParallaxImage: Exits early from useGSAP, rendering static image
- ImageLightbox: Sets transition duration to 0 for instant open/close

This ensures legal compliance with WCAG 2.1 Level AA (Decreto-Lei n.º 83/2018 in Portugal).

## Technical Notes

### GSAP vs Framer Motion Separation

These two components exemplify the animation library separation pattern documented in ANIMATION_LIBRARY_GUIDE.md:

**ParallaxImage uses GSAP because:**
- Scrubbed parallax requires precise scroll position interpolation
- GSAP's `scrub: true` provides optimal 60fps with zero render overhead
- Framer Motion's `useScroll` creates unnecessary re-renders for scroll-driven effects

**ImageLightbox uses Framer Motion because:**
- `layoutId` creates seamless shared-element transitions between DOM positions
- GSAP cannot automatically morph elements between states like Framer's layoutId
- AnimatePresence handles enter/exit orchestration with proper cleanup

### React 19 Concurrent Safety

ParallaxImage follows REACT19-01 decision by using the config object format for `useGSAP`:

```typescript
useGSAP(
  () => { /* animation code */ },
  { scope: containerRef, dependencies: [isMobile, prefersReducedMotion, clampedIntensity] }
);
```

This ensures animations work correctly with React 19's concurrent rendering and Suspense boundaries.

### Performance Considerations

ParallaxImage is optimized for performance:
- Exits early if mobile or reduced motion (no ScrollTrigger created)
- Uses single ScrollTrigger per instance (not multiple observers)
- Image wrapper scale transform is GPU-accelerated
- Proper cleanup via useGSAP scope pattern

ImageLightbox is also optimized:
- Body scroll lock prevents unnecessary layout recalculations
- Click propagation stopped on image to reduce event bubbling
- AnimatePresence mode="wait" prevents multiple simultaneous animations

## Integration Readiness

Both components are now ready for integration into section components in Plan 12-02:

**ParallaxImage integration:**
```typescript
<ParallaxImage
  src="/images/espaco/Estudio1.jpg"
  alt="Studio"
  intensity={12}
  layoutId="studio-1"
  onClick={() => setLightboxOpen(true)}
>
  {/* Optional overlay content */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
</ParallaxImage>
```

**ImageLightbox integration:**
```typescript
const [lightboxOpen, setLightboxOpen] = useState(false);

<ImageLightbox
  src="/images/espaco/Estudio1.jpg"
  alt="Studio"
  layoutId="studio-1"
  isOpen={lightboxOpen}
  onClose={() => setLightboxOpen(false)}
/>
```

The `layoutId` creates the seamless morph transition between ParallaxImage and ImageLightbox states.

## Success Criteria Met

✅ ParallaxImage component wraps images with GSAP ScrollTrigger scrub parallax (max 15% movement), disabled on mobile and reduced-motion

✅ ImageLightbox component provides fullscreen overlay with Framer Motion AnimatePresence + layoutId morph transition

✅ Both components are ready for integration into section components (Plan 12-02)

✅ TypeScript compiles without errors

## Next Steps (Plan 12-02)

1. Integrate ParallaxImage into EstudiosSection (bento grid layout)
2. Integrate ParallaxImage into CoworkSection (staggered offset layout)
3. Integrate ParallaxImage into ComodidadesSection (full-bleed showcase layout)
4. Add ImageLightbox state management to each section
5. Connect ParallaxImage onClick handlers to lightbox state
6. Test parallax movement ranges and visual polish
7. Verify reduced-motion and mobile behavior across all sections

---

**Status:** COMPLETE
**Duration:** 2 minutes
**Commits:** 2 (b58b539, ea3fc7e)
**Files Created:** 2

## Self-Check: PASSED

Verifying all claims made in this summary:

**Files exist:**
```bash
$ ls -la src/components/animations/ParallaxImage.tsx
✅ FOUND: src/components/animations/ParallaxImage.tsx (130 lines)

$ ls -la src/components/ui/ImageLightbox.tsx
✅ FOUND: src/components/ui/ImageLightbox.tsx (115 lines)
```

**Commits exist:**
```bash
$ git log --oneline --all | grep b58b539
✅ FOUND: b58b539 feat(12-01): create ParallaxImage with GSAP ScrollTrigger scrub

$ git log --oneline --all | grep ea3fc7e
✅ FOUND: ea3fc7e feat(12-01): create ImageLightbox with Framer Motion AnimatePresence
```

**Key functionality present:**
```bash
$ grep -n "ScrollTrigger.*scrub" src/components/animations/ParallaxImage.tsx
✅ FOUND: Line 14, 73, 83 - ScrollTrigger with scrub: true

$ grep -n "AnimatePresence.*layoutId" src/components/ui/ImageLightbox.tsx
✅ FOUND: Lines 9, 65, 90 - AnimatePresence with layoutId

$ grep -n "Math.min" src/components/animations/ParallaxImage.tsx
✅ FOUND: Line 60 - Intensity clamping logic

$ grep -n "prefers-reduced-motion" src/components/ui/ImageLightbox.tsx
✅ FOUND: Line 7 - Reduced motion handling
```

All verification checks passed. Summary claims are accurate.
