# Roadmap: Str8Global

## Milestones

- v1.1 Calendários Públicos — Phases 1-4 (shipped 2026-03-10, Phase 4 deferred)
- v1.2 Mobile-Native Calendar Experience — Phases 5-8 (in progress)

## Phases

<details>
<summary>v1.1 Calendários Públicos (Phases 1-4) — SHIPPED 2026-03-10</summary>

### Phase 1: Schema & API — Suporte Horário (COMPLETE 2026-03-10)

**Goal**: Atualizar schema Supabase e API de disponibilidade para suportar reservas por hora (estúdios) e disponibilidade por item/plano.
**Requirements:** DB-01, DB-02, DB-03
**Plans:** 2 plans

Plans:
- [x] 01-01-PLAN.md — Schema + types + CRUD com validacao de sobreposicao horaria
- [x] 01-02-PLAN.md — APIs de disponibilidade mensal e horaria

**Success Criteria:**
1. `start_time`/`end_time` existem na tabela e aceitam valores (ex: "10:00", "14:00")
2. API monthly retorna `{ unavailableDates: ["2026-03-15", "2026-03-16"] }` para um item específico
3. API hourly retorna `{ slots: [{ hour: "10:00", available: false, reservation: "Cliente X" }, ...] }` para um estúdio
4. Criar reserva de estúdio com horário sobreposto retorna erro 409

---

### Phase 2: Calendário Público — Equipamento & Cowork (COMPLETE 2026-03-10)

**Goal**: Substituir o date picker actual por calendários mensais per-item/per-plan com dias indisponíveis riscados.
**Requirements:** CAL-01, CAL-02, CAL-03, CAL-04
**Plans:** 3 plans

Plans:
- [x] 02-01-PLAN.md — useMonthlyAvailability hook + AvailabilityCalendar component
- [x] 02-02-PLAN.md — Integrar no GearRenting (per-item calendars)
- [x] 02-03-PLAN.md — Integrar no CoworkStandalone + update aluguel page

**Success Criteria:**
1. Utilizador vê calendário mensal ao clicar "Escolher data" num item de equipamento
2. Dias onde o item está reservado aparecem visivelmente riscados
3. Utilizador vê calendário mensal ao clicar "Escolher data" num plano cowork
4. Dias onde o plano tem 0 lugares aparecem riscados
5. Navegação entre meses funciona (até +90 dias)

---

### Phase 3: Calendário Público — Estúdio Hourly (COMPLETE 2026-03-10)

**Goal**: Criar calendário de horas estilo Google Calendar para estúdios, permitindo ver disponibilidade por hora e pré-preencher WhatsApp.
**Requirements:** STU-01, STU-02, STU-03, STU-04, STU-05
**Plans:** 2 plans

Plans:
- [x] 03-01-PLAN.md — useHourlyAvailability hook + StudioHourlyCalendar component
- [x] 03-02-PLAN.md — Integrar no StudioRenting + WhatsApp hour prefill

**Success Criteria:**
1. Vista de horas 8h-23h aparece ao seleccionar estúdio
2. Horas ocupadas mostram bloco colorido com nome da reserva
3. Horas livres são clicáveis e mostram estado hover
4. Navegação entre dias funciona
5. Mensagem WhatsApp inclui data e hora seleccionada

---

### Phase 4: Dashboard Admin — Calendário Horário & Melhorias (DEFERRED)

**Goal**: Adaptar dashboard admin com calendário visual por hora para estúdios e vista por item para equipamento.
**Requirements:** ADM-01, ADM-02, ADM-03, ADM-04
**Status:** Deferred to v2

</details>

---

## v1.2 Mobile-Native Calendar Experience

**Milestone Goal:** Redesign completo da experiência mobile dos calendários (mensal e horário) com padrões nativos — bottom sheets, gestos swipe, touch targets grandes, animações spring — sem alterar a versão desktop já aprovada.

**Phases:** 4 (Phases 5-8)
**Requirements:** 21 total
**Research:** Complete (vaul for bottom sheets, Vibration API for haptics, extend existing components)

- [ ] **Phase 5: Bottom Sheet Foundation** — Componente MobileBottomSheet reutilizável com snap points, swipe dismiss, safe areas
- [ ] **Phase 6: Calendário Mensal Mobile** — AvailabilityCalendar mobile-native dentro do bottom sheet
- [ ] **Phase 7: Calendário Horário Mobile** — StudioHourlyCalendar mobile-native com slots agrupados e summary bar
- [ ] **Phase 8: Interacção, Feedback & Performance** — Haptics, tap feedback, spring animations, validação cross-browser

---

### Phase 5: Bottom Sheet Foundation

**Goal:** Utilizadores mobile vêem os calendários dentro de um bottom sheet nativo com drag handle, snap points e swipe-to-dismiss, sem qualquer impacto na versão desktop.

**Depends on:** Phase 3 (calendários desktop existentes)
**Requirements:** SHEET-01, SHEET-02, SHEET-03, SHEET-04, SHEET-05, PERF-02
**Complexity:** MEDIUM
**Research:** SKIP (vaul validated, approach defined)
**Plans:** 2 plans (estimated)

Plans:
- [ ] 05-01: MobileBottomSheet component (vaul) com snap points, drag handle, safe areas, Lenis pause
- [ ] 05-02: Integrar bottom sheet no AvailabilityCalendar e StudioHourlyCalendar (mobile branch)

**Tasks:**
1. Instalar vaul (~8kB) como dependência
2. Criar `MobileBottomSheet.tsx` — wrapper reutilizável com drag handle, backdrop, snap points (50% e 100%)
3. Implementar velocity-based swipe dismiss (threshold configurável)
4. Respeitar safe areas via `env(safe-area-inset-*)` no CSS
5. Ao abrir sheet: pausar Lenis (`lenis.stop()`), bloquear body scroll (`overflow: hidden`)
6. Ao fechar sheet: retomar Lenis (`lenis.start()`), desbloquear body scroll
7. Integrar no `AvailabilityCalendar` — branch `!isDesktop` renderiza dentro de `MobileBottomSheet` em vez de dropdown
8. Integrar no `StudioHourlyCalendar` — branch `!isDesktop` renderiza dentro de `MobileBottomSheet` em vez de inline panel
9. Verificar que desktop path (createPortal) permanece 100% inalterado

**Success Criteria:**
1. Em mobile (<768px), ao abrir qualquer calendário, aparece bottom sheet com drag handle no topo (não dropdown nem inline)
2. Utilizador pode arrastar o sheet entre posição meio e fullscreen, e o sheet faz snap para a posição mais próxima
3. Swipe rápido para baixo fecha o bottom sheet e regressa ao conteúdo da página
4. O conteúdo da página por trás do sheet não faz scroll enquanto o sheet está aberto
5. Em desktop (>=768px), os calendários funcionam exactamente como antes (Portal modal / inline panel)

---

### Phase 6: Calendário Mensal Mobile

**Goal:** Utilizadores mobile interagem com o calendário mensal de equipamento/cowork com touch targets grandes, navegação swipe entre meses, estados visuais claros e botão "Hoje" na thumb-zone.

**Depends on:** Phase 5 (bottom sheet)
**Requirements:** MCAL-01, MCAL-02, MCAL-03, MCAL-04, MCAL-05
**Complexity:** MEDIUM
**Research:** SKIP (approach defined — extend AvailabilityCalendar mobile branch)
**Plans:** 2 plans (estimated)

Plans:
- [ ] 06-01: Mobile calendar grid — touch targets 44x44px, estados visuais, botão "Hoje"
- [ ] 06-02: Swipe navigation entre meses com animação spring

**Tasks:**
1. Redesenhar grid de dias para mobile — cada célula mínimo 44x44px, spacing adequado para touch
2. Implementar estados visuais distintos: indisponível (strikethrough + opacity), hoje (accent dot), seleccionado (accent fill #FF10F0), passado (dimmed)
3. Adicionar swipe horizontal detection — esquerda = mês seguinte, direita = mês anterior
4. Animação spring na transição entre meses (Framer Motion spring config)
5. Botão "Hoje" fixo na parte inferior do bottom sheet (thumb-zone), visível quando mês actual != mês mostrado
6. Manter navegação por setas como fallback (acessibilidade)

**Success Criteria:**
1. Cada dia no calendário mobile tem área de toque confortável (mínimo 44x44px) e é fácil de seleccionar com o polegar
2. Utilizador navega entre meses com swipe horizontal e vê animação fluida de transição
3. Dias indisponíveis, dia de hoje, dia seleccionado e dias passados são visualmente distintos e inconfundíveis
4. Botão "Hoje" aparece na zona inferior do sheet e salta para o mês/dia actual ao tocar

---

### Phase 7: Calendário Horário Mobile

**Goal:** Utilizadores mobile vêem os slots horários dos estúdios organizados por período, navegam entre dias com swipe, e têm um summary bar persistente com CTA WhatsApp.

**Depends on:** Phase 5 (bottom sheet)
**Requirements:** HCAL-01, HCAL-02, HCAL-03, HCAL-04, HCAL-05
**Complexity:** MEDIUM
**Research:** SKIP (approach defined — extend StudioHourlyCalendar mobile branch)
**Plans:** 2 plans (estimated)

Plans:
- [ ] 07-01: Slots agrupados por período (Manhã/Tarde/Noite) + quick filter pills + touch targets
- [ ] 07-02: Swipe entre dias + summary bar persistente com CTA WhatsApp

**Tasks:**
1. Reorganizar layout mobile de slots — agrupar por período: Manhã (8h-12h), Tarde (12h-17h), Noite (17h-23h) com section headers
2. Cada slot com touch target mínimo 44x44px, spacing adequado
3. Quick filter pills no topo (Manhã | Tarde | Noite) — ao tocar, scroll automático suave para a secção correspondente
4. Swipe horizontal entre dias (esquerda = dia seguinte, direita = dia anterior)
5. Summary bar fixa no fundo do sheet — mostra data seleccionada + hora seleccionada + botão CTA WhatsApp
6. Summary bar actualiza em tempo real ao seleccionar slot
7. Garantir que a lista de 90+ slots (15h x 6 por hora) renderiza sem jank — considerar virtualização se necessário

**Success Criteria:**
1. Slots horários aparecem organizados em 3 grupos (Manhã/Tarde/Noite) com headers claros
2. Tocar em "Tarde" nas filter pills faz scroll automático para os slots de tarde
3. Utilizador navega entre dias com swipe horizontal e a vista actualiza
4. Barra no fundo mostra resumo (ex: "Ter 15 Mar, 14:00-15:00") com botão WhatsApp que abre mensagem pré-preenchida
5. Cada slot horário é facilmente tocável sem toques acidentais em slots adjacentes

---

### Phase 8: Interacção, Feedback & Performance

**Goal:** Todos os elementos interactivos nos calendários mobile têm haptic feedback, tap feedback visual, animações spring consistentes, e a experiência funciona sem frame drops em Safari iOS e Chrome Android.

**Depends on:** Phase 6 + Phase 7 (ambos calendários mobile completos)
**Requirements:** TOUCH-01, TOUCH-02, TOUCH-03, PERF-01, PERF-03
**Complexity:** LOW-MEDIUM
**Research:** SKIP (Vibration API native, spring physics via Framer Motion)
**Plans:** 2 plans (estimated)

Plans:
- [ ] 08-01: Haptic feedback + tap feedback visual (scale + glow) em todos os interactive elements
- [ ] 08-02: Spring animations unificadas + performance profiling + cross-browser validation

**Tasks:**
1. Criar hook `useHapticFeedback()` — wrapper do Vibration API com feature detection, pattern curto (10ms) para selecção
2. Aplicar haptic ao seleccionar: dia no calendário mensal, slot no calendário horário, filter pill, snap point do sheet
3. Tap feedback visual — scale down (0.95) + accent glow no tap de qualquer elemento interactivo (Framer Motion whileTap)
4. Auditar todas as transições mobile e garantir spring physics consistente (mesma spring config: damping, stiffness)
5. Performance profiling em Chrome DevTools (CPU throttle 4x) — identificar e resolver frame drops
6. Testar em Safari iOS (Safari 16+) e Chrome Android — resolver incompatibilidades
7. Verificar que `prefers-reduced-motion` desactiva animações spring e haptics

**Success Criteria:**
1. Ao seleccionar uma data ou slot, o utilizador sente vibração subtil (em dispositivos que suportam) e vê feedback visual imediato
2. Todos os botões, dias e slots respondem visualmente ao toque antes mesmo do resultado da acção
3. Transições (abrir/fechar sheet, navegar meses/dias) usam spring physics com feeling consistente
4. A experiência mobile corre sem stuttering visível num dispositivo Android mid-range
5. Calendários mobile funcionam correctamente em Safari iOS e Chrome Android sem bugs visuais ou funcionais

---

## Phase Dependencies

```
v1.1 (Phases 1-3 complete) ─── base para v1.2

Phase 5 (Bottom Sheet)
  ├──→ Phase 6 (Cal Mensal Mobile)
  └──→ Phase 7 (Cal Horário Mobile)

Phase 6 + Phase 7 ──→ Phase 8 (Feedback & Performance)
```

Phases 6 e 7 podem ser executadas em paralelo após Phase 5.
Phase 8 aplica-se transversalmente a ambos os calendários, por isso executa após ambos estarem completos.

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SHEET-01 | Phase 5 | Pending |
| SHEET-02 | Phase 5 | Pending |
| SHEET-03 | Phase 5 | Pending |
| SHEET-04 | Phase 5 | Pending |
| SHEET-05 | Phase 5 | Pending |
| PERF-02 | Phase 5 | Pending |
| MCAL-01 | Phase 6 | Pending |
| MCAL-02 | Phase 6 | Pending |
| MCAL-03 | Phase 6 | Pending |
| MCAL-04 | Phase 6 | Pending |
| MCAL-05 | Phase 6 | Pending |
| HCAL-01 | Phase 7 | Pending |
| HCAL-02 | Phase 7 | Pending |
| HCAL-03 | Phase 7 | Pending |
| HCAL-04 | Phase 7 | Pending |
| HCAL-05 | Phase 7 | Pending |
| TOUCH-01 | Phase 8 | Pending |
| TOUCH-02 | Phase 8 | Pending |
| TOUCH-03 | Phase 8 | Pending |
| PERF-01 | Phase 8 | Pending |
| PERF-03 | Phase 8 | Pending |

**Coverage:** 21/21 v1.2 requirements mapped

---

## Progress

**Execution Order:** 5 → 6 → 7 → 8 (6 and 7 parallelizable)

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Schema & API | v1.1 | 2/2 | Complete | 2026-03-10 |
| 2. Cal Equip/Cowork | v1.1 | 3/3 | Complete | 2026-03-10 |
| 3. Cal Estúdio Hourly | v1.1 | 2/2 | Complete | 2026-03-10 |
| 4. Admin Dashboard | v1.1 | 0/0 | Deferred | - |
| 5. Bottom Sheet Foundation | v1.2 | 0/2 | Not started | - |
| 6. Cal Mensal Mobile | v1.2 | 0/2 | Not started | - |
| 7. Cal Horário Mobile | v1.2 | 0/2 | Not started | - |
| 8. Feedback & Performance | v1.2 | 0/2 | Not started | - |

---
*Roadmap created: 2026-03-10 (v1.1)*
*Updated: 2026-03-13 (v1.2 phases added)*
