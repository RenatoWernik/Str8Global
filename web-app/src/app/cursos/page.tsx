'use client';

import dynamic from 'next/dynamic';
import { CursosHero } from '@/components/sections/cursos';
import { CTASection } from '@/components/sections/CTASection';
import { ctaCopy } from '@/data/ctaData';

const FeaturedCourse = dynamic(
  () => import('@/components/sections/cursos/FeaturedCourse'),
  { ssr: false }
);

const CourseGrid = dynamic(
  () => import('@/components/sections/cursos/CourseGrid'),
  { ssr: false }
);

const WhyLearn = dynamic(
  () => import('@/components/sections/cursos/WhyLearn'),
  { ssr: false }
);

export default function CursosPage() {
  return (
    <main className="relative min-h-screen bg-black">
      <CursosHero />
      <FeaturedCourse />
      <CourseGrid />
      <WhyLearn />
      <CTASection
        badge={ctaCopy.cursos.badge}
        headline={ctaCopy.cursos.headline}
        subtitle={ctaCopy.cursos.subtitle}
        buttonText={ctaCopy.cursos.buttonText}
        buttonHref={ctaCopy.cursos.buttonHref}
      />
    </main>
  );
}
