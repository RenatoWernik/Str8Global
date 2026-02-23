'use client';

import dynamic from 'next/dynamic';
import { PortfolioHero } from '@/components/sections/portfolio';

// Lazy load heavy sections — only PortfolioHero renders immediately
const PortfolioSplit = dynamic(
  () => import('@/components/sections/portfolio/PortfolioSplit'),
  { ssr: false }
);
const PortfolioShowcase = dynamic(
  () => import('@/components/sections/portfolio/PortfolioShowcase'),
  { ssr: false }
);

export default function PortfolioPage() {
  return (
    <main className="relative bg-black min-h-screen">
      <PortfolioHero />
      <PortfolioSplit />
      <PortfolioShowcase />
    </main>
  );
}
