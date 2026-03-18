'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';
import { CTASection } from '@/components/sections/CTASection';
import { ctaCopy } from '@/data/ctaData';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const Globe = dynamic(
  () => import('@/components/ui/globe').then(mod => ({ default: mod.Globe })),
  { ssr: false, loading: () => <div className="w-full h-full" /> }
);

const ManifestoSection = dynamic(
  () => import('@/components/sections/espaco/ManifestoSection').then(mod => ({ default: mod.ManifestoSection })),
  { ssr: false, loading: () => <div className="py-24" /> }
);

const EstudiosSection = dynamic(
  () => import('@/components/sections/espaco/EstudiosSection').then(mod => ({ default: mod.EstudiosSection })),
  { ssr: false, loading: () => <div className="py-24" /> }
);

const PodcastSection = dynamic(
  () => import('@/components/sections/espaco/PodcastSection').then(mod => ({ default: mod.PodcastSection })),
  { ssr: false, loading: () => <div className="py-24" /> }
);

const CoworkSection = dynamic(
  () => import('@/components/sections/espaco/CoworkSection').then(mod => ({ default: mod.CoworkSection })),
  { ssr: false, loading: () => <div className="py-24" /> }
);

const ComodidadesSection = dynamic(
  () => import('@/components/sections/espaco/ComodidadesSection').then(mod => ({ default: mod.ComodidadesSection })),
  { ssr: false, loading: () => <div className="py-24" /> }
);

export default function EspacoPage() {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // WCAG 2.1 Level A compliance: Disable parallax for prefers-reduced-motion
  // Portuguese law (Decreto-Lei n.º 83/2018) requires motion to be optional
  const backgroundY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ['0%', '0%'] : ['0%', '30%']
  );

  return (
    <main className="min-h-screen bg-black text-white selection:bg-[var(--color-accent)] selection:text-black">

      {/* 1. HERO SECTION */}
      <section ref={containerRef} className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden min-h-[80vh] flex flex-col justify-center">
        <motion.div
          className="absolute inset-x-0 -top-20 -bottom-20 z-0 overflow-hidden flex flex-col justify-center items-center"
          style={{ y: backgroundY }}
        >
          <div className="absolute inset-x-0 top-[25%] md:top-[30%] lg:top-[25%] z-0 flex justify-center items-start pointer-events-none">
            <div className="relative w-[100%] sm:w-[120%] md:w-[200%] max-w-[600px] md:max-w-[2000px] lg:max-w-[2500px] aspect-square pointer-events-auto opacity-100">
              <Globe className="opacity-100" />
            </div>
          </div>
          <div className="absolute inset-0 bg-black/60 z-10 pointer-events-none" />
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 pointer-events-none w-full">
          <motion.span
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[var(--color-accent)] text-sm uppercase tracking-[0.3em] mb-4 block pointer-events-auto"
          >
            Ambiente e Estrutura
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6 pointer-events-auto"
          >
            O Espaço
            <span className="text-[var(--color-accent)]">&amp;</span>
            <br />A Criatividade
          </motion.h1>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
      </section>

      {/* 2-5. DYNAMIC SECTIONS */}
      <ManifestoSection />
      <EstudiosSection />
      <PodcastSection />
      <CoworkSection />
      <ComodidadesSection />

      {/* 6. CTA */}
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
