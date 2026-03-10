# Roadmap: Str8Global v1.1 — Novas Versões de Calendários

**Milestone:** v1.1
**Phases:** 4
**Requirements:** 16 mapped

---

## Phase 1: Schema & API — Suporte Horário

**Goal:** Atualizar schema Supabase e API de disponibilidade para suportar reservas por hora (estúdios) e disponibilidade por item/plano.

**Requirements:** DB-01, DB-02, DB-03

**Tasks:**
1. Adicionar colunas `start_time` (TEXT) e `end_time` (TEXT) à tabela `reservations` no Supabase
2. Atualizar `src/types/database.ts` com novos campos
3. Atualizar `src/lib/database.ts` — CRUD suporta horas, validação de conflitos de sobreposição
4. Nova rota API `GET /api/rental/availability/monthly?item_id=X&month=YYYY-MM` — retorna array de dias indisponíveis para um item
5. Nova rota API `GET /api/rental/availability/hourly?studio_id=X&date=YYYY-MM-DD` — retorna slots de hora ocupados/livres (8h-23h)
6. Atualizar rota existente `/api/rental/availability` para manter retrocompatibilidade

**Success Criteria:**
1. `start_time`/`end_time` existem na tabela e aceitam valores (ex: "10:00", "14:00")
2. API monthly retorna `{ unavailableDates: ["2026-03-15", "2026-03-16"] }` para um item específico
3. API hourly retorna `{ slots: [{ hour: "10:00", available: false, reservation: "Cliente X" }, ...] }` para um estúdio
4. Criar reserva de estúdio com horário sobreposto retorna erro 409

---

## Phase 2: Calendário Público — Equipamento & Cowork

**Goal:** Substituir o date picker atual por calendários mensais per-item/per-plan com dias indisponíveis riscados.

**Requirements:** CAL-01, CAL-02, CAL-03, CAL-04

**Tasks:**
1. Criar componente `AvailabilityCalendar` — calendário mensal com navegação, dias riscados (indisponíveis), dias passados desactivados
2. Hook `useMonthlyAvailability(itemId, month)` — fetch da API monthly, retorna set de datas indisponíveis
3. Integrar `AvailabilityCalendar` no `GearRenting` — cada card de equipamento abre calendário com disponibilidade do item
4. Integrar `AvailabilityCalendar` no componente Cowork — cada plano abre calendário com disponibilidade do plano (dia riscado = 0 spots)
5. Atualizar API monthly para suportar `plan_id` (cowork) além de `item_id` (equipamento)
6. Manter WhatsApp CTA com data seleccionada pré-preenchida

**Success Criteria:**
1. Utilizador vê calendário mensal ao clicar "Escolher data" num item de equipamento
2. Dias onde o item está reservado aparecem visivelmente riscados
3. Utilizador vê calendário mensal ao clicar "Escolher data" num plano cowork
4. Dias onde o plano tem 0 lugares aparecem riscados
5. Navegação entre meses funciona (até +90 dias)

---

## Phase 3: Calendário Público — Estúdio (Hourly)

**Goal:** Criar calendário de horas estilo Google Calendar para estúdios, permitindo ver disponibilidade por hora e pré-preencher WhatsApp.

**Requirements:** STU-01, STU-02, STU-03, STU-04, STU-05

**Tasks:**
1. Criar componente `StudioHourlyCalendar` — vista diária com grid de horas (8h-23h), slots de 1h
2. Slots ocupados aparecem coloridos com nome do cliente/reserva
3. Slots livres aparecem clicáveis com hover state
4. Navegação entre dias (setas prev/next, date picker rápido)
5. Hook `useHourlyAvailability(studioId, date)` — fetch da API hourly
6. Integrar no `StudioRenting` — cada estúdio mostra o calendário horário
7. Ao clicar slot livre → abre WhatsApp com data + hora pré-preenchida

**Success Criteria:**
1. Vista de horas 8h-23h aparece ao seleccionar estúdio
2. Horas ocupadas mostram bloco colorido com nome da reserva
3. Horas livres são clicáveis e mostram estado hover
4. Navegação entre dias funciona
5. Mensagem WhatsApp inclui data e hora seleccionada

---

## Phase 4: Dashboard Admin — Calendário Horário & Melhorias

**Goal:** Adaptar dashboard admin com calendário visual por hora para estúdios e vista por item para equipamento.

**Requirements:** ADM-01, ADM-02, ADM-03, ADM-04

**Tasks:**
1. Criar componente `AdminStudioCalendar` — vista diária/semanal com grid de horas por estúdio
2. Admin pode clicar num slot vazio para criar reserva (modal com hora início/fim pré-preenchida)
3. Admin pode clicar num bloco existente para editar/eliminar reserva
4. Formulário de reserva de estúdio inclui campos hora início e hora fim
5. Validação frontend de conflitos antes de submeter
6. Vista de equipamento no calendário admin mostra timeline por item com dias reservados
7. Atualizar página de reservas (tabela) para mostrar horas nas reservas de estúdio

**Success Criteria:**
1. Admin vê calendário diário com blocos de reserva por estúdio
2. Admin cria reserva clicando num slot vazio → modal com horas pré-preenchidas
3. Admin edita/elimina reserva clicando no bloco
4. Conflitos de horário são impedidos no frontend e no backend
5. Tabela de reservas mostra horas para reservas de estúdio

---

## Phase Dependencies

```
Phase 1 (Schema & API) → Phase 2 (Cal Público Equip/Cowork)
Phase 1 (Schema & API) → Phase 3 (Cal Público Estúdio)
Phase 2 + Phase 3 → Phase 4 (Admin Dashboard)
```

Phases 2 e 3 podem ser executadas em paralelo após Phase 1.

---
*Roadmap created: 2026-03-10*
