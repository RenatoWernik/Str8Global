'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { CharReveal } from '@/components/animations/CharReveal';
import { BalancedHeadline } from '@/components/animations/BalancedHeadline';
import { comodidadesImages, espacoContent } from '@/data/espacoData';

export function ComodidadesSection() {
  return (
    <section className="relative py-24 px-6 bg-[#050505] z-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 text-center">
          <CharReveal
            text={espacoContent.comodidades.title}
            tag="h2"
            className="text-3xl md:text-5xl font-bold mb-4"
          />
          <BalancedHeadline as="p" className="text-white/60 text-lg max-w-2xl mx-auto">
            {espacoContent.comodidades.subtitle}
          </BalancedHeadline>
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
                <Image
                  src={img.src}
                  alt={img.title}
                  fill
                  className="object-cover transition-all duration-700 opacity-80 group-hover:opacity-100 group-hover:scale-105"
                  loading="eager"
                />
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
  );
}
