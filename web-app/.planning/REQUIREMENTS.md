# Requirements: Str8Global

**Defined:** 2026-03-13
**Core Value:** Owners manage rentals from one dashboard; customers see availability instantly.

## v1.2 Requirements

### Bottom Sheet — Fundação Mobile

- [ ] **SHEET-01**: Ao abrir calendário em mobile (<768px), aparece bottom sheet fullscreen com drag handle no topo
- [ ] **SHEET-02**: Utilizador pode fechar o bottom sheet com swipe para baixo (velocity-based dismiss)
- [ ] **SHEET-03**: Bottom sheet respeita safe areas do dispositivo (notch, home indicator)
- [ ] **SHEET-04**: Bottom sheet tem snap points (meio e fullscreen) para controlo granular
- [ ] **SHEET-05**: Abertura do bottom sheet pausa Lenis smooth scroll e bloqueia scroll do body

### Calendário Mensal Mobile — Equipamento & Cowork

- [ ] **MCAL-01**: Grid de dias do mês dentro do bottom sheet com touch targets mínimos de 44x44px
- [ ] **MCAL-02**: Swipe horizontal entre meses (esquerda = próximo, direita = anterior)
- [ ] **MCAL-03**: Estados visuais claros: indisponível (strikethrough), hoje (accent dot), seleccionado (accent fill), passado (dimmed)
- [ ] **MCAL-04**: Animação de transição spring entre meses ao navegar (swipe ou botões)
- [ ] **MCAL-05**: Botão "Hoje" acessível na thumb-zone (parte inferior do sheet)

### Calendário Horário Mobile — Estúdios

- [ ] **HCAL-01**: Slots horários agrupados por período (Manhã/Tarde/Noite) dentro do bottom sheet fullscreen
- [ ] **HCAL-02**: Quick time filter pills (Manhã, Tarde, Noite) que fazem scroll automático para o período
- [ ] **HCAL-03**: Swipe horizontal entre dias (esquerda = próximo dia, direita = dia anterior)
- [ ] **HCAL-04**: Summary bar persistente no fundo do sheet mostrando data + hora seleccionada + CTA WhatsApp
- [ ] **HCAL-05**: Touch targets mínimos de 44x44px em cada slot horário

### Interacção & Feedback

- [ ] **TOUCH-01**: Haptic feedback (Vibration API) ao seleccionar data ou slot horário (com feature detection)
- [ ] **TOUCH-02**: Tap feedback visual imediato (scale + glow) em todos os elementos interactivos
- [ ] **TOUCH-03**: Animações spring physics em todas as transições mobile (open, close, navigate)

### Performance & Compatibilidade

- [ ] **PERF-01**: Sem frame drops visíveis em dispositivos Android mid-range ao animar bottom sheet
- [ ] **PERF-02**: Desktop calendar code permanece 100% inalterado (zero regressões)
- [ ] **PERF-03**: Funciona correctamente em Safari iOS e Chrome Android (browsers primários)

## v2 Requirements

### Melhorias Futuras Mobile

- **FUT-01**: Mini calendar colapsado inline (preview sem abrir sheet)
- **FUT-02**: Visual density heat maps (cores por ocupação)
- **FUT-03**: Optimistic UI updates na selecção
- **FUT-04**: Landscape mode optimizado
- **FUT-05**: @use-gesture/react para gestos avançados (se validado em user testing)

### Admin Dashboard (diferido de v1.1)

- **ADM-01**: Admin hourly calendar view for studios
- **ADM-02**: Create studio reservation with start/end time
- **ADM-03**: Edit/delete studio reservations with hours
- **ADM-04**: Equipment calendar shows days with active reservations per item

## Out of Scope

| Feature | Reason |
|---------|--------|
| App nativa (iOS/Android) | Projecto é web-first, Next.js |
| Widgets nativos do smartphone | Impossível em web app |
| Notificações push ricas | Service Workers demasiado pesado para este caso |
| Geolocalização | Irrelevante para selecção de datas/horas |
| Modo offline | APIs de disponibilidade precisam de dados em tempo real |
| Criação de eventos pelo utilizador | Calendários são só para visualizar disponibilidade + reservar via WhatsApp |
| Alterações ao desktop | Versão desktop está aprovada e intocável |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SHEET-01 | — | Pending |
| SHEET-02 | — | Pending |
| SHEET-03 | — | Pending |
| SHEET-04 | — | Pending |
| SHEET-05 | — | Pending |
| MCAL-01 | — | Pending |
| MCAL-02 | — | Pending |
| MCAL-03 | — | Pending |
| MCAL-04 | — | Pending |
| MCAL-05 | — | Pending |
| HCAL-01 | — | Pending |
| HCAL-02 | — | Pending |
| HCAL-03 | — | Pending |
| HCAL-04 | — | Pending |
| HCAL-05 | — | Pending |
| TOUCH-01 | — | Pending |
| TOUCH-02 | — | Pending |
| TOUCH-03 | — | Pending |
| PERF-01 | — | Pending |
| PERF-02 | — | Pending |
| PERF-03 | — | Pending |

**Coverage:**
- v1.2 requirements: 21 total
- Mapped to phases: 0
- Unmapped: 21 ⚠️

---
*Requirements defined: 2026-03-13*
*Last updated: 2026-03-13 after initial definition*
