import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Espaço Criativo — Coworking, Estúdios e Hub Criativo a Servir Lisboa e Cascais',
  description:
    'Hub criativo premium com coworking, estúdio de fotografia, estúdio de podcast e salas de reunião a servir Lisboa e Cascais. O espaço onde marcas ambiciosas nascem, criam e dominam o mercado.',
  keywords: [
    'coworking criativo lisboa',
    'espaço coworking cascais',
    'hub criativo lisboa',
    'estúdio fotografia aluguer lisboa',
    'estúdio podcast lisboa',
    'sala reunião criativa lisboa',
  ],
  openGraph: {
    title: 'Espaço Criativo — Str8Global | Hub Criativo Premium',
    description:
      'Hub criativo premium com coworking, estúdios e salas de reunião a servir Lisboa e Cascais.',
    url: 'https://str8global.com/espaco',
  },
  alternates: {
    canonical: '/espaco',
  },
};

export default function EspacoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
