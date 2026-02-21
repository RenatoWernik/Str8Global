# Special Flows: Str8Global

## Configured Skills

8 skills integrated with PAUL workflow:

### Animation & Interaction
| Skill | Trigger | Usage |
|-------|---------|-------|
| gsap-react | GSAP animations in React | useGSAP hook, ScrollTrigger, cleanup patterns |
| tailwindcss-animations | Tailwind animation utilities | Built-in + custom animation patterns |
| scroll-storyteller | Scroll-based storytelling | Interactive scroll experiences, spotlight effects |

### Performance & Quality
| Skill | Trigger | Usage |
|-------|---------|-------|
| react-best-practices | React/Next.js code | Performance optimization, component patterns |
| nextjs-seo | SEO optimization | Metadata, sitemaps, JSON-LD, indexing |
| web-performance-seo | Lighthouse/PageSpeed | Accessibility contrast, CSS filters, OKLCH |
| accessibility-testing | WCAG compliance | axe, ARIA, keyboard nav, screen readers |

### Code Quality
| Skill | Trigger | Usage |
|-------|---------|-------|
| typescript-expert | TypeScript issues | Type-level programming, build performance |

## Integration Rules

- During **PLAN phase**: Consider which skills are relevant to the phase scope
- During **APPLY phase**: Invoke relevant skills when implementing features
- During **UNIFY phase**: Run accessibility-testing and web-performance-seo for validation
- **Pre-deploy**: Run nextjs-seo audit + accessibility-testing + Lighthouse check

## Activation

Skills are invoked automatically when context matches their trigger keywords.
Manual invocation via slash command (e.g., `/gsap-react`, `/nextjs-seo`).

---
*Created: 2026-02-12*
