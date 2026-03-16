'use client';

import { BlurText } from '@/components/animations/BlurText';
import { espacoContent } from '@/data/espacoData';

export function ManifestoSection() {
  return (
    <section className="relative py-24 px-6 border-b border-white/5 bg-black z-20">
      <div className="max-w-4xl mx-auto text-center">
        <BlurText
          text={espacoContent.manifesto}
          delay={0.05}
          className="text-3xl md:text-5xl font-light text-white/90 leading-tight justify-center"
        />
      </div>
    </section>
  );
}
