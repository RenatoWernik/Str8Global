import type { Metadata } from 'next';

export const metadata: Metadata = {
  title:
    'Portfólio — Fotografia Profissional e Produção de Vídeo em Lisboa e Cascais | Str8Global',
  description:
    'Veja o portfólio da Str8Global: fotografia profissional, produção de vídeo cinematográfico e conteúdo visual premium em Lisboa e Cascais. Fotografia comercial, desportiva, imobiliária, eventos e marcas pessoais. Resultados visuais que dominam o mercado.',
  keywords: [
    'portfólio fotografia profissional lisboa',
    'portfólio produção de vídeo lisboa',
    'fotografia comercial lisboa',
    'fotografia profissional cascais',
    'produção de vídeo cascais',
    'fotografia de eventos lisboa',
    'fotografia desportiva portugal',
    'fotografia de produto lisboa',
    'vídeo comercial lisboa',
    'conteúdo visual premium portugal',
    'fotografia para marcas lisboa',
    'fotografia imobiliária cascais',
    'produção audiovisual lisboa',
  ],
  openGraph: {
    title:
      'Portfólio Str8Global — Fotografia e Produção de Vídeo Premium | Lisboa e Cascais',
    description:
      'Fotografia profissional e produção de vídeo cinematográfico para marcas ambiciosas. Veja o nosso trabalho em Lisboa e Cascais.',
    url: 'https://str8global.com/portfolio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Portfólio Str8Global — Fotografia e Vídeo Premium em Lisboa e Cascais',
      },
    ],
  },
  alternates: {
    canonical: 'https://str8global.com/portfolio',
  },
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
