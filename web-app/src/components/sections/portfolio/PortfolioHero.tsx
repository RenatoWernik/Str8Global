'use client';

import { motion } from 'framer-motion';
import AuroraBackground from '@/components/effects/AuroraBackground';
import { Globe } from '@/components/ui/globe';
import ShinyText from '@/components/animations/ShinyText';

export function PortfolioHero() {
  return (
    <section className="relative bg-black pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 z-0 opacity-50">
        <AuroraBackground intensity={0.15} speed={0.8} />
      </div>

      {/* Interactive Globe */}
      <div className="absolute inset-x-0 top-32 md:top-60 z-0 flex justify-center items-center pointer-events-none">
        <div className="relative w-full max-w-[600px] aspect-square pointer-events-auto">
          <Globe className="opacity-100" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 pointer-events-none">
        <motion.span
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[var(--color-accent)] text-sm uppercase tracking-[0.3em] mb-4 block pointer-events-auto"
        >
          Os Nossos Fotógrafos
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6 pointer-events-auto"
        >
          Portfólio
          <ShinyText className="text-[var(--color-accent)]" duration={3}>
            {' '}Str8
          </ShinyText>
          Global
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-white/80 text-lg md:text-xl max-w-2xl pointer-events-auto font-medium drop-shadow-md"
        >
          Dois olhares, uma visão. Conheça o trabalho dos nossos fotógrafos e descubra
          o estilo que melhor se adapta ao seu projeto.
        </motion.p>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
    </section>
  );
}

export default PortfolioHero;
