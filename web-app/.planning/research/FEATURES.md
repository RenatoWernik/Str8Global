# Feature Landscape: Creative Photography Portfolio Page

**Domain:** Immersive photography agency portfolio/showcase page (Espaço redesign)
**Researched:** 2026-03-15

## Table Stakes

Features users expect from a premium photography agency portfolio page. Missing = page feels generic/amateur.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Smooth scroll** | Industry standard for creative agencies (Awwwards, FWA). Users expect fluid navigation on dark-theme sites. | LOW | Already have Lenis. No work needed. |
| **High-quality images** | Core content. Poor image quality = immediate credibility loss. Must be optimized (WebP/AVIF) but crisp. | LOW | Next.js Image handles. Ensure 13 photos optimized. |
| **Mobile responsive** | 60%+ traffic from mobile. Gallery must adapt to portrait orientation. Touch targets 44px min. | MEDIUM | Existing Tailwind + breakpoints. Test gallery on mobile. |
| **Fast load time** | Users leave if >3s load. Premium sites paradoxically load faster (shows technical competence). | MEDIUM | Lazy load images, code splitting, optimize fonts. |
| **Accessible navigation** | Keyboard navigation, screen reader support, focus indicators. Table stakes for professional sites in 2026. | MEDIUM | Existing components have focus styles. Test with keyboard. |
| **Category filtering** | 5 studios + 5 cowork + 3 amenities need organization. Users want to browse by type. | MEDIUM | Filter buttons + Framer Motion layout animation. |
| **Image lazy loading** | 13 high-res photos = heavy page. Images below fold must lazy load. | LOW | Next.js Image `loading="lazy"`. Already supported. |
| **Dark theme optimization** | #000 background already chosen. White text must be readable, images must have contrast. | LOW | Already implemented in design system. Test readability. |

## Differentiators

Features that set this portfolio page apart from generic templates. Not expected, but create "wow" moments.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Text character reveal** | Unexpected animation. Makes headlines feel cinematic. Common on Awwwards sites, rare on local agency sites. | MEDIUM | Splitting.js + GSAP. 1-2 days implementation. |
| **Magnetic cursor** | Desktop-only but memorable. Cursor pulls towards interactive elements. Signals attention to detail. | MEDIUM | Framer Motion useSpring. 1 day implementation. Custom, no library. |
| **Image reveal on scroll** | Clip-path animation makes images "appear" dramatically. More engaging than fade-in. | MEDIUM | GSAP ScrollTrigger. 1-2 days for 13 images. |
| **Parallax layers** | Depth perception. 2-3 image layers scrolling at different speeds. Creates spatial dimension. | LOW-MEDIUM | GSAP ScrollTrigger scrub. Half day per section. |
| **Bento grid layout** | Varied image sizes (not uniform grid). Looks editorial, not template-based. | MEDIUM | CSS Grid explicit areas. 1-2 days design + implementation. |
| **Fullscreen lightbox** | Click image → expands to fullscreen with smooth transition. Expected for portfolio work. | MEDIUM | Framer Motion layoutId. 1-2 days. Test on mobile. |
| **Horizontal scroll section** | Unconventional navigation. Amenities scroll horizontally while pinned. Memorable experience. | HIGH | GSAP ScrollTrigger pin + horizontal. 2-3 days. Accessibility concern. |
| **Magnetic image hover** | Images subtly follow cursor on hover. More engaging than scale-only hover. | MEDIUM | Framer Motion mouse tracking. 1 day. Desktop-only. |
| **Balanced typography** | No orphaned words in headlines. Professional typesetting. Most sites ignore this. | LOW | react-wrap-balancer. 1 hour. Instant polish. |
| **Gradient text animation** | Magenta (#FF10F0) gradient animated through headline. Reinforces brand color. | LOW | CSS background-clip + GSAP. Half day. |

## Anti-Features

Features to explicitly NOT build. Common mistakes or over-engineering.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Auto-playing video backgrounds** | Heavy bandwidth (13 photos already), accessibility issues (motion sickness), distracts from content. | Use video sparingly (1-2 sections max) with play button. CLAUDE.md mentions "separate mobile/desktop versions" for existing videos — follow that pattern. |
| **Infinite scroll** | Only 13 photos. Infinite scroll for small set feels artificial and prevents users from reaching footer (contact info). | Fixed gallery with "Load More" if adding more photos later, or single-page layout. |
| **Complex 3D WebGL scenes** | Three.js for complex scenes = 100kB+ bundle, high GPU usage, breaks on older devices. Over-engineered for 13 photos. | Use Three.js sparingly (simple tilt effect on 1-2 images max). Rely on CSS transforms for most effects. |
| **Music/sound effects** | Unexpected audio is jarring, accessibility issue, most users browse with sound off. | Silence. If absolutely needed, user-initiated with clear mute button. |
| **Swipe-between-photos carousel (unless validated)** | Adds complexity (embla-carousel 8kB), might not match user mental model (users expect to see all photos at once in portfolio). | Start with static gallery. Add carousel ONLY if UX testing shows users want it. |
| **Masonry layout (unless design requires)** | react-photo-album 5kB for automatic masonry. For 13 photos, manual CSS Grid gives more design control and smaller bundle. | CSS Grid with explicit grid-template-areas. Bento grid (varied sizes, intentional layout). |
| **Multiple parallax scroll libraries** | Common mistake: installing locomotive-scroll when Lenis already installed. Double event listeners = janky performance. | Stick to Lenis (already installed). Use GSAP ScrollTrigger for scroll-driven animations. |
| **Separate image reveal library** | Libraries like react-awesome-reveal (12kB) replicate what GSAP ScrollTrigger does better. | GSAP ScrollTrigger + custom clip-path/opacity animations. |
| **Typewriter effect on body text** | Slows reading, annoying after first view, accessibility issue (screen readers announce each character). | Use typewriter sparingly (1 headline max) or skip entirely. Character reveal (Splitting.js) is better. |
| **Cursor trail effects** | Distracting, harms readability on dark backgrounds, feels dated (2010s Flash era). | Magnetic cursor (subtle, functional) instead of trail (visual noise). |

## Feature Dependencies

**Text animations:**
```
Splitting.js installation → HeroText component → Character reveal animation
                                                  ↘ Word scramble effect (optional)
```

**Image effects:**
```
GSAP ScrollTrigger (existing) → RevealImage component → Clip-path reveal
                                                        ↘ Parallax effect
                                                        ↘ Scale on scroll

Framer Motion (existing) → MagneticImage component → Mouse tracking hover
```

**Gallery:**
```
CSS Grid Bento layout → Category filter (Framer Motion layout) → Fullscreen lightbox (Framer layoutId)
                                                                   ↓
                                                    Optional: Swipe navigation (embla-carousel)
```

**Cursor:**
```
Framer Motion useSpring → MagneticCursor component → Magnetic button effects
                                                     ↘ Image preview cursor (optional)
```

**Horizontal scroll (amenities section):**
```
GSAP ScrollTrigger pin → Horizontal scroll container → Accessibility fallback (keyboard arrows)
```

## MVP Recommendation

For **Version 1 (4 weeks)**, prioritize table stakes + high-impact differentiators:

### Must Have (MVP)
1. **Smooth scroll** (already have Lenis) ✓
2. **High-quality images** (optimize 13 photos, Next.js Image)
3. **Mobile responsive gallery** (test touch targets, portrait layout)
4. **Category filtering** (Studios/Cowork/Amenities buttons)
5. **Image lazy loading** (Next.js automatic)
6. **Text character reveal** (Splitting.js — hero section only for MVP)
7. **Image reveal on scroll** (GSAP clip-path — all 13 photos)
8. **Bento grid layout** (CSS Grid — showcases design skills)
9. **Balanced typography** (react-wrap-balancer — quick win)

### Should Have (If Time Permits)
10. **Fullscreen lightbox** (Framer layoutId — expected for portfolios)
11. **Parallax layers** (GSAP — 2-3 hero images only)
12. **Magnetic cursor** (Framer Motion — desktop-only, polish)

### Defer to v2
- **Horizontal scroll section** (HIGH complexity, accessibility concerns)
- **Magnetic image hover** (nice-to-have polish)
- **Gradient text animation** (visual flourish, not critical)
- **Swipe gallery** (add ONLY if UX testing validates)
- **3D tilt effects** (requires Three.js verification, heavy bundle)

**MVP rationale:**
- **Week 1:** Text animations (Splitting.js setup, hero reveal, balanced typography)
- **Week 2:** Image reveal effects (GSAP clip-path for 13 photos, parallax on 2-3 hero images)
- **Week 3:** Gallery layout (bento grid CSS, category filter, responsive mobile)
- **Week 4:** Lightbox + polish (Framer layoutId, magnetic cursor, accessibility testing)

**Scope control:** Defer horizontal scroll and swipe gallery. These are high-complexity features that can be added post-launch if validated.

## Feature Interaction Patterns

### Desktop Experience (≥768px)
- **Magnetic cursor** active (pulls towards buttons/images)
- **Parallax scrolling** active (2-3 layers)
- **Image hover effects** active (magnetic movement, scale)
- **Keyboard navigation** full support (arrows, ESC, TAB)

### Mobile Experience (<768px)
- **Touch-optimized targets** 44px minimum
- **Swipe gestures** ONLY if embla-carousel installed (defer to v2)
- **Reduced motion** simpler animations (respect `prefers-reduced-motion`)
- **No cursor effects** (cursor events don't exist on touch)

### Accessibility Fallbacks
- **Reduced motion:** Disable parallax, character reveal, magnetic effects
- **Keyboard only:** All interactions accessible via TAB, ENTER, ESC, ARROWS
- **Screen reader:** ARIA labels on gallery images, focus management in lightbox

## User Journey: Gallery Interaction

**Ideal flow:**
1. **Land on page** → Hero text reveals character-by-character (2s animation)
2. **Scroll down** → Images reveal via clip-path as they enter viewport
3. **Category filter** → Click "Studios" → Framer Motion layout animation (other photos fade/slide out)
4. **Image click** → Fullscreen lightbox opens with smooth Framer layoutId transition
5. **Navigate lightbox** → Arrow keys (desktop) or swipe (mobile, if implemented)
6. **Close lightbox** → ESC key or swipe down (drawer pattern)
7. **Continue scrolling** → Amenities section (horizontal scroll if implemented, or standard vertical)

**Critical moments:**
- **First scroll:** Image reveal must be smooth (60fps). If janky, user loses trust.
- **Category filter:** Layout animation must feel instant (<300ms). Slow filter = frustrating.
- **Lightbox open:** Transition must be seamless. Janky animation = feels broken.

## Performance Budget

For 13 high-quality photos + creative effects:

| Metric | Target | Current Risk |
|--------|--------|--------------|
| **First Contentful Paint** | <1.5s | MEDIUM — 13 images to optimize |
| **Largest Contentful Paint** | <2.5s | MEDIUM — Hero image size critical |
| **Total Blocking Time** | <200ms | LOW — Minimal JS with current plan |
| **Cumulative Layout Shift** | <0.1 | MEDIUM — Gallery filter animation must not shift layout |
| **Bundle size added** | <10kB | LOW — Only 3.5kB added (Splitting + Balancer) |

**Optimization checklist:**
- [ ] All 13 photos converted to AVIF (Next.js automatic)
- [ ] Hero image preloaded (`<link rel="preload">`)
- [ ] Below-fold images lazy-loaded
- [ ] Splitting.js loaded dynamically (not in initial bundle)
- [ ] GSAP animations use GPU-accelerated properties (transform, opacity)

## Sources

- **Awwwards Site of the Day winners** (training data) — Text reveal, parallax, magnetic cursor patterns
- **FWA (Favourite Website Awards)** (training data) — Gallery layouts, image effects
- **Existing codebase** (package.json, CLAUDE.md) — Current capabilities
- **Vercel/Next.js best practices** (training data) — Performance budgets, image optimization

**Confidence:**
- Table stakes features: HIGH (standard expectations)
- Differentiators: MEDIUM (based on premium agency trends as of Jan 2025)
- Anti-features: HIGH (common mistakes well-documented)
- Performance targets: HIGH (Web Vitals standard)

**Gap:** Could not access ReactBits.dev or LightsWind.com to validate specific effect implementations. User should manually review these sites and cross-reference with this feature list.

---

*Feature landscape for: Creative Photography Portfolio Page (Espaço redesign)*
*Researched: 2026-03-15*
