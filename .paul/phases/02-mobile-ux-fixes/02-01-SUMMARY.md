---
phase: 02-mobile-ux-fixes
plan: 01
subsystem: ui
tags: [mobile, responsive, globe, navbar, calendar, bottom-sheet]

requires:
  - phase: none
    provides: n/a
provides:
  - Globo mobile otimizado sem clipping nas 4 hero sections
  - Botão fechar dentro do overlay do menu mobile
  - Calendário de estúdios sem clipping no MobileBottomSheet
affects: []

tech-stack:
  added: []
  patterns:
    - "Condicionar overflow-hidden/rounded ao desktop quando mobile wrapper (vaul) já controla"
    - "Desativar animações scale em mobile quando bottom sheet já anima entrada"

key-files:
  created: []
  modified:
    - src/components/sections/portfolio/PortfolioHero.tsx
    - src/components/sections/rental/RentalHero.tsx
    - src/app/espaco/page.tsx
    - src/components/sections/cursos/CursosHero.tsx
    - src/components/layout/Navbar.tsx
    - src/components/ui/StudioHourlyCalendar.tsx

key-decisions:
  - "Globo mobile: w-[140%] max-w-[600px] top-[55%] — equilibrio entre imersão e sem overflow"
  - "Botão X dentro do overlay — z-stacking impede acesso ao botão da navbar (z-50 vs z-60)"
  - "Calendário mobile: remover overflow-hidden, scale animation, e padding duplicado"

patterns-established:
  - "Em mobile bottom sheets, não duplicar overflow-y-auto nem padding do wrapper"

duration: ~8min
started: 2026-03-18T00:00:00Z
completed: 2026-03-18T00:00:00Z
---

# Phase 2 Plan 01: Mobile UX Fixes Summary

**Globo mobile corrigido (4 heroes), botão fechar adicionado ao menu mobile, calendário de estúdios sem clipping no bottom sheet.**

## Performance

| Metric | Value |
|--------|-------|
| Duration | ~8min |
| Tasks | 3 completed |
| Files modified | 6 |

## Acceptance Criteria Results

| Criterion | Status | Notes |
|-----------|--------|-------|
| AC-1: Globo mobile sem clipping | Pass | w-[140%], max-w-[600px], top-[55%] aplicado em 4 ficheiros |
| AC-2: Botão fechar no menu mobile | Pass | Botão X com closeMobileMenu dentro do overlay z-[60] |
| AC-3: Calendário mobile sem clipping | Pass | overflow-hidden/rounded movidos para desktop-only, scale desativado em mobile, padding corrigido |

## Accomplishments

- Globo redimensionado para mobile (140% largura, 600px max) em Portfolio, Aluguer, Espaço, Cursos
- Botão X visível (size 28, top-6 right-6) dentro do overlay full-screen do menu mobile
- Calendário mobile sem double-scroll, sem clipping por rounded-2xl, sem salto visual por scale animation

## Files Created/Modified

| File | Change | Purpose |
|------|--------|---------|
| `src/components/sections/portfolio/PortfolioHero.tsx` | Modified | Globo mobile: w-[140%] max-w-[600px] top-[55%] |
| `src/components/sections/rental/RentalHero.tsx` | Modified | Globo mobile: mesma correção |
| `src/app/espaco/page.tsx` | Modified | Globo mobile: mesma correção |
| `src/components/sections/cursos/CursosHero.tsx` | Modified | Globo mobile: mesma correção |
| `src/components/layout/Navbar.tsx` | Modified | Botão X dentro do overlay mobile |
| `src/components/ui/StudioHourlyCalendar.tsx` | Modified | Remover overflow-hidden/scale/padding duplicado em mobile |

## Decisions Made

| Decision | Rationale | Impact |
|----------|-----------|--------|
| w-[140%] em vez de w-[250%] | 250% causava elemento 2.5x viewport — overflow horizontal | Globo visível e centrado |
| Botão X dentro do overlay | Navbar z-50 fica abaixo do overlay z-60 — stacking context impede acesso | UX de fechar menu resolvida |
| Desativar scale animation em mobile | MobileBottomSheet (vaul) já anima entrada — dupla animação causa salto | Transição suave |

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## Next Phase Readiness

**Ready:**
- Mobile UX funcional e polida
- Build passa sem erros

**Concerns:**
- None

**Blockers:**
- None

---
*Phase: 02-mobile-ux-fixes, Plan: 01*
*Completed: 2026-03-18*
