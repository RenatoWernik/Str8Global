'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { CharReveal } from '@/components/animations/CharReveal';
import { BalancedHeadline } from '@/components/animations/BalancedHeadline';
import { coworkImages, espacoContent } from '@/data/espacoData';

export function CoworkSection() {
  return (
    <section className="relative py-24 px-6 bg-black z-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 text-right">
          <CharReveal
            text={espacoContent.cowork.title}
            tag="h2"
            className="text-3xl md:text-5xl font-bold mb-4"
          />
          <BalancedHeadline as="p" className="text-white/60 text-lg max-w-2xl ml-auto">
            {espacoContent.cowork.subtitle}
          </BalancedHeadline>
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
                  <Image
                    src={img.src}
                    alt={img.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="eager"
                  />
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
  );
}
