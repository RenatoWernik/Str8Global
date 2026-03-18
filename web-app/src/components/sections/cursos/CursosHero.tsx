'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cursosCopy } from '@/data/cursosData';
import dynamic from 'next/dynamic';

const Globe = dynamic(
  () => import('@/components/ui/globe').then(mod => ({ default: mod.Globe })),
  { ssr: false, loading: () => <div className="w-full h-full" /> }
);

export function CursosHero() {
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <section ref={containerRef} className="relative bg-black pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
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

      <div className="max-w-7xl mx-auto px-6 relative z-10 pointer-events-none">
        <motion.span
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[var(--color-accent)] text-sm uppercase tracking-[0.3em] mb-4 block pointer-events-auto font-medium"
        >
          {cursosCopy.hero.label}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6 pointer-events-auto"
        >
          {cursosCopy.hero.title.split('\n').map((line, i) => (
            <span key={i} className="block">{line}</span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-white/80 text-lg md:text-xl max-w-2xl pointer-events-auto font-medium drop-shadow-md"
        >
          {cursosCopy.hero.subtitle}
        </motion.p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
    </section>
  );
}

export default CursosHero;
