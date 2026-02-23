import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Serviços — Agência de Marketing, Fotografia e Produção de Vídeo a Servir Lisboa e Cascais',
  description:
    'Serviços de marketing digital, fotografia premium, produção de vídeo cinematográfico, estúdio de podcast e gestão de redes sociais a servir Lisboa e Cascais. O ecossistema completo para marcas que querem dominar.',
  keywords: [
    'serviços marketing digital lisboa',
    'agência marketing cascais',
    'fotografia profissional lisboa',
    'produção vídeo cinematográfico lisboa',
    'gestão redes sociais cascais',
    'estúdio podcast lisboa',
    'filmagem drone portugal',
    'branding lisboa',
  ],
  openGraph: {
    title: 'Serviços — Str8Global | Marketing, Fotografia e Vídeo Premium',
    description:
      'Serviços de marketing, fotografia e produção de vídeo premium a servir Lisboa e Cascais.',
    url: 'https://str8global.com/servicos',
  },
  alternates: {
    canonical: '/servicos',
  },
};

export default function ServicosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
