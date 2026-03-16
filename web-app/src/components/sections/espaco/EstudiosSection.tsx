'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Masonry } from '@/components/ui/Masonry';
import { CharReveal } from '@/components/animations/CharReveal';
import { BalancedHeadline } from '@/components/animations/BalancedHeadline';
import { estudiosImages, espacoContent } from '@/data/espacoData';

export function EstudiosSection() {
  return (
    <section className="relative py-24 px-6 bg-[#030303] z-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <CharReveal
            text={espacoContent.estudios.title}
            tag="h2"
            className="text-3xl md:text-5xl font-bold mb-4"
          />
          <BalancedHeadline as="p" className="text-white/60 text-lg max-w-2xl">
            {espacoContent.estudios.subtitle}
          </BalancedHeadline>
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
                <Image
                  src={src}
                  alt={`Estúdio ${idx + 1}`}
                  fill
                  className="object-cover"
                  loading="eager"
                />
              </div>
            </motion.div>
          ))}
        </Masonry>

        {/* Fallback Mobile Masonry (Single Column) */}
        <div className="flex md:hidden flex-col gap-4">
          {estudiosImages.map((src, idx) => (
            <div key={idx} className="relative w-full aspect-[4/5] overflow-hidden rounded-xl border border-white/5">
              <Image
                src={src}
                alt={`Estúdio ${idx + 1}`}
                fill
                className="object-cover"
                loading="eager"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
