'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CharReveal } from '@/components/animations/CharReveal';
import { BalancedHeadline } from '@/components/animations/BalancedHeadline';
import { RevealImage } from '@/components/animations/RevealImage';
import { ImageLightbox } from '@/components/ui/ImageLightbox';
import { MagneticCursor } from '@/components/ui/MagneticCursor';
import { useSectionInView } from '@/hooks/useSectionInView';
import { comodidadesImages, espacoContent } from '@/data/espacoData';

export function ComodidadesSection() {
  const { sectionRef, isInView } = useSectionInView();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <section ref={sectionRef} className="relative py-24 px-6 bg-[#050505] z-20 border-t border-white/5">
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

        <div className="grid grid-cols-1 md:grid-cols-10 gap-3 md:gap-4">
          {comodidadesImages.map((img, idx) => {
            // Asymmetric column spans: 4-3-3 creates visual interest
            const colSpan = idx === 0 ? 'md:col-span-4' : 'md:col-span-3';

            // Curtain opening effect: left, up, right
            const direction = idx === 0 ? 'left' : idx === 1 ? 'up' : 'right';

            return (
              <MagneticCursor key={idx} strength={0.15} className={colSpan}>
                <motion.div
                  layoutId={`comodidades-${idx}`}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 cursor-pointer"
                  onClick={() => setSelectedImage(idx)}
                >
                  <RevealImage
                    src={img.src}
                    alt={img.title}
                    isInView={isInView}
                    delay={idx * 0.15}
                    direction={direction}
                    className="relative w-full aspect-[3/4]"
                    imageClassName="transition-all duration-700 opacity-80 group-hover:opacity-100 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                  <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full pointer-events-none">
                    <h3 className="text-2xl md:text-3xl font-semibold mb-2 text-white">{img.title}</h3>
                    <div className="w-12 h-1 bg-[var(--color-accent)] transform origin-left transition-transform duration-300 scale-x-0 group-hover:scale-x-100 mb-3" />
                    <p className="text-white/70 text-sm md:text-base leading-relaxed opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                      {img.desc}
                    </p>
                  </div>
                </motion.div>
              </MagneticCursor>
            );
          })}
        </div>
      </div>

      {/* Lightbox for all images */}
      {selectedImage !== null && (
        <ImageLightbox
          src={comodidadesImages[selectedImage].src}
          alt={comodidadesImages[selectedImage].title}
          layoutId={`comodidades-${selectedImage}`}
          isOpen={selectedImage !== null}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </section>
  );
}
