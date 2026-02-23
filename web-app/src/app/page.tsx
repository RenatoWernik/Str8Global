'use client';

import dynamic from 'next/dynamic';
import { Hero } from '@/components/sections';

// Lazy load all sections below the fold — ssr: false for performance
// SEO metadata is handled in layout.tsx (Server Component)
const Services = dynamic(() => import('@/components/sections/Services'), { ssr: false });
const SelectedWorks = dynamic(() => import('@/components/sections/SelectedWorks'), { ssr: false });
const HorizontalGallery = dynamic(() => import('@/components/sections/HorizontalGallery'), { ssr: false });
const PortfolioGrid = dynamic(() => import('@/components/sections/PortfolioGrid'), { ssr: false });
const Industries = dynamic(() => import('@/components/sections/Industries'), { ssr: false });
const ClientsSection = dynamic(() => import('@/components/sections/ClientsSection'), { ssr: false });
const Capabilities = dynamic(() => import('@/components/sections/Capabilities'), { ssr: false });
const Contact = dynamic(() => import('@/components/sections/Contact'), { ssr: false });

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <Services />
      <SelectedWorks />
      <HorizontalGallery />
      <PortfolioGrid />
      <Industries />
      <ClientsSection />
      <Capabilities />
      <Contact />
    </main>
  );
}
