'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { TrueFocus } from '@/components/animations/TrueFocus';
import { BalancedHeadline } from '@/components/animations/BalancedHeadline';
import { RevealImage } from '@/components/animations/RevealImage';
import { ImageLightbox } from '@/components/ui/ImageLightbox';
import { MagneticCursor } from '@/components/ui/MagneticCursor';
import { useSectionInView } from '@/hooks/useSectionInView';
import { coworkImages, espacoContent } from '@/data/espacoData';

export function CoworkSection() {
  const { sectionRef, isInView } = useSectionInView();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <section ref={sectionRef} className="relative py-24 px-6 bg-black z-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 flex flex-col items-end text-right">
          <TrueFocus 
            sentence={espacoContent.cowork.title}
            manualMode={false}
            blurAmount={4}
            borderColor="#22d3ee"
            glowColor="rgba(34, 211, 238, 0.4)"
            animationDuration={0.8}
            pauseBetweenAnimations={1.5}
            className="text-3xl md:text-5xl font-bold mb-4 justify-end"
          />
          <BalancedHeadline as="p" className="text-white/60 text-lg max-w-2xl ml-auto">
            {espacoContent.cowork.subtitle}
          </BalancedHeadline>
        </div>

        {/* Staggered alternating offset layout */}
        <div className="flex flex-col gap-6 md:gap-8">
          {/* Image 1: 75% width, left-aligned, aspect-[16/10] */}
          <div className="w-full md:w-[75%] self-start">
            <MagneticCursor strength={0.12} className="w-full !block">
              <motion.div
                layoutId="cowork-0"
                className="relative overflow-hidden rounded-xl border border-white/5 cursor-pointer"
                onClick={() => setSelectedImage(0)}
              >
                <RevealImage
                  src={coworkImages[0].src}
                  alt={coworkImages[0].title}
                  isInView={isInView}
                  delay={0}
                  direction="right"
                  className="relative w-full aspect-video md:aspect-[16/10]"
                />
                {coworkImages[0].title && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/70 to-transparent pointer-events-none">
                    <h3 className="text-lg md:text-xl font-medium text-white">{coworkImages[0].title}</h3>
                  </div>
                )}
              </motion.div>
            </MagneticCursor>
          </div>

          {/* Image 2: 60% width, right-aligned, aspect-[4/3] */}
          <div className="w-full md:w-[60%] self-end">
            <MagneticCursor strength={0.12} className="w-full !block">
              <motion.div
                layoutId="cowork-1"
                className="relative overflow-hidden rounded-xl border border-white/5 cursor-pointer"
                onClick={() => setSelectedImage(1)}
              >
                <RevealImage
                  src={coworkImages[1].src}
                  alt={coworkImages[1].title}
                  isInView={isInView}
                  delay={0.15}
                  direction="left"
                  className="relative w-full aspect-video md:aspect-[4/3]"
                />
                {coworkImages[1].title && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/70 to-transparent pointer-events-none">
                    <h3 className="text-lg md:text-xl font-medium text-white">{coworkImages[1].title}</h3>
                  </div>
                )}
              </motion.div>
            </MagneticCursor>
          </div>

          {/* Image 3: 80% width, left-aligned, aspect-[16/9] */}
          <div className="w-full md:w-[80%] self-start">
            <MagneticCursor strength={0.12} className="w-full !block">
              <motion.div
                layoutId="cowork-2"
                className="relative overflow-hidden rounded-xl border border-white/5 cursor-pointer"
                onClick={() => setSelectedImage(2)}
              >
                <RevealImage
                  src={coworkImages[2].src}
                  alt={coworkImages[2].title}
                  isInView={isInView}
                  delay={0.1}
                  direction="right"
                  className="relative w-full aspect-video md:aspect-[16/9]"
                />
                {coworkImages[2].title && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/70 to-transparent pointer-events-none">
                    <h3 className="text-lg md:text-xl font-medium text-white">{coworkImages[2].title}</h3>
                  </div>
                )}
              </motion.div>
            </MagneticCursor>
          </div>

          {/* Image 4: 50% width, right-aligned, aspect-[3/2] */}
          <div className="w-full md:w-[50%] self-end">
            <MagneticCursor strength={0.12} className="w-full !block">
              <motion.div
                layoutId="cowork-3"
                className="relative overflow-hidden rounded-xl border border-white/5 cursor-pointer"
                onClick={() => setSelectedImage(3)}
              >
                <RevealImage
                  src={coworkImages[3].src}
                  alt={coworkImages[3].title}
                  isInView={isInView}
                  delay={0.2}
                  direction="left"
                  className="relative w-full aspect-video md:aspect-[3/2]"
                />
                {coworkImages[3].title && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/70 to-transparent pointer-events-none">
                    <h3 className="text-lg md:text-xl font-medium text-white">{coworkImages[3].title}</h3>
                  </div>
                )}
              </motion.div>
            </MagneticCursor>
          </div>

          {/* Image 5: full width, cinematic aspect-[21/9] */}
          <div className="w-full">
            <MagneticCursor strength={0.12} className="w-full !block">
              <motion.div
                layoutId="cowork-4"
                className="relative overflow-hidden rounded-xl border border-white/5 cursor-pointer"
                onClick={() => setSelectedImage(4)}
              >
                <RevealImage
                  src={coworkImages[4].src}
                  alt={coworkImages[4].title}
                  isInView={isInView}
                  delay={0.12}
                  direction="up"
                  className="relative w-full aspect-video md:aspect-[21/9]"
                />
                {coworkImages[4].title && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/70 to-transparent pointer-events-none">
                    <h3 className="text-lg md:text-xl font-medium text-white">{coworkImages[4].title}</h3>
                  </div>
                )}
              </motion.div>
            </MagneticCursor>
          </div>
        </div>
      </div>

      {/* Lightbox for all images */}
      {selectedImage !== null && (
        <ImageLightbox
          src={coworkImages[selectedImage].src}
          alt={coworkImages[selectedImage].title}
          layoutId={`cowork-${selectedImage}`}
          isOpen={selectedImage !== null}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </section>
  );
}
