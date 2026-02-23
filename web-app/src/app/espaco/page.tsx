'use client';

import Link from 'next/link';
import { CTASection } from '@/components/sections/CTASection';
import { ctaCopy } from '@/data/ctaData';

export default function EspacoPage() {
  return (
    <main className="relative min-h-screen bg-black">
      <div className="relative flex items-center justify-center min-h-[60vh] px-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--color-accent)] rounded-full blur-[200px] opacity-[0.06]" />
        <div className="relative z-10 text-center max-w-lg">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">Espaço</h1>
          <p className="text-white/70 text-lg mb-8">
            Em breve — estamos a preparar algo especial.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-8 py-3 bg-[var(--color-accent)] text-black font-bold rounded-full hover:bg-[var(--color-accent-hover)] transition-colors"
          >
            Voltar ao Início
          </Link>
        </div>
      </div>

      <CTASection
        badge={ctaCopy.espaco.badge}
        headline={ctaCopy.espaco.headline}
        subtitle={ctaCopy.espaco.subtitle}
        buttonText={ctaCopy.espaco.buttonText}
        buttonHref={ctaCopy.espaco.buttonHref}
      />
    </main>
  );
}
