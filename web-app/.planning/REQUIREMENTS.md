# Requirements: Str8Global

**Defined:** 2026-03-15
**Core Value:** Owners manage rentals from one dashboard; customers see availability instantly.

## v1.3 Requirements

Requirements for Espaço page creative redesign. Each maps to roadmap phases.

### Fundação & Acessibilidade

- [ ] **INFRA-01**: LenisProvider sincroniza com ScrollTrigger.update() em cada frame
- [ ] **INFRA-02**: Todas as animações scroll respeitam prefers-reduced-motion (desactivam parallax, reveals simplificados)
- [ ] **INFRA-03**: useGSAP callbacks têm null checks explícitos nos refs (React 19 concurrent safety)
- [ ] **INFRA-04**: Separação documentada GSAP vs Framer Motion (GSAP = scroll storytelling, FM = component interactions)

### Animações de Texto

- [ ] **TEXT-01**: Títulos das secções revelam-se character-by-character ao entrar no viewport (Splitting.js + GSAP)
- [ ] **TEXT-02**: Texto do manifesto usa word-level stagger reveal ao fazer scroll
- [ ] **TEXT-03**: Headlines usam react-wrap-balancer para tipografia equilibrada
- [ ] **TEXT-04**: Animações de texto desactivam graciosamente com prefers-reduced-motion

### Layout & Arquitectura

- [ ] **ARCH-01**: Secções extraídas para componentes separados em src/components/sections/espaco/
- [ ] **ARCH-02**: Dados estáticos (imagens, títulos) extraídos para src/data/espacoData.ts
- [ ] **ARCH-03**: Secções carregadas via dynamic import com ssr: false para lazy-loading
- [ ] **ARCH-04**: Cada secção gere o seu próprio scroll hook independentemente (loose coupling)

### Galeria & Efeitos Visuais

- [ ] **VFX-01**: Imagens revelam-se com clip-path animation ao entrar no viewport (GSAP ScrollTrigger)
- [ ] **VFX-02**: Layout bento grid criativo para secção de estúdios (CSS Grid com áreas assimétricas)
- [ ] **VFX-03**: Layout criativo não-convencional para secção de cowork (diferente do estúdios)
- [ ] **VFX-04**: Secção de comodidades com layout e efeitos distintos das anteriores
- [ ] **VFX-05**: Imagens usam loading="eager" quando dentro de scroll reveal effects
- [ ] **VFX-06**: IntersectionObservers reduzidos de 13 para máximo 4 (1 por secção)

### Polish & Interactividade

- [ ] **POLISH-01**: Parallax em 2-3 imagens hero com GSAP scrub (máximo 15% de movimento)
- [ ] **POLISH-02**: Lightbox fullscreen ao clicar numa imagem (Framer Motion layoutId + AnimatePresence)
- [ ] **POLISH-03**: Magnetic cursor em elementos interactivos (desktop-only, Framer Motion useSpring)
- [ ] **POLISH-04**: Mobile recebe versão simplificada dos efeitos (sem parallax pesado, sem cursor magnético)
- [ ] **POLISH-05**: Performance mantém 60fps em dispositivo mid-range com CPU throttle 4x

## v2 Requirements

### Melhorias Futuras Espaço

- **ESP-FUT-01**: Horizontal scroll section para estúdios (GSAP pin + horizontal)
- **ESP-FUT-02**: Magnetic image hover com distortion effect
- **ESP-FUT-03**: Gradient text animation nos títulos
- **ESP-FUT-04**: Swipe gallery carousel (embla-carousel)
- **ESP-FUT-05**: 3D tilt effects nas imagens (Three.js)

### Admin Dashboard (diferido de v1.1)

- **ADM-01**: Admin hourly calendar view for studios
- **ADM-02**: Create studio reservation with start/end time
- **ADM-03**: Edit/delete studio reservations with hours
- **ADM-04**: Equipment calendar shows days with active reservations per item

## Out of Scope

| Feature | Reason |
|---------|--------|
| Novas fotografias | Usar apenas as 13 existentes |
| Alterações à Hero Section | Permanece 100% intacta (Globe 3D + título) |
| Alterações ao CTA Section | Permanece actual |
| Auto-playing video backgrounds | Heavy bandwidth, accessibility issues |
| Infinite scroll | Só 13 fotos, previne acesso ao footer |
| 3D WebGL scenes complexas | Over-engineered para portfolio |
| Music/sound effects | Jarring, accessibility violation |
| Cursor trail effects | Distracting, dated |
| locomotive-scroll | Conflita com Lenis existente |
| react-parallax | Outdated, conflita com GSAP |
| Swiper | 50kB, conflita com Lenis |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFRA-01 | Phase 9 | Complete |
| INFRA-02 | Phase 9 | Complete |
| INFRA-03 | Phase 9 | Complete |
| INFRA-04 | Phase 9 | Complete |
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

**Coverage:**
- v1.3 requirements: 23 total
- Mapped to phases: 23/23 ✓
- Unmapped: 0

---
*Requirements defined: 2026-03-15*
*Last updated: 2026-03-15 after roadmap creation (traceability updated)*
