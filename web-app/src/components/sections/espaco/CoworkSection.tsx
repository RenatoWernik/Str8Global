'use client';

import Image from 'next/image';
import { CharReveal } from '@/components/animations/CharReveal';
import { BalancedHeadline } from '@/components/animations/BalancedHeadline';
import { RevealImage } from '@/components/animations/RevealImage';
import { useSectionInView } from '@/hooks/useSectionInView';
import { coworkImages, espacoContent } from '@/data/espacoData';

export function CoworkSection() {
  const { sectionRef, isInView } = useSectionInView();

  return (
    <section ref={sectionRef} className="relative py-24 px-6 bg-black z-20 border-t border-white/5">
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

        {/* Staggered alternating offset layout */}
        <div className="flex flex-col gap-6 md:gap-8">
          {/* Image 1: 75% width, left-aligned, aspect-[16/10] */}
          <div className="w-full md:w-[75%] self-start">
            <div className="relative overflow-hidden rounded-xl border border-white/5">
              <RevealImage
                src={coworkImages[0].src}
                alt={coworkImages[0].title}
                isInView={isInView}
                delay={0}
                direction="right"
                className="relative w-full aspect-video md:aspect-[16/10]"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/70 to-transparent">
                <h3 className="text-lg md:text-xl font-medium text-white">{coworkImages[0].title}</h3>
              </div>
            </div>
          </div>

          {/* Image 2: 60% width, right-aligned, aspect-[4/3] */}
          <div className="w-full md:w-[60%] self-end">
            <div className="relative overflow-hidden rounded-xl border border-white/5">
              <RevealImage
                src={coworkImages[1].src}
                alt={coworkImages[1].title}
                isInView={isInView}
                delay={0.15}
                direction="left"
                className="relative w-full aspect-video md:aspect-[4/3]"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/70 to-transparent">
                <h3 className="text-lg md:text-xl font-medium text-white">{coworkImages[1].title}</h3>
              </div>
            </div>
          </div>

          {/* Image 3: 80% width, left-aligned, aspect-[16/9] */}
          <div className="w-full md:w-[80%] self-start">
            <div className="relative overflow-hidden rounded-xl border border-white/5">
              <RevealImage
                src={coworkImages[2].src}
                alt={coworkImages[2].title}
                isInView={isInView}
                delay={0.1}
                direction="right"
                className="relative w-full aspect-video md:aspect-[16/9]"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/70 to-transparent">
                <h3 className="text-lg md:text-xl font-medium text-white">{coworkImages[2].title}</h3>
              </div>
            </div>
          </div>

          {/* Image 4: 50% width, right-aligned, aspect-[3/2] */}
          <div className="w-full md:w-[50%] self-end">
            <div className="relative overflow-hidden rounded-xl border border-white/5">
              <RevealImage
                src={coworkImages[3].src}
                alt={coworkImages[3].title}
                isInView={isInView}
                delay={0.2}
                direction="left"
                className="relative w-full aspect-video md:aspect-[3/2]"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/70 to-transparent">
                <h3 className="text-lg md:text-xl font-medium text-white">{coworkImages[3].title}</h3>
              </div>
            </div>
          </div>

          {/* Image 5: full width, cinematic aspect-[21/9] */}
          <div className="w-full">
            <div className="relative overflow-hidden rounded-xl border border-white/5">
              <RevealImage
                src={coworkImages[4].src}
                alt={coworkImages[4].title}
                isInView={isInView}
                delay={0.12}
                direction="up"
                className="relative w-full aspect-video md:aspect-[21/9]"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/70 to-transparent">
                <h3 className="text-lg md:text-xl font-medium text-white">{coworkImages[4].title}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
