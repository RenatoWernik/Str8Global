# Roadmap: Str8Global

## Milestones

- v1.1 Calendários Públicos — Phases 1-4 (shipped 2026-03-10, Phase 4 deferred)
- v1.2 Mobile-Native Calendar Experience — Phases 5-8 (shipped 2026-03-15)
- v1.3 Redesign Página Espaço — Phases 9-12 (active)

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

<details>
<summary>v1.2 Mobile-Native Calendar Experience (Phases 5-8) — SHIPPED 2026-03-15</summary>

**Milestone Goal:** Redesign completo da experiência mobile dos calendários (mensal e horário) com padrões nativos — bottom sheets, gestos swipe, touch targets grandes, animações spring — sem alterar a versão desktop já aprovada.

**Phases:** 4 (Phases 5-8)
**Requirements:** 21 total
**Research:** Complete (vaul for bottom sheets, Vibration API for haptics, extend existing components)

---

### Phase 5: Bottom Sheet Foundation (COMPLETE 2026-03-15)

**Goal:** Utilizadores mobile vêem os calendários dentro de um bottom sheet nativo com drag handle, snap points e swipe-to-dismiss, sem qualquer impacto na versão desktop.

**Depends on:** Phase 3 (calendários desktop existentes)
**Requirements:** SHEET-01, SHEET-02, SHEET-03, SHEET-04, SHEET-05, PERF-02
**Plans:** 2 plans

Plans:
- [x] 05-01-PLAN.md — MobileBottomSheet component reutilizável com vaul (snap points, drag handle, safe areas, body scroll lock)
- [x] 05-02-PLAN.md — Integrar bottom sheet nos 2 calendários (mobile branch apenas, desktop Portal inalterado)

**Success Criteria:**
1. Em mobile (<768px), ao abrir qualquer calendário, aparece bottom sheet com drag handle no topo (não dropdown nem inline)
2. Utilizador pode arrastar o sheet entre posição meio e fullscreen, e o sheet faz snap para a posição mais próxima
3. Swipe rápido para baixo fecha o bottom sheet e regressa ao conteúdo da página
4. O conteúdo da página por trás do sheet não faz scroll enquanto o sheet está aberto
5. Em desktop (>=768px), os calendários funcionam exactamente como antes (Portal modal / inline panel)

---

### Phase 6: Calendário Mensal Mobile (COMPLETE 2026-03-15)

**Goal:** Utilizadores mobile interagem com o calendário mensal de equipamento/cowork com touch targets grandes, navegação swipe entre meses, estados visuais claros e botão "Hoje" na thumb-zone.

**Depends on:** Phase 5 (bottom sheet)
**Requirements:** MCAL-01, MCAL-02, MCAL-03, MCAL-04, MCAL-05
**Plans:** 2 plans

Plans:
- [x] 06-01: Mobile calendar grid — touch targets 44x44px, estados visuais, botão "Hoje"
- [x] 06-02: Swipe navigation entre meses com animação spring

**Success Criteria:**
1. Cada dia no calendário mobile tem área de toque confortável (mínimo 44x44px) e é fácil de seleccionar com o polegar
2. Utilizador navega entre meses com swipe horizontal e vê animação fluida de transição
3. Dias indisponíveis, dia de hoje, dia seleccionado e dias passados são visualmente distintos e inconfundíveis
4. Botão "Hoje" aparece na zona inferior do sheet e salta para o mês/dia actual ao tocar

---

### Phase 7: Calendário Horário Mobile (COMPLETE 2026-03-15)

**Goal:** Utilizadores mobile vêem os slots horários dos estúdios organizados por período, navegam entre dias com swipe, e têm um summary bar persistente com CTA WhatsApp.

**Depends on:** Phase 5 (bottom sheet)
**Requirements:** HCAL-01, HCAL-02, HCAL-03, HCAL-04, HCAL-05
**Plans:** 2 plans

Plans:
- [x] 07-01: Slots agrupados por período (Manhã/Tarde/Noite) + quick filter pills + touch targets
- [x] 07-02: Swipe entre dias + summary bar persistente com CTA WhatsApp

**Success Criteria:**
1. Slots horários aparecem organizados em 3 grupos (Manhã/Tarde/Noite) com headers claros
2. Tocar em "Tarde" nas filter pills faz scroll automático para os slots de tarde
3. Utilizador navega entre dias com swipe horizontal e a vista actualiza
4. Barra no fundo mostra resumo (ex: "Ter 15 Mar, 14:00-15:00") com botão WhatsApp que abre mensagem pré-preenchida
5. Cada slot horário é facilmente tocável sem toques acidentais em slots adjacentes

---

### Phase 8: Interacção, Feedback & Performance (COMPLETE 2026-03-15)

**Goal:** Todos os elementos interactivos nos calendários mobile têm haptic feedback, tap feedback visual, animações spring consistentes, e a experiência funciona sem frame drops em Safari iOS e Chrome Android.

**Depends on:** Phase 6 + Phase 7 (ambos calendários mobile completos)
**Requirements:** TOUCH-01, TOUCH-02, TOUCH-03, PERF-01, PERF-03
**Plans:** 2 plans

Plans:
- [x] 08-01: Haptic feedback + tap feedback visual (scale + glow) em todos os interactive elements
- [x] 08-02: Spring animations unificadas + performance profiling + cross-browser validation

**Success Criteria:**
1. Ao seleccionar uma data ou slot, o utilizador sente vibração subtil (em dispositivos que suportam) e vê feedback visual imediato
2. Todos os botões, dias e slots respondem visualmente ao toque antes mesmo do resultado da acção
3. Transições (abrir/fechar sheet, navegar meses/dias) usam spring physics com feeling consistente
4. A experiência mobile corre sem stuttering visível num dispositivo Android mid-range
5. Calendários mobile funcionam correctamente em Safari iOS e Chrome Android sem bugs visuais ou funcionais

</details>

---

## v1.3 Redesign Página Espaço

**Milestone Goal:** Redesign criativo e imersivo de todas as secções da página "Espaço" (excepto Hero e CTA) — layouts não-convencionais, efeitos interactivos, animações que prendem a atenção, usando apenas as 13 fotos existentes. Inspiração de ReactBits e LightsWind.

**Phases:** 4 (Phases 9-12)
**Requirements:** 23 total (INFRA: 4, TEXT: 4, ARCH: 4, VFX: 6, POLISH: 5)
**Research:** Complete (all patterns documented, skip research for all phases)

- [x] **Phase 9: Foundation & Pitfall Prevention** — Infrastructure fixes and accessibility (COMPLETE 2026-03-15)
- [x] **Phase 10: Text Animations & Section Extraction** — Character reveals, balanced typography, component architecture (COMPLETE 2026-03-16)
- [ ] **Phase 11: Visual Redesign & Image Effects** — Creative layouts, clip-path reveals, bento grids
- [ ] **Phase 12: Polish & Interactivity** — Parallax, lightbox, magnetic cursor

---

### Phase 9: Foundation & Pitfall Prevention (COMPLETE 2026-03-15)

**Goal:** Fix critical infrastructure bugs in the existing animation system before adding new effects. Ensure Lenis-ScrollTrigger sync, React 19 concurrent safety, and legal accessibility compliance.

**Depends on:** v1.2 complete
**Requirements:** INFRA-01, INFRA-02, INFRA-03, INFRA-04
**Complexity:** MEDIUM
**Research:** SKIP (all patterns documented in research/PITFALLS.md)
**Plans:** 2 plans

Plans:
- [x] 09-01-PLAN.md — LenisProvider with ScrollTrigger sync + reduced motion support
- [x] 09-02-PLAN.md — React 19 null checks + GSAP vs Framer Motion documentation

**Success Criteria:**
1. LenisProvider calls `ScrollTrigger.update()` on every Lenis scroll frame, preventing position desync after navigation
2. Utilizador com `prefers-reduced-motion` enabled vê página Espaço sem parallax ou scroll-triggered animations (cumprindo WCAG 2.1 Level A)
3. Todos os `useGSAP` callbacks têm null checks explícitos nos refs, prevenindo crashes em React 19 concurrent rendering
4. Documentação clara no código define quando usar GSAP (scroll storytelling) vs Framer Motion (component interactions)

**Addresses Pitfalls:**
- Pitfall 1: Lenis-ScrollTrigger desync on navigation (legal blocker)
- Pitfall 5: React 19 timing bugs (crash risk)
- Pitfall 7: Missing `prefers-reduced-motion` (accessibility lawsuit risk per Decreto-Lei n.º 83/2018)

---

### Phase 10: Text Animations & Section Extraction (COMPLETE 2026-03-16)

**Goal:** Add character-reveal text animations and extract inline sections into separate component files with dynamic imports. Establish architectural foundation for creative layouts.

**Depends on:** Phase 9 (foundation fixed)
**Requirements:** TEXT-01, TEXT-02, TEXT-03, TEXT-04, ARCH-01, ARCH-02, ARCH-03, ARCH-04
**Complexity:** MEDIUM
**Research:** SKIP (patterns documented in research/STACK.md and research/ARCHITECTURE.md)
**Plans:** 3 plans

**Success Criteria:**
1. Títulos das secções revelam-se character-by-character ao entrar no viewport com animação fluida
2. Texto do manifesto usa word-level stagger reveal durante scroll
3. Headlines usam `react-wrap-balancer` para tipografia equilibrada sem linhas órfãs
4. As 4 secções (Manifesto, Estúdios, Cowork, Comodidades) existem como componentes separados em `src/components/sections/espaco/`
5. Dados estáticos (imagens, títulos, descrições) extraídos para `src/data/espacoData.ts`

**Delivers:**
- Install Splitting.js (2.5kB) + react-wrap-balancer (1kB)
- Character/word reveal components
- Section component files with dynamic imports
- Code splitting validation

---

### Phase 11: Visual Redesign & Image Effects

**Goal:** Implement creative, non-conventional layouts for Studios/Cowork/Amenities sections with GSAP clip-path image reveals. This is the core visual impact of the redesign.

**Depends on:** Phase 10 (sections extracted)
**Requirements:** VFX-01, VFX-02, VFX-03, VFX-04, VFX-05, VFX-06
**Complexity:** HIGH
**Research:** SKIP (patterns proven in existing HorizontalGallery.tsx)
**Plans:** 4-5 plans (estimated)

**Success Criteria:**
1. Imagens revelam-se com clip-path animation ao entrar no viewport (não fade simples)
2. Secção de estúdios usa layout bento grid criativo com áreas assimétricas (CSS Grid explicit areas)
3. Secção de cowork usa layout criativo diferente do estúdios (não repetir padrões)
4. Secção de comodidades tem layout e efeitos distintos das anteriores
5. IntersectionObservers reduzidos de 13 individuais para máximo 4 (1 por secção), evitando memory leaks

**Delivers:**
- `<RevealImage>` component with GSAP clip-path
- Bento grid layout for Studios section
- Creative layout for Cowork section (different from Studios)
- Creative layout for Amenities section
- Section-level `useInView` instead of per-image `whileInView`

**Addresses Pitfalls:**
- Pitfall 3: Image loading timing (loading="eager" on reveal images)
- Pitfall 6: Memory leaks from multiple IntersectionObservers

---

### Phase 12: Polish & Interactivity

**Goal:** Add desktop-only polish effects (parallax, fullscreen lightbox, magnetic cursor) with mobile-optimized alternatives. Validate 60fps performance on mid-range devices.

**Depends on:** Phase 11 (core visual redesign complete)
**Requirements:** POLISH-01, POLISH-02, POLISH-03, POLISH-04, POLISH-05
**Complexity:** MEDIUM
**Research:** SKIP for parallax/cursor, MINOR for lightbox (Framer layoutId pattern research)
**Plans:** 3-4 plans (estimated)

**Success Criteria:**
1. 2-3 hero images têm parallax subtil (máximo 15% movimento) em desktop, effect disabled em mobile
2. Utilizador clica numa imagem e vê lightbox fullscreen com AnimatePresence transition
3. Elementos interactivos em desktop têm magnetic cursor effect (Framer Motion useSpring), disabled em mobile
4. Mobile recebe versões simplificadas dos efeitos (sem parallax pesado, sem cursor magnético)
5. Performance mantém 60fps em Chrome DevTools com CPU throttle 4x (simula dispositivo mid-range)

**Delivers:**
- Parallax effect (GSAP scrub, limited to 3 images max)
- Fullscreen lightbox (Framer Motion layoutId + AnimatePresence)
- Magnetic cursor component (desktop-only)
- Mobile-specific animation reductions
- Performance profiling and optimization

**Addresses Pitfalls:**
- Pitfall 4: Mobile performance death spiral (limit parallax, test thoroughly)

---

## Phase Dependencies

```
v1.1 (Phases 1-3 complete, Phase 4 deferred)
  ↓
v1.2 (Phases 5-8 complete) ─── SHIPPED 2026-03-15
  ↓
Phase 9 (Foundation) ───── BLOCKS all other phases
  ↓
Phase 10 (Text + Extraction) ───── Enables code splitting
  ↓
Phase 11 (Visual Redesign) ───── Core gallery value
  ↓
Phase 12 (Polish) ───── Desktop enhancements
```

**Critical path:** Phase 9 must complete first (legal blocker). Phase 10 enables Phase 11 architecture. Phase 12 can be compressed if timeline tight.

---

## Traceability

### v1.2 Requirements (COMPLETE)

| Requirement | Phase | Status |
|-------------|-------|--------|
| SHEET-01 | Phase 5 | Complete |
| SHEET-02 | Phase 5 | Complete |
| SHEET-03 | Phase 5 | Complete |
| SHEET-04 | Phase 5 | Complete |
| SHEET-05 | Phase 5 | Complete |
| PERF-02 | Phase 5 | Complete |
| MCAL-01 | Phase 6 | Complete |
| MCAL-02 | Phase 6 | Complete |
| MCAL-03 | Phase 6 | Complete |
| MCAL-04 | Phase 6 | Complete |
| MCAL-05 | Phase 6 | Complete |
| HCAL-01 | Phase 7 | Complete |
| HCAL-02 | Phase 7 | Complete |
| HCAL-03 | Phase 7 | Complete |
| HCAL-04 | Phase 7 | Complete |
| HCAL-05 | Phase 7 | Complete |
| TOUCH-01 | Phase 8 | Complete |
| TOUCH-02 | Phase 8 | Complete |
| TOUCH-03 | Phase 8 | Complete |
| PERF-01 | Phase 8 | Complete |
| PERF-03 | Phase 8 | Complete |

**v1.2 Coverage:** 21/21 requirements mapped ✓

### v1.3 Requirements (ACTIVE)

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFRA-01 | Phase 9 | Pending |
| INFRA-02 | Phase 9 | Pending |
| INFRA-03 | Phase 9 | Pending |
| INFRA-04 | Phase 9 | Pending |
| TEXT-01 | Phase 10 | Pending |
| TEXT-02 | Phase 10 | Pending |
| TEXT-03 | Phase 10 | Pending |
| TEXT-04 | Phase 10 | Pending |
| ARCH-01 | Phase 10 | Pending |
| ARCH-02 | Phase 10 | Pending |
| ARCH-03 | Phase 10 | Pending |
| ARCH-04 | Phase 10 | Pending |
| VFX-01 | Phase 11 | Pending |
| VFX-02 | Phase 11 | Pending |
| VFX-03 | Phase 11 | Pending |
| VFX-04 | Phase 11 | Pending |
| VFX-05 | Phase 11 | Pending |
| VFX-06 | Phase 11 | Pending |
| POLISH-01 | Phase 12 | Pending |
| POLISH-02 | Phase 12 | Pending |
| POLISH-03 | Phase 12 | Pending |
| POLISH-04 | Phase 12 | Pending |
| POLISH-05 | Phase 12 | Pending |

**v1.3 Coverage:** 23/23 requirements mapped ✓

---

## Progress

**Execution Order:** 9 → 10 → 11 → 12 (sequential, Phase 9 blocks all)

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Schema & API | v1.1 | 2/2 | Complete | 2026-03-10 |
| 2. Cal Equip/Cowork | v1.1 | 3/3 | Complete | 2026-03-10 |
| 3. Cal Estúdio Hourly | v1.1 | 2/2 | Complete | 2026-03-10 |
| 4. Admin Dashboard | v1.1 | 0/0 | Deferred | - |
| 5. Bottom Sheet Foundation | v1.2 | 2/2 | Complete | 2026-03-15 |
| 6. Cal Mensal Mobile | v1.2 | 2/2 | Complete | 2026-03-15 |
| 7. Cal Horário Mobile | v1.2 | 2/2 | Complete | 2026-03-15 |
| 8. Feedback & Performance | v1.2 | 2/2 | Complete | 2026-03-15 |
| 9. Foundation & Pitfall Prevention | v1.3 | 2/2 | Complete | 2026-03-15 |
| 10. Text & Extraction | v1.3 | 3/3 | Complete | 2026-03-16 |
| 11. Visual Redesign | v1.3 | 0/4 | Not started | - |
| 12. Polish & Interactivity | v1.3 | 0/3 | Not started | - |

---
*Roadmap created: 2026-03-10 (v1.1)*
*Updated: 2026-03-13 (v1.2 phases added)*
*Updated: 2026-03-15 (v1.2 shipped, v1.3 phases added, Phase 9 planned)*
