// Rental data for Str8Global Aluguel page

// ============================================================
// TypeScript Interfaces
// ============================================================

export interface GearItem {
  id: string;
  name: string;
  category: 'acessorios' | 'drone' | 'cameras' | 'objetivas';
  dailyPrice: number;
  note?: string;
  image?: string;
}

// WhatsApp contact
export const WHATSAPP_NUMBER = '351933029438';
export const getWhatsAppUrl = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export type GearCategoryId = GearItem['category'];

export const gearCategoryLabels: Record<GearCategoryId, string> = {
  acessorios: 'Acessórios',
  drone: 'Drone',
  cameras: 'Câmeras',
  objetivas: 'Objetivas',
};

export interface StudioTier {
  name: string;
  price: number | null;
  priceLabel: string;
  featured?: boolean;
}

export interface Studio {
  id: string;
  name: string;
  icon: string;
  tiers: StudioTier[];
}

export type CoworkStudioPeriod = 'diaria' | 'semanal' | 'mensal';

export interface CoworkStudioPlan {
  name: string;
  description: string;
  pricing: Record<CoworkStudioPeriod, { price: number; studioHours: string } | null>;
  featured?: boolean;
}

export interface CoworkPlan {
  name: string;
  deskDescription: string;
  pricing: {
    diaria: number | null;
    semanal: number;
    mensal: number;
  };
  featured?: boolean;
}

// ============================================================
// Tab navigation
// ============================================================

export type RentalTab = 'gear' | 'studios' | 'cowork-studio' | 'cowork';

export const rentalTabs: { id: RentalTab; label: string; icon: string }[] = [
  { id: 'gear', label: 'Gear Renting', icon: 'Camera' },
  { id: 'studios', label: 'Studio Renting', icon: 'Video' },
  { id: 'cowork-studio', label: 'Cowork + Estúdio', icon: 'Building' },
  { id: 'cowork', label: 'Co-Work', icon: 'Laptop' },
];

// ============================================================
// GEAR RENTING
// ============================================================

export const gearItems: GearItem[] = [
  // Acessorios
  { id: 'dji-rs4', name: 'DJI RS4 Pro Combo', category: 'acessorios', dailyPrice: 50, note: 'com mala' },
  { id: 'flash-v480', name: 'Flash V480 Godox', category: 'acessorios', dailyPrice: 10, note: 'Sony' },
  { id: 'led-rgb', name: 'LED RGB MS60C', category: 'acessorios', dailyPrice: 15 },
  { id: 'smallrig', name: 'Smallrig RF10C', category: 'acessorios', dailyPrice: 5 },
  { id: 'camera-cooler', name: 'Camera Cooler Ulanzi', category: 'acessorios', dailyPrice: 10 },
  // Drone
  { id: 'dji-mini4', name: 'DJI Mini 4 Pro', category: 'drone', dailyPrice: 60 },
  // Cameras
  { id: 'sony-a7iv', name: 'Sony A7 IV', category: 'cameras', dailyPrice: 60 },
  { id: 'sony-a6700', name: 'Sony A6700', category: 'cameras', dailyPrice: 50 },
  { id: 'dji-pocket3', name: 'DJI Osmo Pocket 3 Creator Combo', category: 'cameras', dailyPrice: 30, note: 'c/ Mic' },
  { id: 'dji-action5', name: 'DJI Osmo Action 5', category: 'cameras', dailyPrice: 15 },
  // Objetivas
  { id: 'sony-20mm', name: 'Sony 20mm G f1.8', category: 'objetivas', dailyPrice: 25 },
  { id: 'sirui-85mm', name: 'Sirui 85mm f1.4', category: 'objetivas', dailyPrice: 45 },
  { id: 'samyang-35-150', name: 'Samyang 35-150mm f2-2.8', category: 'objetivas', dailyPrice: 60 },
  { id: 'sigma-17-40', name: 'Sigma 17-40mm f1.8', category: 'objetivas', dailyPrice: 55 },
];

// ============================================================
// STUDIO RENTING
// ============================================================

export const studios: Studio[] = [
  {
    id: 'estudio-1',
    name: 'Estúdio 1',
    icon: 'Aperture',
    tiers: [
      { name: 'Equipado', price: 40, priceLabel: '40€/h' },
      { name: 'Com Apoio Técnico', price: 50, priceLabel: '50€/h', featured: true },
      { name: 'Com Apoio Criativo', price: null, priceLabel: 'Sob orçamento' },
    ],
  },
  {
    id: 'estudio-2',
    name: 'Estúdio 2',
    icon: 'Focus',
    tiers: [
      { name: 'Equipado', price: 30, priceLabel: '30€/h' },
      { name: 'Com Apoio Técnico', price: 40, priceLabel: '40€/h', featured: true },
      { name: 'Com Apoio Criativo', price: null, priceLabel: 'Sob orçamento' },
    ],
  },
  {
    id: 'estudio-podcast',
    name: 'Estúdio Podcast',
    icon: 'Mic',
    tiers: [
      { name: 'Apenas Espaço', price: 30, priceLabel: '30€/h' },
      { name: 'Equipado', price: 70, priceLabel: '70€/h', featured: true },
      { name: 'Gravação & Edição', price: 200, priceLabel: '200€' },
      { name: 'Pack 4 episódios', price: null, priceLabel: 'Sob orçamento' },
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
    pricing: {
      diaria: { price: 25, studioHours: '1h estúdio' },
      semanal: { price: 90, studioHours: '3h estúdio' },
      mensal: { price: 200, studioHours: '8h estúdio' },
    },
  },
  {
    name: 'Prime',
    description: 'Mesa conferência partilhada',
    pricing: {
      diaria: { price: 30, studioHours: '1h estúdio' },
      semanal: { price: 110, studioHours: '4h estúdio' },
      mensal: { price: 240, studioHours: '10h estúdio' },
    },
    featured: true,
  },
  {
    name: 'Premium',
    description: 'Mesa elevatória privada',
    pricing: {
      diaria: null,
      semanal: { price: 130, studioHours: '7h estúdio' },
      mensal: { price: 280, studioHours: '12h estúdio' },
    },
  },
];

export const coworkStudioAmenities = [
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
    deskDescription: 'Mesa 180x60cm partilhada',
    pricing: { diaria: 12, semanal: 45, mensal: 120 },
  },
  {
    name: 'Prime',
    deskDescription: 'Mesa de conferência partilhada',
    pricing: { diaria: 15, semanal: 60, mensal: 150 },
    featured: true,
  },
  {
    name: 'Premium',
    deskDescription: 'Mesa elevatória privada',
    pricing: { diaria: null, semanal: 75, mensal: 180 },
  },
];

export const coworkAmenities = [
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
  },
  studio: {
    label: 'Studio Renting',
    title: 'Estúdios Profissionais',
    subtitle: 'Espaços equipados para fotografia, vídeo e podcast — à hora.',
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
