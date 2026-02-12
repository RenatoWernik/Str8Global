# 🎯 Plano de Implementação - Página "Aluguel" Str8Global

**Agente:** Planner  
**Data:** 2026-02-12  
**Projeto:** Str8Global - Página de Aluguel de Equipamentos e Espaços  
**Tech Stack:** Next.js 16, React 19, TypeScript 5, Tailwind CSS v4, GSAP, Framer Motion

---

## 1. 📁 Estrutura de Arquivos

```
web-app/src/
├── app/
│   ├── aluguel/
│   │   └── page.tsx              # Página principal de aluguel
│   ├── layout.tsx                # Layout root (existente)
│   └── globals.css               # Estilos globais (existente)
│
├── components/
│   ├── animations/               # Componentes de animação reutilizáveis
│   │   ├── index.ts              # Exports
│   │   ├── TextReveal.tsx        # (existente)
│   │   ├── ScrollReveal.tsx      # NOVO - Animação de revelação com blur
│   │   ├── ShinyText.tsx         # NOVO - Texto com brilho metálico
│   │   ├── SpotlightCard.tsx     # NOVO - Card com efeito spotlight
│   │   ├── TiltedCard.tsx        # NOVO - Card com inclinação 3D
│   │   └── AnimatedTabs.tsx      # NOVO - Tabs com transições suaves
│   │
│   ├── effects/                  # Efeitos visuais
│   │   ├── index.ts              # Exports
│   │   ├── LightRays.tsx         # (existente)
│   │   ├── Silk.tsx              # (existente)
│   │   ├── VolumetricLight.tsx   # (existente)
│   │   └── AuroraBackground.tsx  # NOVO - Background aurora boreal
│   │
│   ├── ui/                       # Componentes UI reutilizáveis
│   │   ├── index.ts              # Exports
│   │   ├── PriceTag.tsx          # NOVO - Display de preço com brilho
│   │   ├── GearCard.tsx          # NOVO - Card de equipamento
│   │   ├── StudioCard.tsx        # NOVO - Card de estúdio
│   │   ├── CoworkPlanCard.tsx    # NOVO - Card de plano cowork
│   │   ├── CategoryFilter.tsx    # NOVO - Filtro de categorias
│   │   └── SectionNavigation.tsx # NOVO - Navegação entre secções
│   │
│   └── sections/                 # Secções da página
│       ├── index.ts              # Exports (atualizar)
│       ├── Hero.tsx              # (existente - referência)
│       ├── GearSection.tsx       # NOVO - Secção Gear Renting
│       ├── StudioSection.tsx     # NOVO - Secção Studio Renting
│       ├── CoworkStudioSection.tsx # NOVO - Secção Cowork + Estúdio
│       ├── CoworkSection.tsx     # NOVO - Secção Co-Work
│       ├── RentalHero.tsx        # NOVO - Hero específico da página
│       └── RentalCTA.tsx         # NOVO - Call to action final
│
├── data/
│   ├── mockData.ts               # (existente)
│   └── rentalData.ts             # (existente - dados já definidos)
│
├── hooks/
│   ├── index.ts                  # Exports
│   ├── useCursorPosition.ts      # (existente)
│   ├── useInView.ts              # (existente)
│   ├── useMediaQuery.ts          # (existente)
│   ├── useReducedMotion.ts       # (existente)
│   ├── useScrollProgress.ts      # (existente)
│   └── useSpotlight.ts           # NOVO - Hook para efeito spotlight
│
├── lib/
│   ├── utils.ts                  # (existente)
│   └── animations.ts             # NOVO - Configs de animação reutilizáveis
│
└── providers/
    ├── index.ts                  # Exports
    ├── GSAPProvider.tsx          # (existente)
    └── LenisProvider.tsx         # (existente)

# Arquivos de tipos adicionais
web-app/src/types/
├── index.ts                      # Exports
└── rental.ts                     # NOVO - Tipos específicos de aluguel
```

---

## 2. 🧩 Componentes a Implementar

### 2.1 Componentes de Animação (`components/animations/`)

#### `ScrollReveal.tsx`
```typescript
interface ScrollRevealProps {
  children: React.ReactNode;
  scrollContainerRef?: React.RefObject<HTMLElement>;
  enableBlur?: boolean;        // default: true
  baseOpacity?: number;        // default: 0.1
  baseRotation?: number;       // default: 3
  blurStrength?: number;       // default: 4
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;        // default: "bottom bottom"
  wordAnimationEnd?: string;   // default: "bottom bottom"
  delay?: number;              // default: 0
}
```
**Baseado em:** React Bits Scroll Reveal  
**Uso:** Títulos de secção, textos descritivos

---

#### `ShinyText.tsx`
```typescript
interface ShinyTextProps {
  children: React.ReactNode;
  className?: string;
  shimmerColor?: string;       // default: "#FF10F0"
  shimmerWidth?: number;       // default: 100
  duration?: number;           // default: 2 (seconds)
}
```
**Baseado em:** React Bits Shiny Text  
**Uso:** Preços destacados, títulos de destaque

---

#### `SpotlightCard.tsx`
```typescript
interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;     // default: "rgba(255, 16, 240, 0.15)"
  spotlightSize?: number;      // default: 200
  borderColor?: string;        // default: "rgba(255, 255, 255, 0.1)"
  hoverBorderColor?: string;   // default: "rgba(255, 16, 240, 0.3)"
  onClick?: () => void;
}
```
**Baseado em:** React Bits Spotlight Card  
**Uso:** Cards de equipamentos, cards de preços

---

#### `TiltedCard.tsx`
```typescript
interface TiltedCardProps {
  children: React.ReactNode;
  className?: string;
  tiltAmount?: number;         // default: 10
  glareOpacity?: number;       // default: 0.15
  scale?: number;              // default: 1.02
  perspective?: number;        // default: 1000
}
```
**Baseado em:** React Bits Tilted Card + Hover.dev Tilt Shine Card  
**Uso:** Cards de equipamentos premium, cards de estúdio

---

#### `AnimatedTabs.tsx`
```typescript
interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface AnimatedTabsProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
  tabClassName?: string;
  activeTabClassName?: string;
  contentClassName?: string;
  onChange?: (tabId: string) => void;
  // Animação
  transitionDuration?: number; // default: 0.3
  transitionType?: 'slide' | 'fade' | 'scale'; // default: 'slide'
}
```
**Baseado em:** React Spring useTransition + Lightswind Electro Border  
**Uso:** Tabs de planos (Diária/Semanal/Mensal)

---

### 2.2 Componentes UI (`components/ui/`)

#### `PriceTag.tsx`
```typescript
interface PriceTagProps {
  amount: number;
  unit: string;                // ex: "/dia", "/h"
  size?: 'sm' | 'md' | 'lg' | 'xl'; // default: 'md'
  showShimmer?: boolean;       // default: true
  className?: string;
  prefix?: string;             // default: "€"
}
```
**Dependências:** `ShinyText`  
**Baseado em:** React Bits Shiny Text  
**Uso:** Exibição de preços em todos os cards

---

#### `GearCard.tsx`
```typescript
interface GearCardProps {
  item: GearItem;              // De rentalData.ts
  category: string;            // Nome da categoria
  index?: number;              // Para animação stagger
  featured?: boolean;          // Card em destaque (maior)
  onSelect?: (item: GearItem) => void;
}

// GearItem interface (já existe em rentalData.ts):
// interface GearItem {
//   id: string;
//   name: string;
//   pricePerDay: number;
//   note?: string;
// }
```
**Dependências:** `SpotlightCard`, `TiltedCard`, `PriceTag`  
**Baseado em:** React Bits Spotlight Card + Tilted Card  
**Uso:** Grid de equipamentos

---

#### `StudioCard.tsx`
```typescript
interface StudioCardProps {
  studio: Studio;              // De rentalData.ts
  index?: number;
  featured?: boolean;
}

// Studio interface (já existe em rentalData.ts):
// interface Studio {
//   id: string;
//   name: string;
//   tiers: StudioTier[];
// }
// interface StudioTier {
//   label: string;
//   pricePerHour: number | null;
//   note?: string;
// }
```
**Dependências:** `SpotlightCard`, `PriceTag`, `AnimatedTabs`  
**Uso:** Cards de estúdios (Estúdio 1, 2, Podcast)

---

#### `CoworkPlanCard.tsx`
```typescript
type PlanType = 'starter' | 'prime' | 'premium';
type PeriodType = 'daily' | 'weekly' | 'monthly';

interface CoworkPlanCardProps {
  plan: CoworkPlan | CoworkStudioPlan; // De rentalData.ts
  type: PlanType;
  period: PeriodType;
  includes: string[];
  isPopular?: boolean;         // Destaca o plano mais popular
  index?: number;
}

// CoworkPlan interface (já existe em rentalData.ts):
// interface CoworkPlan {
//   name: string;
//   description: string;
//   daily: number | null;
//   weekly: number | null;
//   monthly: number | null;
// }
```
**Dependências:** `TiltedCard`, `PriceTag`, `ShinyText`  
**Baseado em:** Hover.dev Outline Cards + Lightswind Glowing Cards  
**Uso:** Cards de planos cowork

---

#### `CategoryFilter.tsx`
```typescript
interface Category {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: string;
  onSelect: (categoryId: string) => void;
  className?: string;
}
```
**Dependências:** Framer Motion `layoutId`  
**Uso:** Filtro de categorias na secção Gear

---

#### `SectionNavigation.tsx`
```typescript
interface NavItem {
  id: string;
  label: string;
  shortLabel: string;
}

interface SectionNavigationProps {
  items: NavItem[];
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  className?: string;
}
```
**Dependências:** Framer Motion, `useScrollProgress`  
**Uso:** Navegação fixa entre secções da página

---

### 2.3 Componentes de Efeitos (`components/effects/`)

#### `AuroraBackground.tsx`
```typescript
interface AuroraBackgroundProps {
  className?: string;
  color1?: string;             // default: "#FF10F0"
  color2?: string;             // default: "#8B00FF"
  color3?: string;             // default: "#00FFFF"
  intensity?: number;          // default: 0.3
  speed?: number;              // default: 1
}
```
**Baseado em:** Lightswind Aurora Shader  
**Uso:** Background da Hero section

---

### 2.4 Secções da Página (`components/sections/`)

#### `RentalHero.tsx`
```typescript
interface RentalHeroProps {
  title: string;
  subtitle: string;
  label: string;
  ctaText?: string;
  ctaHref?: string;
}
```
**Dependências:** `ScrollReveal`, `AuroraBackground`, `ShinyText`  
**Baseado em:** React Bits Scroll Reveal + Lightswind Aurora  
**Uso:** Hero da página de aluguel

---

#### `GearSection.tsx`
```typescript
interface GearSectionProps {
  categories: GearCategory[];  // De rentalData.ts
  copy: {
    label: string;
    title: string;
    subtitle: string;
    priceUnit: string;
  };
}
```
**Dependências:** `ScrollReveal`, `GearCard`, `CategoryFilter`, `useTrail` (React Spring)  
**Baseado em:** React Bits Bento Grid + React Spring useTrail  
**Uso:** Secção de equipamentos

---

#### `StudioSection.tsx`
```typescript
interface StudioSectionProps {
  studios: Studio[];           // De rentalData.ts
  copy: {
    label: string;
    title: string;
    subtitle: string;
    priceUnit: string;
  };
}
```
**Dependências:** `ScrollReveal`, `StudioCard`, `useSpring` (React Spring)  
**Uso:** Secção de estúdios

---

#### `CoworkStudioSection.tsx`
```typescript
interface CoworkStudioSectionProps {
  plans: CoworkStudioPlan[];   // De rentalData.ts
  includes: string[];
  copy: {
    label: string;
    title: string;
    subtitle: string;
  };
}
```
**Dependências:** `ScrollReveal`, `CoworkPlanCard`, `AnimatedTabs`  
**Uso:** Secção Cowork + Estúdio

---

#### `CoworkSection.tsx`
```typescript
interface CoworkSectionProps {
  plans: CoworkPlan[];         // De rentalData.ts
  includes: string[];
  copy: {
    label: string;
    title: string;
    subtitle: string;
  };
}
```
**Dependências:** `ScrollReveal`, `CoworkPlanCard`, `AnimatedTabs`  
**Uso:** Secção Co-Work

---

#### `RentalCTA.tsx`
```typescript
interface RentalCTAProps {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonHref?: string;
}
```
**Dependências:** `ScrollReveal`, `ShinyText`  
**Uso:** Call to action final da página

---

### 2.5 Hooks (`hooks/`)

#### `useSpotlight.ts`
```typescript
interface SpotlightState {
  x: number;
  y: number;
  isActive: boolean;
}

interface UseSpotlightOptions {
  containerRef: React.RefObject<HTMLElement>;
  enabled?: boolean;           // default: true
}

function useSpotlight(options: UseSpotlightOptions): SpotlightState;
```
**Uso:** Hook para efeito de spotlight nos cards

---

### 2.6 Utilitários (`lib/`)

#### `animations.ts`
```typescript
// Configs de animação reutilizáveis

export const springConfigs = {
  gentle: { mass: 1, tension: 120, friction: 14 },
  snappy: { mass: 1, tension: 300, friction: 20 },
  bouncy: { mass: 1, tension: 180, friction: 12 },
  slow: { mass: 2, tension: 80, friction: 20 },
};

export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const scaleOnHover = {
  scale: 1.02,
  transition: { type: 'spring', ...springConfigs.gentle },
};

// GSAP ScrollTrigger configs
export const scrollRevealConfig = {
  opacity: 0,
  y: 30,
  duration: 0.6,
  stagger: 0.1,
  ease: 'power2.out',
};
```

---

## 3. 🎨 Decisões de Design

### 3.1 Paleta de Cores

```css
/* Cores principais */
--color-primary: #000000;        /* Fundo principal */
--color-secondary: #ffffff;      /* Texto principal */
--color-accent: #FF10F0;         /* Magenta - destaque/primária */
--color-accent-hover: #e00dd6;   /* Magenta hover */

/* Variações de accent para efeitos */
--color-accent-20: rgba(255, 16, 240, 0.2);   /* Glow suave */
--color-accent-15: rgba(255, 16, 240, 0.15);  /* Spotlight */
--color-accent-10: rgba(255, 16, 240, 0.1);   /* Bordas hover */
--color-accent-05: rgba(255, 16, 240, 0.05);  /* Fundos sutis */

/* Cores de superfície */
--color-surface: #0A0A0A;        /* Cards */
--color-surface-elevated: #111111; /* Cards hover/elevados */
--color-border: #1A1A1A;         /* Bordas padrão */
--color-border-hover: #2A2A2A;   /* Bordas hover */

/* Cores de texto */
--color-text-primary: #ffffff;
--color-text-secondary: rgba(255, 255, 255, 0.7);
--color-text-tertiary: rgba(255, 255, 255, 0.5);
--color-text-muted: rgba(255, 255, 255, 0.3);
```

### 3.2 Tipografia

```css
/* Fontes */
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;

/* Escala tipográfica */
--text-hero: clamp(3rem, 8vw, 6rem);        /* 48-96px */
--text-section: clamp(2.5rem, 5vw, 4rem);   /* 40-64px */
--text-card-title: clamp(1.25rem, 2vw, 1.5rem); /* 20-24px */
--text-body: clamp(1rem, 1.5vw, 1.125rem);  /* 16-18px */
--text-small: clamp(0.875rem, 1vw, 0.9375rem); /* 14-15px */
--text-label: 0.875rem;                     /* 14px - uppercase labels */

/* Pesos */
--font-bold: 700;
--font-semibold: 600;
--font-medium: 500;
--font-regular: 400;

/* Altura de linha */
--leading-tight: 1.1;
--leading-snug: 1.3;
--leading-normal: 1.5;
--leading-relaxed: 1.7;
```

### 3.3 Espaçamentos

```css
/* Secções */
--section-padding-y: clamp(4rem, 10vw, 8rem);
--section-padding-x: clamp(1rem, 5vw, 3rem);

/* Container */
--container-max: 1400px;
--container-narrow: 1000px;

/* Grid gaps */
--gap-xs: 0.5rem;     /* 8px */
--gap-sm: 1rem;       /* 16px */
--gap-md: 1.5rem;     /* 24px */
--gap-lg: 2rem;       /* 32px */
--gap-xl: 3rem;       /* 48px */
--gap-2xl: 4rem;      /* 64px */

/* Cards */
--card-padding: clamp(1.5rem, 3vw, 2.5rem);
--card-radius: 1rem;  /* 16px */
--card-radius-lg: 1.5rem; /* 24px */
```

### 3.4 Animações

```css
/* Durações */
--duration-fast: 150ms;
--duration-base: 300ms;
--duration-slow: 500ms;
--duration-slower: 800ms;

/* Easings */
--ease-default: cubic-bezier(0.4, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

/* Stagger padrão */
--stagger-delay: 0.05s;
```

### 3.5 Sombras e Glows

```css
/* Glows com accent */
--glow-sm: 0 0 10px rgba(255, 16, 240, 0.3);
--glow-md: 0 0 20px rgba(255, 16, 240, 0.4);
--glow-lg: 0 0 40px rgba(255, 16, 240, 0.5);

/* Sombras de elevação */
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 20px rgba(0, 0, 0, 0.4);
--shadow-lg: 0 8px 40px rgba(0, 0, 0, 0.5);
```

---

## 4. 📄 Seções da Página

### 4.1 Hero Section (`RentalHero`)

**Layout:**
- Full viewport height (min-h-screen)
- Conteúdo centralizado vertical e horizontalmente
- Background: `AuroraBackground` com cores magenta/roxo/ciano
- Grid sutil animado no fundo (opcional)

**Elementos:**
1. Label pequeno com tracking wide ("ALUGUEL")
2. Título principal grande com `ScrollReveal`
3. Subtítulo com opacidade reduzida
4. CTA button com efeito de brilho

**Animações:**
- Aurora: Movimento contínuo suave
- Título: Reveal com blur no scroll/entrada
- Label: Fade in com slide da esquerda
- CTA: Scale up suave no hover com glow

---

### 4.2 Navegação de Secções (`SectionNavigation`)

**Layout:**
- Fixo na lateral direita (desktop) ou bottom (mobile)
- Indicador visual da secção ativa
- Tooltips com nomes completos

**Comportamento:**
- Atualiza automaticamente com scroll
- Click smooth scroll para a secção
- Highlight da secção ativa com accent color
- Fade in/out baseado em scroll

**Animações:**
- Indicador ativo: Scale e glow
- Transição entre itens: `layoutId` (Framer Motion)

---

### 4.3 Gear Section (`GearSection`)

**Layout:**
- Header com label, título, subtítulo
- Filtro de categorias horizontal (scrollable mobile)
- Grid de cards: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
- Layout Bento para cards featured

**Elementos por Card:**
1. Imagem/ícone do equipamento
2. Nome do equipamento
3. Badge de categoria
4. Nota opcional (ex: "com mala")
5. Preço com `ShinyText`
6. Botão de "Reservar" (aparece no hover)

**Animações:**
- Cards: Stagger reveal com `useTrail` (React Spring)
- Hover: Tilt 3D + spotlight + glare
- Preço: Brilho contínuo
- Filtro: Underline animado com `layoutId`

**Filtros:**
- Todos
- Acessórios
- Drones
- Câmeras
- Objetivas

---

### 4.4 Studio Section (`StudioSection`)

**Layout:**
- Header com informações da secção
- Grid de 3 colunas (1 coluna mobile)
- Cada card ocupa coluna completa

**Elementos por Card (`StudioCard`):**
1. Nome do estúdio (grande)
2. Lista de tiers com preços
3. Tier "sob orçamento" com destaque diferente
4. Badge de destaque para o mais popular

**Animações:**
- Cards: Entrada com fade + slide up (stagger)
- Hover: Elevação com sombra + borda glow
- Preços: Shimmer nos valores

**Tiers por Estúdio:**
- **Estúdio 1:** Equipado (40€/h) | Apoio Técnico (50€/h) | Apoio Criativo (sob orçamento)
- **Estúdio 2:** Equipado (30€/h) | Apoio Técnico (40€/h) | Apoio Criativo (sob orçamento)
- **Podcast:** Apenas Espaço (30€/h) | Equipado (70€/h) | Gravação & Edição (200€) | Pack 4 episódios (sob orçamento)

---

### 4.5 Cowork + Estúdio Section (`CoworkStudioSection`)

**Layout:**
- Header da secção
- Tabs: Diária | Semanal | Mensal
- Grid de 3 cards (planos Starter, Prime, Premium)
- Lista de "Inclui" abaixo dos cards

**Elementos por Card:**
1. Nome do plano (Starter/Prime/Premium)
2. Descrição (tipo de mesa)
3. Preço para o período selecionado
4. Badge "Mais Popular" no Prime
5. Lista de includes (ícone check)

**Tabs:**
- Animação de transição suave entre conteúdos
- Indicador ativo com glow
- LayoutId para underline animado

**Animações:**
- Troca de tabs: Crossfade ou slide
- Cards: Stagger reveal
- Preços: Contador animado ao trocar tab
- Hover: Elevação + glow

**Planos:**
| Plano | Diária | Semanal | Mensal | Descrição |
|-------|--------|---------|--------|-----------|
| Starter | 25€ (1h) | 90€ (3h) | 200€ (8h) | Mesa 180x160cm partilhada |
| Prime | 30€ (1h) | 110€ (4h) | 240€ (10h) | Mesa conferência partilhada |
| Premium | - | 130€ (7h) | 280€ (12h) | Mesa elevatória privada |

---

### 4.6 Co-Work Section (`CoworkSection`)

**Layout:**
- Similar à secção anterior
- Tabs: Diária | Semanal | Mensal
- Grid de 3 cards
- Lista de includes

**Diferenças:**
- Starter tem diária (12€)
- Premium NÃO tem diária
- Preços mais baixos (sem acesso a estúdio)

**Animações:**
- Mesmas da secção Cowork + Estúdio

**Planos:**
| Plano | Diária | Semanal | Mensal | Descrição |
|-------|--------|---------|--------|-----------|
| Starter | 12€ | 45€ | 120€ | Mesa 180x60cm partilhada |
| Prime | 15€ | 60€ | 150€ | Mesa conferência partilhada |
| Premium | - | 75€ | 180€ | Mesa elevatória privada |

---

### 4.7 CTA Section (`RentalCTA`)

**Layout:**
- Background com gradiente sutil ou efeito
- Conteúdo centralizado
- Título grande
- Subtítulo
- Botão de ação

**Elementos:**
1. Título com `ShinyText`
2. Subtítulo
3. Botão "Contactar" com spotlight effect

**Animações:**
- Entrada: Fade in + scale
- Botão: Spotlight no hover
- Background: Movimento sutil

---

### 4.8 Footer (existente)

- Usar footer padrão do site

---

## 5. ✅ Checklist de Implementação

### Fase 1: Setup e Fundação

- [ ] **1.1** Criar estrutura de pastas conforme seção 1
- [ ] **1.2** Criar/atualizar arquivos `index.ts` de exports
- [ ] **1.3** Configurar tipos adicionais em `types/rental.ts`
- [ ] **1.4** Criar `lib/animations.ts` com configs reutilizáveis
- [ ] **1.5** Criar hook `useSpotlight.ts`

### Fase 2: Componentes de Animação Base

- [ ] **2.1** Implementar `ScrollReveal.tsx`
  - [ ] Props e interface conforme especificação
  - [ ] Suporte a blur configurável
  - [ ] Integração com GSAP ScrollTrigger
  - [ ] Teste com `prefers-reduced-motion`

- [ ] **2.2** Implementar `ShinyText.tsx`
  - [ ] Efeito de shimmer CSS
  - [ ] Cores configuráveis (default: accent)
  - [ ] Animação contínua suave

- [ ] **2.3** Implementar `SpotlightCard.tsx`
  - [ ] Hook useSpotlight para tracking do cursor
  - [ ] Gradiente radial dinâmico
  - [ ] Transições suaves de cor de borda

- [ ] **2.4** Implementar `TiltedCard.tsx`
  - [ ] Cálculo de rotação baseado em mouse position
  - [ ] Efeito de glare/reflexo
  - [ ] Spring physics para suavidade
  - [ ] Reset suave ao sair

- [ ] **2.5** Implementar `AnimatedTabs.tsx`
  - [ ] Transições entre tabs (slide/fade/scale)
  - [ ] Indicador animado com layoutId
  - [ ] Suporte a conteúdo dinâmico

### Fase 3: Componentes UI

- [ ] **3.1** Implementar `PriceTag.tsx`
  - [ ] Formatação de preço (€)
  - [ ] Variações de tamanho (sm/md/lg/xl)
  - [ ] Integração com ShinyText

- [ ] **3.2** Implementar `GearCard.tsx`
  - [ ] Layout com imagem/ícone
  - [ ] Integração SpotlightCard + TiltedCard
  - [ ] Badge de categoria
  - [ ] Nota opcional
  - [ ] Preço com PriceTag

- [ ] **3.3** Implementar `StudioCard.tsx`
  - [ ] Lista de tiers
  - [ ] Preços por hora
  - [ ] Tratamento de "sob orçamento"
  - [ ] Hover effects

- [ ] **3.4** Implementar `CoworkPlanCard.tsx`
  - [ ] Badge "Mais Popular"
  - [ ] Lista de includes
  - [ ] Adaptação a diferentes períodos
  - [ ] Efeito de glow no hover

- [ ] **3.5** Implementar `CategoryFilter.tsx`
  - [ ] Scroll horizontal mobile
  - [ ] Indicador ativo animado
  - [ ] Callback onSelect

- [ ] **3.6** Implementar `SectionNavigation.tsx`
  - [ ] Detecção de secção ativa via scroll
  - [ ] Smooth scroll on click
  - [ ] Design responsivo

### Fase 4: Efeitos Visuais

- [ ] **4.1** Implementar `AuroraBackground.tsx`
  - [ ] Shader/gradiente animado
  - [ ] Cores configuráveis
  - [ ] Performance otimizada

### Fase 5: Secções da Página

- [ ] **5.1** Implementar `RentalHero.tsx`
  - [ ] Layout full viewport
  - [ ] AuroraBackground
  - [ ] ScrollReveal nos textos
  - [ ] CTA button com efeitos

- [ ] **5.2** Implementar `GearSection.tsx`
  - [ ] Integração com rentalData.ts
  - [ ] CategoryFilter funcionando
  - [ ] Grid responsivo
  - [ ] Animações de entrada (useTrail)

- [ ] **5.3** Implementar `StudioSection.tsx`
  - [ ] Grid de 3 cards
  - [ ] Cada card com tiers
  - [ ] Animações de entrada

- [ ] **5.4** Implementar `CoworkStudioSection.tsx`
  - [ ] Tabs Diária/Semanal/Mensal
  - [ ] Transições de conteúdo
  - [ ] Cards com preços atualizados

- [ ] **5.5** Implementar `CoworkSection.tsx`
  - [ ] Similar à CoworkStudio
  - [ ] Dados diferentes

- [ ] **5.6** Implementar `RentalCTA.tsx`
  - [ ] Título com brilho
  - [ ] Botão com spotlight

### Fase 6: Página Principal

- [ ] **6.1** Criar `app/aluguel/page.tsx`
  - [ ] Importar todas as secções
  - [ ] Ordenar conforme layout
  - [ ] Adicionar SectionNavigation
  - [ ] Metadata SEO

- [ ] **6.2** Testar navegação entre secções
- [ ] **6.3** Verificar responsividade mobile

### Fase 7: Otimização e Polish

- [ ] **7.1** Performance
  - [ ] Lazy loading de componentes pesados
  - [ ] Otimização de imagens
  - [ ] Code splitting

- [ ] **7.2** Acessibilidade
  - [ ] Testar com `prefers-reduced-motion`
  - [ ] Navegação por teclado
  - [ ] ARIA labels
  - [ ] Contraste de cores

- [ ] **7.3** Testes
  - [ ] Chrome/Edge
  - [ ] Firefox
  - [ ] Safari
  - [ ] Mobile (iOS/Android)

### Fase 8: Documentação

- [ ] **8.1** Atualizar exports em `components/animations/index.ts`
- [ ] **8.2** Atualizar exports em `components/ui/index.ts`
- [ ] **8.3** Atualizar exports em `components/effects/index.ts`
- [ ] **8.4** Atualizar exports em `components/sections/index.ts`
- [ ] **8.5** Documentar props complexas

---

## 6. 🔄 Dependências entre Componentes

```
┌─────────────────────────────────────────────────────────────┐
│                        PAGE (aluguel)                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │  Hero    │ │  Gear    │ │ Studio   │ │ Cowork   │ ...   │
│  │ Section  │ │ Section  │ │ Section  │ │ Sections │       │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘       │
│       │            │            │            │              │
│       ▼            ▼            ▼            ▼              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  UI COMPONENTS                        │  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐    │  │
│  │  │PriceTag │ │GearCard │ │StudioCard│ │CoworkCard│    │  │
│  │  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘    │  │
│  │       │           │           │           │          │  │
│  │       ▼           ▼           ▼           ▼          │  │
│  │  ┌──────────────────────────────────────────────────┐│  │
│  │  │            ANIMATION COMPONENTS                   ││  │
│  │  │  ScrollReveal │ ShinyText │ Spotlight │ Tilted  ││  │
│  │  │  AnimatedTabs │ etc...                            ││  │
│  │  └──────────────────────────────────────────────────┘│  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. 📋 Resumo das Bibliotecas de Animação Usadas

| Componente | Biblioteca de Origem | Uso na Página |
|------------|---------------------|---------------|
| ScrollReveal | React Bits | Títulos de secção |
| ShinyText | React Bits | Preços, títulos |
| SpotlightCard | React Bits | Cards de equipamentos |
| TiltedCard | React Bits | Cards premium |
| Aurora Shader | Lightswind | Background Hero |
| Glowing Cards | Lightswind | Cards de planos |
| 3D Perspective | Lightswind | Cards de estúdio |
| Outline Cards | Hover.dev | Cards de preços |
| Tilt Shine | Hover.dev | Hover em cards |
| useSpring | React Spring | Animações suaves |
| useTrail | React Spring | Stagger em grids |
| useTransition | React Spring | Transições de tabs |

---

**Plano criado por:** Agente Planner Str8Global  
**Baseado em:** Relatório do Agente Explorer + Convenções do Projeto  
**Status:** ✅ Pronto para implementação
