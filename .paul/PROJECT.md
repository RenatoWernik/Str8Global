# Str8Global

## What This Is

Website premium para a agência Str8Global — uma agência de marketing, fotografia e vídeo baseada em Lisboa. O site inclui portfolio interativo, página de aluguer de equipamento, booking de co-working e estúdio, venda de serviços, e páginas dedicadas a cursos, portfolios individuais (Igor e Marta) e apresentação do espaço físico. Cada detalhe do site deve transmitir sofisticação, qualidade e diferenciação — o oposto de genérico.

## Core Value

Marcas em Portugal conseguem encontrar e contratar uma agência criativa premium com serviços integrados de marketing, fotografia e vídeo — e o site confirma isso através da qualidade, sofisticação e ser o oposto de um site genérico.

## Current State

| Attribute | Value |
|-----------|-------|
| Version | 0.1.0 |
| Status | MVP |
| Last Updated | 2026-02-12 |

**Production URLs:**
- https://str8global.com (planned)

## Requirements

### Validated (Shipped)

- [x] Homepage com Hero (vídeo background), Services, SelectedWorks, HorizontalGallery, PortfolioGrid, Industries, ClientsSection, Capabilities, Contact — v0.1.0
- [x] Página /aluguel com Gear Renting, Studio Renting, Cowork+Studio, Cowork standalone — v0.1.0
- [x] Animações premium: GSAP ScrollTrigger, Framer Motion, Lenis smooth scroll — v0.1.0
- [x] Design system dark theme (#000, #fff, #FF10F0 accent) — v0.1.0
- [x] Responsive mobile/desktop com vídeos separados — v0.1.0
- [x] Suporte prefers-reduced-motion em todas as animações — v0.1.0

### Active (In Progress)

- [ ] Imagens reais de equipamento na página /aluguel (assets em preparação)
- [ ] Refinamento das secções rental (CoworkStudio, GearRenting, RentalHero, StudioRenting)

### Planned (Next)

- [ ] Página de Cursos — tema rosa (#FF10F0 como principal), direcionada ao público feminino
- [ ] Página Portfolio Individual — dividida entre "Portfolio do Igor" e "Portfolio da Marta"
- [ ] Página do Espaço — apresentação do espaço físico (co-working, estúdio) com fotos e vídeos
- [ ] Sistema de booking para co-working e estúdio
- [ ] Página de venda de serviços com CTAs otimizados
- [ ] SEO avançado e metadata por página
- [ ] Formulário de contacto funcional (substituir email direto)
- [ ] Navegação global (navbar/menu)

### Out of Scope

- E-commerce / pagamentos online — fase futura
- Blog / sistema de artigos — não prioritário
- Multi-idioma (EN) — futuro, apenas PT-PT por agora
- Dashboard admin / CMS — conteúdo gerido via código

## Target Users

**Primary:** Marcas e empresas em Portugal
- Precisam de marketing visual premium (fotografia, vídeo, conteúdo)
- Valorizam qualidade e diferenciação sobre preço
- Sectores: desporto, restauração, turismo, imobiliário, retalho, marcas pessoais

**Secondary:** Criativos e freelancers
- Precisam de alugar equipamento fotográfico/vídeo
- Procuram espaço de co-working ou estúdio em Lisboa

**Tertiary:** Público feminino interessado em cursos
- Formação em marketing, fotografia ou conteúdo digital

## Context

**Business Context:**
Str8Global é uma agência criativa premium em Lisboa com 12+ anos de experiência, 150+ projectos e contactos directos via WhatsApp (Igor e Marta). O site é o cartão de visita digital — deve comunicar instantaneamente que não é uma agência genérica.

**Technical Context:**
- Next.js 16 + React 19 + TypeScript 5 + Tailwind v4
- Animações: GSAP + Framer Motion + Lenis
- 3D: Three.js + React Three Fiber (disponível mas uso selectivo)
- Hosting: Vercel (planeado)
- Sem backend/API — conteúdo estático em ficheiros de dados

## Constraints

### Technical Constraints
- Must run on Vercel (static/SSG preferred)
- No database — dados em ficheiros TypeScript
- Tailwind v4 (not v3) — @import syntax
- Next.js App Router only (no Pages Router)

### Business Constraints
- Conteúdo em PT-PT (Portugal) exclusivamente
- WhatsApp como canal principal de contacto
- Dois portfolios separados (Igor e Marta)
- Página de cursos com identidade visual distinta (rosa)

### Compliance Constraints
- GDPR basic (sem formulários com dados sensíveis por agora)
- Cookies consent (quando analytics forem adicionados)

## Key Decisions

| Decision | Rationale | Date | Status |
|----------|-----------|------|--------|
| Dark theme com magenta accent | Transmite premium e diferenciação | 2025 | Active |
| GSAP + Framer Motion dual | GSAP para scroll, Framer para componentes | 2025 | Active |
| Lenis smooth scroll | Experiência premium de navegação | 2025 | Active |
| Dados em ficheiros TS (sem CMS) | Simplicidade, velocidade, sem dependência externa | 2025 | Active |
| WhatsApp como CTA principal | Canal directo, conversão alta em PT | 2025 | Active |

## Success Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Lighthouse Performance | >90 | TBD | Not measured |
| Lighthouse SEO | >95 | TBD | Not measured |
| Time to first meaningful paint | <2s | TBD | Not measured |
| Páginas implementadas | 6 (home, aluguel, cursos, portfolio, espaço, serviços) | 2 | In progress |
| Mobile responsive | 100% | ~90% | In progress |

## Tech Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| Framework | Next.js 16 (App Router) | React 19, TypeScript 5 |
| Styling | Tailwind CSS v4 + Styled Components | CSS vars in globals.css |
| Animations | GSAP 3.14 + Framer Motion 12 | Lenis smooth scroll |
| 3D | Three.js + React Three Fiber | Uso selectivo em efeitos |
| Icons | Lucide React | Import individual |
| Utils | clsx + tailwind-merge | cn() helper |
| Hosting | Vercel | Planeado |

## Links

| Resource | URL |
|----------|-----|
| Repository | Local (git) |
| Production | https://str8global.com (planned) |
| Domain | str8global.com |

---
*PROJECT.md — Updated when requirements or context change*
*Last updated: 2026-02-12*
