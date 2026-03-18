'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { RevealImage } from '@/components/animations/RevealImage';
import { TrueFocus } from '@/components/animations/TrueFocus';
import { BalancedHeadline } from '@/components/animations/BalancedHeadline';
import { ImageLightbox } from '@/components/ui/ImageLightbox';
import { MagneticCursor } from '@/components/ui/MagneticCursor';
import { Masonry } from '@/components/ui/Masonry';
import { useSectionInView } from '@/hooks/useSectionInView';
import { podcastImages, espacoContent } from '@/data/espacoData';

export function PodcastSection() {
  const { sectionRef, isInView } = useSectionInView();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <section ref={sectionRef} className="relative py-24 px-6 bg-[#030303] z-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 flex flex-col items-end text-right">
          <TrueFocus
            sentence={espacoContent.podcast.title}
            manualMode={false}
            blurAmount={5}
            borderColor="#22d3ee"
            glowColor="rgba(34, 211, 238, 0.4)"
            animationDuration={0.8}
            pauseBetweenAnimations={1.5}
            className="text-3xl md:text-5xl font-bold mb-4 justify-end"
          />
          <BalancedHeadline as="p" className="text-white/60 text-lg max-w-2xl ml-auto">
            {espacoContent.podcast.subtitle}
          </BalancedHeadline>
        </div>

        {/* Desktop: 3 columns */}
        <div className="hidden md:block">
          <Masonry columns={3} gap={20}>
            {podcastImages.map((src, idx) => (
              <MagneticCursor key={idx} strength={0.15} className="w-full !block mb-5">
                <motion.div
                  layoutId={`podcast-${idx}`}
                  className="relative overflow-hidden rounded-xl border border-white/5 cursor-pointer w-full"
                  onClick={() => setSelectedImage(idx)}
                >
                  <RevealImage
                    src={src}
                    alt={`Estúdio de Podcast ${idx + 1}`}
                    isInView={isInView}
                    delay={idx * 0.15}
                    direction="up"
                    useFill={false}
                    width={1000}
                    height={1000}
                    imageClassName="transition-all duration-700 hover:scale-105"
                  />
                </motion.div>
              </MagneticCursor>
            ))}
          </Masonry>
        </div>

        {/* Mobile: 1 column */}
        <div className="md:hidden block">
          <Masonry columns={1} gap={16}>
            {podcastImages.map((src, idx) => (
              <div
                key={idx}
                className="relative overflow-hidden rounded-xl border border-white/5 cursor-pointer w-full"
                onClick={() => setSelectedImage(idx)}
              >
                <RevealImage
                  src={src}
                  alt={`Estúdio de Podcast ${idx + 1}`}
                  isInView={isInView}
                  delay={idx * 0.1}
                  direction="up"
                  useFill={false}
                  width={800}
                  height={800}
                />
              </div>
            ))}
          </Masonry>
        </div>
      </div>

      {selectedImage !== null && (
        <ImageLightbox
          src={podcastImages[selectedImage]}
          alt={`Estúdio de Podcast ${selectedImage + 1}`}
          layoutId={`podcast-${selectedImage}`}
          isOpen={selectedImage !== null}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </section>
  );
}
