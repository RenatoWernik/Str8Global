// Rental data for Str8Global Aluguel page

// ============================================================
// TypeScript Interfaces
// ============================================================

export interface GearItem {
  id: string;
  name: string;
  category: 'acessorios' | 'drone' | 'cameras' | 'objetivas' | 'iluminacao' | 'audio';
  dailyPrice: number;
  note?: string;
  image?: string;
}

// WhatsApp contacts
export const CONTACTS = {
  IGOR: { name: 'Igor', number: '351966128922' },
  MARTA: { name: 'Marta', number: '351933029438' },
};

export const getWhatsAppUrl = (number: string, message: string) =>
  `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

export type GearCategoryId = GearItem['category'];

export const gearCategoryLabels: Record<GearCategoryId, string> = {
  cameras: 'Câmaras',
  objetivas: 'Objetivas',
  drone: 'Drones',
  iluminacao: 'Iluminação',
  audio: 'Áudio',
  acessorios: 'Acessórios & Estabilização',
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
  image?: string;
}

export type CoworkStudioPeriod = 'diaria' | 'semanal' | 'mensal';

export interface CoworkStudioPlan {
  name: string;
  description: string;
  pricing: Record<CoworkStudioPeriod, { price: number; studioHours: string } | null>;
  featured?: boolean;
  image?: string;
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
  image?: string;
}

// ============================================================
// Tab navigation
// ============================================================

export type RentalTab = 'gear' | 'studios' | 'cowork-studio' | 'cowork';

export const rentalTabs: { id: RentalTab; label: string; icon: string }[] = [
  { id: 'gear', label: 'Gear Renting', icon: 'Camera' },
  { id: 'studios', label: 'Aluguer de Estúdios', icon: 'Video' },
  { id: 'cowork-studio', label: 'Cowork + Estúdio', icon: 'Building' },
  { id: 'cowork', label: 'Co-Work', icon: 'Laptop' },
];

// ============================================================
// GEAR RENTING
// ============================================================

export const gearItems: GearItem[] = [
  // Cameras
  { id: 'sony-a7iv', name: 'Sony A7 IV', category: 'cameras', dailyPrice: 60, image: '/images/gear/sony-a7iv.png' },
  { id: 'sony-a6700', name: 'Sony A6700', category: 'cameras', dailyPrice: 50, image: '/images/gear/sony-a6700.webp' },
  { id: 'dji-pocket3', name: 'DJI Osmo Pocket 3 Creator Combo', category: 'cameras', dailyPrice: 30, note: 'c/ Mic', image: '/images/gear/dji-pocket3.png' },
  { id: 'dji-action5', name: 'DJI Osmo Action 5', category: 'cameras', dailyPrice: 15, image: '/images/gear/dji-action5.png' },

  // Objetivas
  { id: 'sony-20mm', name: 'Sony 20mm G f1.8', category: 'objetivas', dailyPrice: 25, image: '/images/gear/sony-20mm.webp' },
  { id: 'sirui-85mm', name: 'Sirui 85mm f1.4', category: 'objetivas', dailyPrice: 45, image: '/images/gear/sirui-85mm.png' },
  { id: 'samyang-35-150', name: 'Samyang 35-150mm f2-2.8', category: 'objetivas', dailyPrice: 60, image: '/images/gear/samyang-35-150.png' },
  { id: 'sigma-17-40', name: 'Sigma 17-40mm f1.8', category: 'objetivas', dailyPrice: 55, image: '/images/gear/sigma-17-40.png' },

  // Drone
  { id: 'dji-mini4', name: 'DJI Mini 4 Pro', category: 'drone', dailyPrice: 60, image: '/images/gear/dji-mini4.png' },

  // Iluminação
  { id: 'flash-v480', name: 'Flash V480 Godox', category: 'iluminacao', dailyPrice: 10, note: 'Sony', image: '/images/gear/flash-v480.png' },
  { id: 'led-rgb', name: 'LED RGB MS60C', category: 'iluminacao', dailyPrice: 15, image: '/images/gear/led-rgb.png' },
  { id: 'smallrig', name: 'Smallrig RF10C', category: 'iluminacao', dailyPrice: 10, image: '/images/gear/smallrig.png' },
  { id: 'smallrig-p96', name: 'Smallrig LED P96', category: 'iluminacao', dailyPrice: 5, image: '/images/gear/smallrig-p96-final.png' },

  // Áudio
  { id: 'dji-mic-2tx', name: 'DJI Mic Mini (2TX + 1RX + Case)', category: 'audio', dailyPrice: 20, image: '/images/gear/dji-mic-2tx.png' },
  { id: 'dji-mic-1tx', name: 'DJI Mic Mini (1TX + 1RX)', category: 'audio', dailyPrice: 15, image: '/images/gear/dji-mic-1tx.png' },
  { id: 'boya-shotgun', name: 'Boya Shotgun Mic', category: 'audio', dailyPrice: 10 },

  // Acessórios & Estabilização
  { id: 'dji-rs4', name: 'DJI RS4 Pro Combo', category: 'acessorios', dailyPrice: 50, note: 'com mala', image: '/images/gear/dji-rs4.png' },
  { id: 'camera-cooler', name: 'Camera Cooler Ulanzi', category: 'acessorios', dailyPrice: 10, image: '/images/gear/camera-cooler.png' },
  { id: 'knf-tripod', name: 'K&F Tripé Básico', category: 'acessorios', dailyPrice: 10 },
  { id: 'knf-cstand', name: 'K&F Tripé C-Stand 3m', category: 'acessorios', dailyPrice: 15 },
];

// ============================================================
// STUDIO RENTING
// ============================================================

export const studios: Studio[] = [
  {
    id: 'estudio-1',
    name: 'Estúdio 1',
    icon: 'Aperture',
    image: '/images/studio/studio-01.jpg',
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
    image: '/images/studio/studio-02.jpg',
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
    image: '/images/studio/studio-03.jpg',
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
    image: '/images/studio/studio-01.jpg',
    pricing: {
      diaria: { price: 25, studioHours: '1h estúdio' },
      semanal: { price: 90, studioHours: '3h estúdio' },
      mensal: { price: 200, studioHours: '8h estúdio' },
    },
  },
  {
    name: 'Prime',
    description: 'Mesa conferência partilhada',
    image: '/images/studio/studio-01.jpg',
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
    image: '/images/studio/studio-01.jpg',
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
    image: '/images/studio/studio-04.jpg',
    pricing: { diaria: 12, semanal: 45, mensal: 120 },
  },
  {
    name: 'Prime',
    deskDescription: 'Mesa de conferência partilhada',
    image: '/images/studio/studio-04.jpg',
    pricing: { diaria: 15, semanal: 60, mensal: 150 },
    featured: true,
  },
  {
    name: 'Premium',
    deskDescription: 'Mesa elevatória privada',
    image: '/images/studio/studio-04.jpg',
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
    label: 'Aluguer',
    title: 'Equipamento & Espaço',
    subtitle:
      'Não precisa de comprar o melhor gear do mercado. Precisa é de o usar. Alugue equipamento pro, estúdios de topo e espaço cowork — tudo num lugar só.',
  },
  gear: {
    label: 'Aluguer de Equipamento',
    title: 'Gear De Combate',
    subtitle: 'O arsenal que usamos nos nossos próprios projectos — agora disponível para si. Sem gear medíocre, sem surpresas.',
  },
  studio: {
    label: 'Aluguer de Estúdios',
    title: 'Estúdios Que Impressionam',
    subtitle: 'Fotografar na sala de estar ou no nosso estúdio — o seu cliente nota a diferença. À hora, equipados, prontos.',
  },
  coworkStudio: {
    label: 'Cowork + Estúdio',
    title: 'Cowork + Estúdio',
    subtitle:
      'Trabalhe, crie e produza sem sair do edifício. O melhor dos dois mundos para quem leva a sério o que faz.',
  },
  cowork: {
    label: 'Co-Work',
    title: 'O Seu QG Criativo',
    subtitle: 'Mais do que uma mesa — é a energia de estar rodeado de quem cria todos os dias. Flexível, sem burocracia.',
  },
  cta: {
    title: 'Pronto Para Começar?',
    subtitle:
      'Reserve, visite ou peça orçamento. O pior que pode acontecer é ficar impressionado.',
    button: 'Contactar',
  },
};
