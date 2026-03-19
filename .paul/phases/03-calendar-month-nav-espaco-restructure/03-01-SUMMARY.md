---
phase: 03-calendar-month-nav-espaco-restructure
plan: 01
subsystem: ui
tags: [calendar, month-navigation, espaco, podcast, studios, cowork]

requires:
  - phase: none
    provides: n/a
provides:
  - Navegação por meses no calendário de estúdios (desktop)
  - Secção "Estúdios Nível Cinema" reduzida a 2 fotos
  - Nova secção "Estúdio de Podcast" com 3 fotos
  - Textos overlay removidos da secção Cowork
affects: []

tech-stack:
  added: []
  patterns:
    - "Separar arrays de dados quando secções visuais se dividem"

key-files:
  created:
    - src/components/sections/espaco/PodcastSection.tsx
  modified:
    - src/components/ui/StudioHourlyCalendar.tsx
    - src/data/espacoData.ts
    - src/components/sections/espaco/EstudiosSection.tsx
    - src/app/espaco/page.tsx

key-decisions:
  - "Navegação por mês: saltar para dia 1 do mês, com clamp a today/maxDate"
  - "Podcast secção alinhada à direita (alternância com EstudiosSection à esquerda)"
  - "Remover TODOS os títulos overlay do cowork (incluindo 'Open Space Geral') por consistência"

patterns-established:
  - "Navegação por mês desktop-only (hidden md:flex) — mobile mantém navegação diária"

duration: ~6min
started: 2026-03-18T00:00:00Z
completed: 2026-03-18T00:00:00Z
---

# Phase 3 Plan 01: Calendar Month Nav + Espaço Restructure Summary

**Navegação por meses no calendário desktop, secção estúdios dividida em Cinema (2 fotos) + Podcast (3 fotos), textos overlay removidos do cowork.**

## Performance

| Metric | Value |
|--------|-------|
| Duration | ~6min |
| Tasks | 3 completed |
| Files modified | 4 + 1 created |

## Acceptance Criteria Results

| Criterion | Status | Notes |
|-----------|--------|-------|
| AC-1: Navegação por meses no calendário desktop | Pass | Botões "Mês anterior"/"Próximo mês" com clamp a today e maxDate (90 dias) |
| AC-2: Secção Cinema 2 fotos + Podcast 3 fotos | Pass | estudiosImages reduzido, podcastImages criado, PodcastSection.tsx novo componente |
| AC-3: Textos overlay removidos do Cowork | Pass | Todos os títulos em coworkImages limpos a '' |

## Accomplishments

- Calendário desktop com navegação por mês (handlePrevMonth/handleNextMonth) — desktop-only
- Secção "Estúdios Nível Cinema" com 2 fotos em Masonry 2 colunas desktop
- Nova secção "Estúdio de Podcast" com 3 fotos, título alinhado à direita, Masonry 3 colunas
- Cowork sem textos overlay — fotos limpas sem "Plano Starter", "Plano Prime", "Lugar Premium"

## Files Created/Modified

| File | Change | Purpose |
|------|--------|---------|
| `src/components/ui/StudioHourlyCalendar.tsx` | Modified | Funções handlePrevMonth/handleNextMonth + botões de navegação mês (desktop) |
| `src/data/espacoData.ts` | Modified | Split estudiosImages (2) + podcastImages (3), add podcast content, clear cowork titles |
| `src/components/sections/espaco/EstudiosSection.tsx` | Modified | Masonry 3→2 colunas desktop |
| `src/components/sections/espaco/PodcastSection.tsx` | Created | Nova secção podcast (3 fotos, alinhamento direita) |
| `src/app/espaco/page.tsx` | Modified | Dynamic import PodcastSection, inserir entre Estudios e Cowork |

## Decisions Made

| Decision | Rationale | Impact |
|----------|-----------|--------|
| Mês nav: saltar para dia 1 | Mais intuitivo — mostra início do mês | UX clara |
| Clamp a today/maxDate | Não permitir navegar antes de hoje nem além de 90 dias | Consistente com limites existentes |
| Desktop-only (hidden md:flex) | Mobile já tem espaço limitado — navegação diária suficiente | Sem clutter mobile |
| Todos os títulos cowork removidos | Consistência — não deixar "Open Space Geral" sozinho | Visual limpo |

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## Next Phase Readiness

**Ready:**
- Milestone v1.5 completo — todas as 6 correções aplicadas
- Build passa sem erros

**Concerns:**
- None

**Blockers:**
- None

---
*Phase: 03-calendar-month-nav-espaco-restructure, Plan: 01*
*Completed: 2026-03-18*
