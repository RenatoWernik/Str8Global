// Static content data for the Espaço page sections
// Extracted from page.tsx for reusability and code splitting

export const estudiosImages = [
  '/images/espaco/Estudio1.jpg',
  '/images/espaco/Estudio2.jpg',
  '/images/espaco/Estudio-Podcast.jpg',
  '/images/espaco/Estudio-Podcast2.jpg',
  '/images/espaco/Estudio-Podcast3.jpg',
];

export const coworkImages = [
  { src: '/images/espaco/CoworkGeral.jpg', title: 'Open Space Geral' },
  { src: '/images/espaco/CoworkGeral2.jpg', title: 'Perspetiva do Espaço' },
  { src: '/images/espaco/Cowork-Starter.jpg', title: 'Plano Starter' },
  { src: '/images/espaco/Cowork-Prime.jpg', title: 'Plano Prime' },
  { src: '/images/espaco/Cowork-Premium.jpg', title: 'Lugar Premium' },
];

export const comodidadesImages = [
  { src: '/images/espaco/Sol.jpg', title: 'Pátio & Sol', desc: 'Luz natural e uma área exterior para inspirar as suas pausas e repouso.' },
  { src: '/images/espaco/Café.jpg', title: 'Coffee Break', desc: 'Networking natural numa zona de descontração planeada para mentes criativas.' },
  { src: '/images/espaco/Maquiagem.jpg', title: 'Camarim', desc: 'Cuidado ao detalhe antes de qualquer entrada em cena ou gravação intensiva.' },
];

export const espacoContent = {
  manifesto: 'Descubra a infraestrutura que transforma as melhores ideias em produções de alto nível.',
  estudios: {
    title: 'Estúdios Nível Cinema',
    subtitle: 'Ambientes desenhados milimetricamente para absorção acústica e iluminação perfeita. O habitat natural das produções premium.',
  },
  cowork: {
    title: 'Zonas de Cowork',
    subtitle: 'Open space sofisticado para equipas dinâmicas. Silêncio quando necessário, colaboração quando exigido. A elite criativa reúne-se aqui.',
  },
  comodidades: {
    title: 'O Toque Premium',
    subtitle: 'Trabalho de excelência exige pausas à altura. Desfrute das nossas zonas de descanso e comodidades preparadas para si.',
  },
};

// TypeScript types for image arrays
export type CoworkImage = { src: string; title: string };
export type ComodidadeImage = { src: string; title: string; desc: string };
