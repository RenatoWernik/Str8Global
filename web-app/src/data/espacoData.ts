// Static content data for the Espaço page sections
// Extracted from page.tsx for reusability and code splitting

export const estudiosImages = [
  '/images/espaco/Estudio1.jpg',
  '/images/espaco/Estudio2.jpg',
];

export const podcastImages = [
  '/images/espaco/Estudio-Podcast.jpg',
  '/images/espaco/Estudio-Podcast2.jpg',
  '/images/espaco/Estudio-Podcast3.jpg',
];

export const coworkImages = [
  { src: '/images/espaco/CoworkGeral.jpg', title: '' },
  { src: '/images/espaco/CoworkGeral2.jpg', title: '' },
  { src: '/images/espaco/Cowork-Starter.jpg', title: '' },
  { src: '/images/espaco/Cowork-Prime.jpg', title: '' },
  { src: '/images/espaco/Cowork-Premium.jpg', title: '' },
];

export const comodidadesImages = [
  { src: '/images/espaco/Sol.jpg', title: '', desc: '' },
  { src: '/images/espaco/Café.jpg', title: '', desc: '' },
  { src: '/images/espaco/Maquiagem.jpg', title: '', desc: '' },
];

export const espacoContent = {
  manifesto: '',
  estudios: {
    title: 'Estúdios Fotográficos',
    subtitle: 'Infinity Wall de 40m2.',
  },
  podcast: {
    title: 'Estúdio de Podcast',
    subtitle: '35m2 equipados com RodeCaster PRO II Bundle.',
  },
  cowork: {
    title: 'Zona de Cowork',
    subtitle: '100m2 em openspace dedicados para co-work criativo.',
  },
  comodidades: {
    title: 'Áreas Comuns',
    subtitle: 'Desfruta das nossas zonas de descanso e comodidades preparadas para ti.',
  },
};

// TypeScript types for image arrays
export type CoworkImage = { src: string; title: string };
export type ComodidadeImage = { src: string; title: string; desc: string };
