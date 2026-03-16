'use client';

import Image from 'next/image';
import { RevealImage } from '@/components/animations/RevealImage';
import { CharReveal } from '@/components/animations/CharReveal';
import { BalancedHeadline } from '@/components/animations/BalancedHeadline';
import { useSectionInView } from '@/hooks/useSectionInView';
import { estudiosImages, espacoContent } from '@/data/espacoData';

export function EstudiosSection() {
  const { sectionRef, isInView } = useSectionInView();

  return (
    <section ref={sectionRef} className="relative py-24 px-6 bg-[#030303] z-20">
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

        {/* Desktop Bento Grid Layout (5 images, asymmetric) */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-12 md:grid-rows-[300px_300px_280px] gap-3">
          {/* Image 1: Estudio1 - Tall left hero image */}
          <div className="md:col-span-7 md:row-span-2 relative overflow-hidden rounded-xl border border-white/5">
            <RevealImage
              src={estudiosImages[0]}
              alt="Estúdio 1"
              isInView={isInView}
              delay={0}
              direction="up"
              className="w-full h-full"
            />
          </div>

          {/* Image 2: Estudio2 - Top right */}
          <div className="md:col-span-5 md:row-span-1 relative overflow-hidden rounded-xl border border-white/5">
            <RevealImage
              src={estudiosImages[1]}
              alt="Estúdio 2"
              isInView={isInView}
              delay={0.1}
              direction="left"
              className="w-full h-full"
            />
          </div>

          {/* Image 3: Estudio-Podcast - Middle right */}
          <div className="md:col-span-5 md:row-span-1 relative overflow-hidden rounded-xl border border-white/5">
            <RevealImage
              src={estudiosImages[2]}
              alt="Estúdio Podcast"
              isInView={isInView}
              delay={0.2}
              direction="left"
              className="w-full h-full"
            />
          </div>

          {/* Image 4: Estudio-Podcast2 - Bottom left */}
          <div className="md:col-span-4 md:row-span-1 relative overflow-hidden rounded-xl border border-white/5">
            <RevealImage
              src={estudiosImages[3]}
              alt="Estúdio Podcast 2"
              isInView={isInView}
              delay={0.15}
              direction="up"
              className="w-full h-full"
            />
          </div>

          {/* Image 5: Estudio-Podcast3 - Bottom right, wide */}
          <div className="md:col-span-8 md:row-span-1 relative overflow-hidden rounded-xl border border-white/5">
            <RevealImage
              src={estudiosImages[4]}
              alt="Estúdio Podcast 3"
              isInView={isInView}
              delay={0.25}
              direction="right"
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Mobile Layout: Single column with varying aspect ratios */}
        <div className="flex md:hidden flex-col gap-4">
          {/* Image 1: Portrait */}
          <div className="relative w-full aspect-[4/5] overflow-hidden rounded-xl border border-white/5">
            <Image
              src={estudiosImages[0]}
              alt="Estúdio 1"
              fill
              className="object-cover"
              loading="eager"
            />
          </div>

          {/* Images 2-3: 16:9 */}
          <div className="relative w-full aspect-video overflow-hidden rounded-xl border border-white/5">
            <Image
              src={estudiosImages[1]}
              alt="Estúdio 2"
              fill
              className="object-cover"
              loading="eager"
            />
          </div>

          <div className="relative w-full aspect-video overflow-hidden rounded-xl border border-white/5">
            <Image
              src={estudiosImages[2]}
              alt="Estúdio Podcast"
              fill
              className="object-cover"
              loading="eager"
            />
          </div>

          {/* Images 4-5: 3:2 landscape */}
          <div className="relative w-full aspect-[3/2] overflow-hidden rounded-xl border border-white/5">
            <Image
              src={estudiosImages[3]}
              alt="Estúdio Podcast 2"
              fill
              className="object-cover"
              loading="eager"
            />
          </div>

          <div className="relative w-full aspect-[3/2] overflow-hidden rounded-xl border border-white/5">
            <Image
              src={estudiosImages[4]}
              alt="Estúdio Podcast 3"
              fill
              className="object-cover"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
