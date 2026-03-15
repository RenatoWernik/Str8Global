'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { CTASection } from '@/components/sections/CTASection';
import { ctaCopy } from '@/data/ctaData';
import { BlurText } from '@/components/animations/BlurText';
import { Masonry } from '@/components/ui/Masonry';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const Globe = dynamic(
  () => import('@/components/ui/globe').then(mod => ({ default: mod.Globe })),
  { ssr: false, loading: () => <div className="w-full h-full" /> }
);

const estudiosImages = [
  '/images/espaco/Estudio1.jpg',
  '/images/espaco/Estudio2.jpg',
  '/images/espaco/Estudio-Podcast.jpg',
  '/images/espaco/Estudio-Podcast2.jpg',
  '/images/espaco/Estudio-Podcast3.jpg',
];

const coworkImages = [
  { src: '/images/espaco/CoworkGeral.jpg', title: 'Open Space Geral' },
  { src: '/images/espaco/CoworkGeral2.jpg', title: 'Perspetiva do Espaço' },
  { src: '/images/espaco/Cowork-Starter.jpg', title: 'Plano Starter' },
  { src: '/images/espaco/Cowork-Prime.jpg', title: 'Plano Prime' },
  { src: '/images/espaco/Cowork-Premium.jpg', title: 'Lugar Premium' },
];

const comodidadesImages = [
  { src: '/images/espaco/Sol.jpg', title: 'Pátio & Sol', desc: 'Luz natural e uma área exterior para inspirar as suas pausas e repouso.' },
  { src: '/images/espaco/Café.jpg', title: 'Coffee Break', desc: 'Networking natural numa zona de descontração planeada para mentes criativas.' },
  { src: '/images/espaco/Maquiagem.jpg', title: 'Camarim', desc: 'Cuidado ao detalhe antes de qualquer entrada em cena ou gravação intensiva.' },
];

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
          <div className="absolute inset-x-0 top-[40%] md:top-[30%] lg:top-[25%] z-0 flex justify-center items-start pointer-events-none">
            <div className="relative w-[250%] md:w-[200%] max-w-[1200px] md:max-w-[2000px] lg:max-w-[2500px] aspect-square pointer-events-auto opacity-100">
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

      {/* 2. INTRODUCTION (Manifesto) */}
      <section className="relative py-24 px-6 border-b border-white/5 bg-black z-20">
        <div className="max-w-4xl mx-auto text-center">
          <BlurText 
            text="Descubra a infraestrutura que transforma as melhores ideias em produções de alto nível." 
            delay={0.05} 
            className="text-3xl md:text-5xl font-light text-white/90 leading-tight justify-center"
          />
        </div>
      </section>

      {/* 3. ESTÚDIOS DE PRODUÇÃO (Masonry Grid) */}
      <section className="relative py-24 px-6 bg-[#030303] z-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Estúdios Nível Cinema</h2>
            <p className="text-white/60 text-lg max-w-2xl">
              Ambientes desenhados milimetricamente para absorção acústica e iluminação perfeita. O habitat natural das produções premium.
            </p>
          </div>
          
          <Masonry columns={3} gap={16} className="hidden md:flex">
            {estudiosImages.map((src, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative w-full overflow-hidden rounded-xl border border-white/5"
              >
                <div className="relative w-full aspect-[4/5] hover:scale-105 transition-transform duration-700">
                  <Image src={src} alt={`Estúdio ${idx + 1}`} fill className="object-cover" />
                </div>
              </motion.div>
            ))}
          </Masonry>

          {/* Fallback Mobile Masonry (Single Column) */}
          <div className="flex md:hidden flex-col gap-4">
            {estudiosImages.map((src, idx) => (
              <div key={idx} className="relative w-full aspect-[4/5] overflow-hidden rounded-xl border border-white/5">
                <Image src={src} alt={`Estúdio ${idx + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. COWORKING & COMMUNITY (Spotlight Cards) */}
      <section className="relative py-24 px-6 bg-black z-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-right">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Zonas de Cowork</h2>
            <p className="text-white/60 text-lg max-w-2xl ml-auto">
              Open space sofisticado para equipas dinâmicas. Silêncio quando necessário, colaboração quando exigido. A elite criativa reúne-se aqui.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coworkImages.map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={idx === 0 || idx === 1 ? "lg:col-span-1 md:col-span-2" : ""}
              >
                <SpotlightCard className="h-full p-2 flex flex-col gap-4 group">
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                    <Image src={img.src} alt={img.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <div className="px-2 pb-2">
                    <h3 className="text-xl font-medium text-white/90">{img.title}</h3>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. COMODIDADES & LAZER (Fade Content Blocks) */}
      <section className="relative py-24 px-6 bg-[#050505] z-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">O Toque Premium</h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Trabalho de excelência exige pausas à altura. Desfrute das nossas zonas de descanso e comodidades preparadas para si.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {comodidadesImages.map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.6, delay: 0.2 * idx }}
                className="group relative flex flex-col gap-4"
              >
                <div className="relative w-full aspect-square overflow-hidden rounded-2xl border border-white/10 bg-black/50">
                  <Image src={img.src} alt={img.title} fill className="object-cover transition-all duration-700 opacity-80 group-hover:opacity-100 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 w-full">
                    <h3 className="text-2xl font-semibold mb-2 text-white">{img.title}</h3>
                    <div className="w-12 h-1 bg-[var(--color-accent)] transform origin-left transition-transform duration-300 scale-x-0 group-hover:scale-x-100 mb-3" />
                    <p className="text-white/70 text-sm leading-relaxed opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                      {img.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
