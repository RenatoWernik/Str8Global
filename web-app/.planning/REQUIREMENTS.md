# Requirements: Str8Global

**Defined:** 2026-03-10
**Core Value:** Owners manage rentals from one dashboard; customers see availability instantly.

## v1.1 Requirements

### Calendário Público — Equipamento & Cowork

- [ ] **CAL-01**: Ao clicar "Escolher data" num item de equipamento, abre calendário mensal que mostra dias indisponíveis riscados para aquele item específico
- [ ] **CAL-02**: Ao clicar "Escolher data" num plano cowork, abre calendário mensal que mostra dias lotados riscados (0 lugares disponíveis nesse plano)
- [ ] **CAL-03**: Utilizador pode navegar entre meses no calendário (até +90 dias)
- [ ] **CAL-04**: Dias passados aparecem desactivados (não seleccionáveis)

### Calendário Público — Estúdio

- [ ] **STU-01**: Ao seleccionar estúdio, abre calendário diário com vista de horas (8h-23h, slots de 1h) estilo Google Calendar
- [ ] **STU-02**: Horas ocupadas aparecem visualmente bloqueadas/coloridas com nome da reserva
- [ ] **STU-03**: Horas livres aparecem claramente disponíveis e clicáveis
- [ ] **STU-04**: Utilizador pode navegar entre dias no calendário de horas
- [ ] **STU-05**: Ao clicar numa hora disponível, a mensagem WhatsApp pré-preenche com a data e hora seleccionada

### Dashboard Admin

- [ ] **ADM-01**: Vista calendário visual por hora para estúdios (diária/semanal) onde admin vê blocos de reservas
- [ ] **ADM-02**: Admin pode criar reserva de estúdio com hora início e hora fim
- [ ] **ADM-03**: Admin pode editar/eliminar reservas de estúdio com horas
- [ ] **ADM-04**: Calendário admin para equipamento mostra dias com reservas activas por item

### Base de Dados — Supabase

- [ ] **DB-01**: Tabela `reservations` suporta campos `start_time` e `end_time` para reservas por hora (estúdios)
- [ ] **DB-02**: API de disponibilidade retorna disponibilidade por dia (equipamento/cowork) E por hora (estúdios)
- [ ] **DB-03**: Validação de conflitos de horário ao criar reserva de estúdio (sem sobreposição)

## v2 Requirements

### Melhorias Futuras

- **FUT-01**: Reserva online com pagamento integrado
- **FUT-02**: Notificações automáticas por email
- **FUT-03**: Dashboard analytics para ocupação por hora dos estúdios

## Out of Scope

| Feature | Reason |
|---------|--------|
| Checkout/pagamento online | Reservas continuam via WhatsApp |
| Notificações/emails automáticos | Workflow actual não necessita |
| Multi-idioma | Site é só PT-PT |
| App mobile nativa | Web-first |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DB-01 | Phase 1 | Pending |
| DB-02 | Phase 1 | Pending |
| DB-03 | Phase 1 | Pending |
| CAL-01 | Phase 2 | Pending |
| CAL-02 | Phase 2 | Pending |
| CAL-03 | Phase 2 | Pending |
| CAL-04 | Phase 2 | Pending |
| STU-01 | Phase 3 | Pending |
| STU-02 | Phase 3 | Pending |
| STU-03 | Phase 3 | Pending |
| STU-04 | Phase 3 | Pending |
| STU-05 | Phase 3 | Pending |
| ADM-01 | Phase 4 | Pending |
| ADM-02 | Phase 4 | Pending |
| ADM-03 | Phase 4 | Pending |
| ADM-04 | Phase 4 | Pending |

**Coverage:**
- v1.1 requirements: 16 total
- Mapped to phases: 16
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-10*
*Last updated: 2026-03-10 after initial definition*
