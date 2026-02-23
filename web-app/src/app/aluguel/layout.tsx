import type { Metadata } from 'next';

export const metadata: Metadata = {
  title:
    'Aluguer de Equipamento Fotográfico, Estúdios e Cowork em Lisboa | Str8Global',
  description:
    'Alugue equipamento fotográfico profissional, estúdios de fotografia e podcast totalmente equipados e espaço cowork criativo em Lisboa. Câmaras Sony, drones DJI, iluminação, áudio — gear de cinema disponível ao dia. Estúdios com apoio técnico e criativo.',
  keywords: [
    'aluguer equipamento fotográfico lisboa',
    'aluguer câmara profissional lisboa',
    'alugar estúdio fotografia lisboa',
    'estúdio podcast para alugar lisboa',
    'aluguer drone lisboa',
    'alugar equipamento de vídeo lisboa',
    'estúdio de fotografia cascais',
    'cowork criativo lisboa',
    'espaço cowork lisboa',
    'aluguer iluminação profissional lisboa',
    'estúdio de gravação lisboa',
    'alugar gimbal lisboa',
    'gear rental lisboa portugal',
    'aluguer equipamento audiovisual cascais',
    'coworking para criadores lisboa',
  ],
  openGraph: {
    title:
      'Aluguer de Equipamento, Estúdios e Cowork em Lisboa | Str8Global',
    description:
      'Gear profissional de cinema, estúdios de fotografia e podcast equipados, e cowork criativo — tudo num hub em Lisboa. Reserve já.',
    url: 'https://str8global.com/aluguel',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Str8Global — Aluguer de Equipamento e Estúdios em Lisboa',
      },
    ],
  },
  alternates: {
    canonical: 'https://str8global.com/aluguel',
  },
};

export default function AluguelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
