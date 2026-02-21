# Roadmap: Str8Global

## Overview

De um MVP com homepage e página de aluguer, até um website premium completo com navegação global, portfolio individual (Igor & Marta), cursos, apresentação do espaço, booking e SEO — cada fase eleva a experiência e funcionalidade, mantendo a identidade sofisticada e anti-genérica.

## Current Milestone

**v0.1 Initial Release** (v0.1.0)
Status: In progress
Phases: 0 of 7 complete

## Phases

| Phase | Name | Plans | Status | Completed |
|-------|------|-------|--------|-----------|
| 1 | Navigation & Site Structure | 2 | Complete | 2026-02-12 |
| 2 | Rental Page Polish | 1 | Complete | 2026-02-12 |
| 3 | Portfolio Individual | 2 | Not started | - |
| 4 | Cursos (Courses) | 2 | Not started | - |
| 5 | Espaço (Space Showcase) | 1 | Not started | - |
| 6 | Services & Booking | 2 | Not started | - |
| 7 | SEO, Performance & Launch | 2 | Not started | - |

## Phase Details

### Phase 1: Navigation & Site Structure

**Goal:** Navegação global funcional (navbar + footer) com links para todas as páginas planeadas e layout partilhado entre páginas.
**Depends on:** Nothing (foundational)
**Research:** Unlikely (internal patterns)

**Scope:**
- Navbar responsiva com menu mobile (hamburger)
- Footer com links, social e contacto
- Layout partilhado para todas as páginas
- Links para: Home, Portfolio, Cursos, Espaço, Aluguel, Contacto

**Plans:**
- [x] 01-01: Navbar component + mobile menu + footer
- [x] 01-02: Shared page layout + route placeholders

### Phase 2: Rental Page Polish

**Goal:** Finalizar a página /aluguel com imagens reais de equipamento e refinamento visual.
**Depends on:** Phase 1 (navbar integration)
**Research:** Unlikely (existing patterns)

**Scope:**
- Integrar imagens reais de gear (assets existentes)
- Refinar secções: GearRenting, StudioRenting, RentalHero, CoworkStudio
- Consistência visual com design system

**Plans:**
- [x] 02-01: Gear images integration + section refinements

### Phase 3: Portfolio Individual

**Goal:** Página /portfolio com divisão entre "Portfolio do Igor" e "Portfolio da Marta", cada um com galeria própria.
**Depends on:** Phase 1 (navbar/layout)
**Research:** Unlikely (gallery patterns exist)

**Scope:**
- Route /portfolio com toggle/tabs Igor vs Marta
- Galerias individuais com categorias
- Dados de portfolio em ficheiro dedicado
- Animações consistentes com homepage

**Plans:**
- [ ] 03-01: Portfolio data structure + page route + tab navigation
- [ ] 03-02: Individual galleries with filtering + animations

### Phase 4: Cursos (Courses)

**Goal:** Página /cursos com identidade visual distinta (rosa como cor principal), direcionada ao público feminino.
**Depends on:** Phase 1 (navbar/layout)
**Research:** Likely (theme variant approach)
**Research topics:** Como implementar tema rosa sem afetar o tema global dark

**Scope:**
- Route /cursos com tema rosa (#FF10F0 como primário, não accent)
- Cards de cursos com descrição, preço, CTA
- Dados de cursos em ficheiro dedicado
- Design que comunique sofisticação feminina

**Plans:**
- [ ] 04-01: Theme variant + page structure + course data
- [ ] 04-02: Course cards + animations + CTAs

### Phase 5: Espaço (Space Showcase)

**Goal:** Página /espaco que apresenta o espaço físico da agência com fotos e vídeos do co-working, estúdio e áreas comuns.
**Depends on:** Phase 1 (navbar/layout)
**Research:** Unlikely (media gallery patterns)

**Scope:**
- Route /espaco com galeria foto/vídeo
- Secções: estúdios, co-working, áreas comuns
- Virtual tour feel com scroll animations
- CTA para booking/contacto

**Plans:**
- [ ] 05-01: Space page with photo/video gallery + sections

### Phase 6: Services & Booking

**Goal:** Página de serviços otimizada para conversão + sistema de booking para co-working e estúdio.
**Depends on:** Phase 1 (navbar), Phase 2 (rental data)
**Research:** Likely (booking UX without backend)
**Research topics:** Booking flow sem backend — WhatsApp/Calendly/formulário

**Scope:**
- Página /servicos dedicada (expandir da secção homepage)
- CTAs otimizados por serviço
- Sistema de booking (WhatsApp flow ou integração externa)
- Calendário de disponibilidade (se viável sem backend)

**Plans:**
- [ ] 06-01: Services page with per-service CTAs
- [ ] 06-02: Booking system (WhatsApp flow + optional calendar)

### Phase 7: SEO, Performance & Launch

**Goal:** Otimização completa para lançamento — SEO por página, formulário de contacto, performance Lighthouse >90.
**Depends on:** All prior phases
**Research:** Unlikely (established patterns)

**Scope:**
- Metadata SEO por página (OpenGraph, Twitter, JSON-LD)
- Sitemap.xml + robots.txt
- Formulário de contacto funcional
- Lighthouse audit + optimizations
- Verificação final mobile responsive

**Plans:**
- [ ] 07-01: Per-page SEO + sitemap + robots.txt
- [ ] 07-02: Contact form + Lighthouse optimization + final polish

---
*Roadmap created: 2026-02-12*
*Last updated: 2026-02-12*
