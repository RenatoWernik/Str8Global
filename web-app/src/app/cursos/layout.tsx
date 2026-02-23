import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cursos de Marketing, Fotografia e Conteúdo Digital — Formação Premium a Servir Lisboa e Cascais',
  description:
    'Cursos práticos de marketing digital, fotografia profissional e produção de conteúdo a servir Lisboa e Cascais. Formação premium leccionada por profissionais com resultados comprovados em marcas líderes de mercado.',
  keywords: [
    'cursos de marketing digital lisboa',
    'cursos de fotografia lisboa',
    'formação marketing cascais',
    'cursos produção de conteúdo lisboa',
    'workshop fotografia profissional',
    'cursos redes sociais lisboa',
  ],
  openGraph: {
    title: 'Cursos — Str8Global | Formação Premium em Marketing e Fotografia',
    description:
      'Cursos práticos de marketing digital, fotografia profissional e produção de conteúdo a servir Lisboa e Cascais.',
    url: 'https://str8global.com/cursos',
  },
  alternates: {
    canonical: '/cursos',
  },
};

export default function CursosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
