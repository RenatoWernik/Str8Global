'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { TrueFocus } from '@/components/animations/TrueFocus';
import { BalancedHeadline } from '@/components/animations/BalancedHeadline';
import { RevealImage } from '@/components/animations/RevealImage';
import { ImageLightbox } from '@/components/ui/ImageLightbox';
import { MagneticCursor } from '@/components/ui/MagneticCursor';
import { Masonry } from '@/components/ui/Masonry';
import { useSectionInView } from '@/hooks/useSectionInView';
import { comodidadesImages, espacoContent } from '@/data/espacoData';

export function ComodidadesSection() {
  const { sectionRef, isInView } = useSectionInView();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <section ref={sectionRef} className="relative py-24 px-6 bg-[#050505] z-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 text-center">
          <TrueFocus 
            sentence={espacoContent.comodidades.title}
            manualMode={false}
            blurAmount={4}
            borderColor="#22d3ee"
            glowColor="rgba(34, 211, 238, 0.4)"
            animationDuration={0.8}
            pauseBetweenAnimations={1.5}
            className="text-3xl md:text-5xl font-bold mb-4 justify-center"
          />
          <BalancedHeadline as="p" className="text-white/60 text-lg max-w-2xl mx-auto">
            {espacoContent.comodidades.subtitle}
          </BalancedHeadline>
        </div>

        {/* Desktop Masonry Layout */}
        <div className="hidden md:block">
          <Masonry columns={3} gap={16}>
            {comodidadesImages.map((img, idx) => {
              const direction = idx === 0 ? 'left' : idx === 1 ? 'up' : 'right';

              return (
                <MagneticCursor key={idx} strength={0.15} className="w-full !block mb-4">
                  <motion.div
                    layoutId={`comodidades-${idx}`}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 cursor-pointer w-full"
                    onClick={() => setSelectedImage(idx)}
                  >
                    <RevealImage
                      src={img.src}
                      alt={img.title}
                      isInView={isInView}
                      delay={idx * 0.15}
                      direction={direction}
                      className="relative w-full"
                      useFill={false}
                      width={800}
                      height={1000}
                      imageClassName="transition-all duration-700 opacity-80 group-hover:opacity-100 group-hover:scale-105"
                    />
                    {img.title && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                        <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full pointer-events-none">
                          <h3 className="text-2xl md:text-3xl font-semibold mb-2 text-white">{img.title}</h3>
                          <div className="w-12 h-1 bg-[var(--color-accent)] transform origin-left transition-transform duration-300 scale-x-0 group-hover:scale-x-100 mb-3" />
                          <p className="text-white/70 text-sm md:text-base leading-relaxed opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                            {img.desc}
                          </p>
                        </div>
                      </>
                    )}
                  </motion.div>
                </MagneticCursor>
              );
            })}
          </Masonry>
        </div>

        {/* Mobile Masonry Layout */}
        <div className="block md:hidden">
          <Masonry columns={1} gap={16}>
            {comodidadesImages.map((img, idx) => (
              <div key={idx} className="group relative overflow-hidden rounded-2xl border border-white/10 cursor-pointer w-full" onClick={() => setSelectedImage(idx)}>
                <RevealImage
                  src={img.src}
                  alt={img.title}
                  isInView={isInView}
                  delay={idx * 0.1}
                  direction="up"
                  className="relative w-full"
                  useFill={false}
                  width={800}
                  height={1000}
                />
                {img.title && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                    <div className="absolute bottom-0 left-0 p-6 w-full pointer-events-none">
                      <h3 className="text-2xl font-semibold mb-2 text-white">{img.title}</h3>
                      <div className="w-12 h-1 bg-[var(--color-accent)] mb-3" />
                      <p className="text-white/70 text-sm leading-relaxed">
                        {img.desc}
                      </p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </Masonry>
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
