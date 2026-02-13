import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Serviços — Str8Global',
  description: 'Serviços de marketing, fotografia e vídeo premium. Estratégia, conteúdo e produção pela Str8Global.',
  openGraph: {
    title: 'Serviços — Str8Global',
    description: 'Serviços de marketing, fotografia e vídeo premium.',
    url: 'https://str8global.com/servicos',
  },
};

export default function ServicosPage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center bg-black px-6">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--color-accent)] rounded-full blur-[200px] opacity-[0.06]" />
      <div className="relative z-10 text-center max-w-lg">
        <h1 className="text-5xl md:text-7xl font-bold mb-4">Serviços</h1>
        <p className="text-white/50 text-lg mb-8">
          Em breve — estamos a preparar algo especial.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-8 py-3 bg-[var(--color-accent)] text-black font-bold rounded-full hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          Voltar ao Início
        </Link>
      </div>
    </main>
  );
}
