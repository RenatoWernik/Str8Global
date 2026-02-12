// Rental data for Str8Global Aluguel page

// ============================================================
// TypeScript Interfaces
// ============================================================

export interface GearItem {
  id: string;
  name: string;
  pricePerDay: number;
  note?: string;
}

export interface GearCategory {
  id: string;
  label: string;
  items: GearItem[];
}

export interface StudioTier {
  label: string;
  pricePerHour: number | null;
  note?: string;
}

export interface Studio {
  id: string;
  name: string;
  tiers: StudioTier[];
}

export interface CoworkStudioPlan {
  name: string;
  description: string;
  daily: { price: number; hours: number } | null;
  weekly: { price: number; hours: number } | null;
  monthly: { price: number; hours: number } | null;
}

export interface CoworkPlan {
  name: string;
  description: string;
  daily: number | null;
  weekly: number | null;
  monthly: number | null;
}

// ============================================================
// Section definitions for navigation
// ============================================================

export type RentalSectionId = 'gear' | 'studio' | 'cowork-studio' | 'cowork';

export interface RentalSection {
  id: RentalSectionId;
  label: string;
  shortLabel: string;
}

export const rentalSections: RentalSection[] = [
  { id: 'gear', label: 'Gear Renting', shortLabel: 'Gear' },
  { id: 'studio', label: 'Studio Renting', shortLabel: 'Estúdios' },
  { id: 'cowork-studio', label: 'Cowork + Estúdio', shortLabel: 'Cowork+Estúdio' },
  { id: 'cowork', label: 'Co-Work', shortLabel: 'Co-Work' },
];

// ============================================================
// GEAR RENTING
// ============================================================

export const gearCategories: GearCategory[] = [
  {
    id: 'acessorios',
    label: 'Acessórios',
    items: [
      { id: 'dji-rs4', name: 'DJI RS4 Pro Combo', pricePerDay: 50, note: 'com mala' },
      { id: 'flash-v480', name: 'Flash V480 Godox', pricePerDay: 10, note: 'Sony' },
      { id: 'led-rgb', name: 'LED RGB MS60C', pricePerDay: 15 },
      { id: 'smallrig', name: 'Smallrig RF10C', pricePerDay: 5 },
      { id: 'camera-cooler', name: 'Camera Cooler Ulanzi', pricePerDay: 10 },
    ],
  },
  {
    id: 'drone',
    label: 'Drone',
    items: [
      { id: 'dji-mini4', name: 'DJI Mini 4 Pro', pricePerDay: 60 },
    ],
  },
  {
    id: 'cameras',
    label: 'Câmeras',
    items: [
      { id: 'sony-a7iv', name: 'Sony A7 IV', pricePerDay: 60 },
      { id: 'sony-a6700', name: 'Sony A6700', pricePerDay: 50 },
      { id: 'dji-pocket3', name: 'DJI Osmo Pocket 3 Creator Combo', pricePerDay: 30, note: 'c/ Mic' },
      { id: 'dji-action5', name: 'DJI Osmo Action 5', pricePerDay: 15 },
    ],
  },
  {
    id: 'objetivas',
    label: 'Objetivas',
    items: [
      { id: 'sony-20mm', name: 'Sony 20mm G f1.8', pricePerDay: 25 },
      { id: 'sirui-85mm', name: 'Sirui 85mm f1.4', pricePerDay: 45 },
      { id: 'samyang-35-150', name: 'Samyang 35-150mm f2-2.8', pricePerDay: 60 },
      { id: 'sigma-17-40', name: 'Sigma 17-40mm f1.8', pricePerDay: 55 },
    ],
  },
];

// ============================================================
// STUDIO RENTING
// ============================================================

export const studios: Studio[] = [
  {
    id: 'estudio-1',
    name: 'Estúdio 1',
    tiers: [
      { label: 'Equipado', pricePerHour: 40 },
      { label: 'Com Apoio Técnico', pricePerHour: 50 },
      { label: 'Com Apoio Criativo', pricePerHour: null, note: 'sob orçamento' },
    ],
  },
  {
    id: 'estudio-2',
    name: 'Estúdio 2',
    tiers: [
      { label: 'Equipado', pricePerHour: 30 },
      { label: 'Com Apoio Técnico', pricePerHour: 40 },
      { label: 'Com Apoio Criativo', pricePerHour: null, note: 'sob orçamento' },
    ],
  },
  {
    id: 'estudio-podcast',
    name: 'Estúdio Podcast',
    tiers: [
      { label: 'Apenas Espaço', pricePerHour: 30 },
      { label: 'Equipado', pricePerHour: 70 },
      { label: 'Gravação & Edição', pricePerHour: null, note: '200€ por sessão' },
      { label: 'Pack 4 episódios', pricePerHour: null, note: 'sob orçamento' },
    ],
  },
];

// ============================================================
// COWORK + ESTÚDIO 1
// ============================================================

export const coworkStudioPlans: CoworkStudioPlan[] = [
  {
    name: 'Starter',
    description: 'Mesa 180x160cm partilhada',
    daily: { price: 25, hours: 1 },
    weekly: { price: 90, hours: 3 },
    monthly: { price: 200, hours: 8 },
  },
  {
    name: 'Prime',
    description: 'Mesa conferência partilhada',
    daily: { price: 30, hours: 1 },
    weekly: { price: 110, hours: 4 },
    monthly: { price: 240, hours: 10 },
  },
  {
    name: 'Premium',
    description: 'Mesa elevatória privada',
    daily: null,
    weekly: { price: 130, hours: 7 },
    monthly: { price: 280, hours: 12 },
  },
];

export const coworkStudioIncludes = [
  "WC's",
  'Copa',
  'Arrumação',
  'Wi-Fi',
  'Estacionamento',
  'Acesso ao estúdio mediante disponibilidade',
];

// ============================================================
// CO-WORK (standalone)
// ============================================================

export const coworkPlans: CoworkPlan[] = [
  {
    name: 'Starter',
    description: 'Mesa 180x60cm partilhada',
    daily: 12,
    weekly: 45,
    monthly: 120,
  },
  {
    name: 'Prime',
    description: 'Mesa de conferência partilhada',
    daily: 15,
    weekly: 60,
    monthly: 150,
  },
  {
    name: 'Premium',
    description: 'Mesa elevatória privada',
    daily: null,
    weekly: 75,
    monthly: 180,
  },
];

export const coworkIncludes = [
  "WC's",
  'Copa',
  'Arrumação',
  'Wi-Fi',
  'Estacionamento',
];

// ============================================================
// Page-level copy
// ============================================================

export const rentalCopy = {
  hero: {
    label: 'Aluguel',
    title: 'Equipamento & Espaço',
    subtitle:
      'Alugue equipamento profissional, estúdios equipados ou espaço de cowork. Tudo o que precisa para criar, num só lugar.',
  },
  gear: {
    label: 'Gear Renting',
    title: 'Equipamento Profissional',
    subtitle: 'Alugue câmeras, objetivas, drones e acessórios de topo ao dia.',
    priceUnit: '/dia',
  },
  studio: {
    label: 'Studio Renting',
    title: 'Estúdios Profissionais',
    subtitle: 'Espaços equipados para fotografia, vídeo e podcast — à hora.',
    priceUnit: '/h',
  },
  coworkStudio: {
    label: 'Cowork + Estúdio',
    title: 'Cowork + Estúdio 1',
    subtitle:
      'Planos combinados de cowork com acesso a estúdio. Trabalhe e crie no mesmo espaço.',
  },
  cowork: {
    label: 'Co-Work',
    title: 'Espaço Co-Work',
    subtitle: 'Espaço de trabalho flexível no coração do nosso estúdio criativo.',
  },
  cta: {
    title: 'Pronto Para Criar?',
    subtitle:
      'Entre em contacto para reservas, orçamentos personalizados ou visitar o nosso espaço.',
    button: 'Contactar',
  },
};
