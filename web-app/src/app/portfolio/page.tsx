'use client';

import { PortfolioHero, PortfolioSplit, PortfolioShowcase } from '@/components/sections/portfolio';

export default function PortfolioPage() {
  return (
    <main className="relative bg-black min-h-screen">
      <PortfolioHero />
      <PortfolioSplit />
      <PortfolioShowcase />
    </main>
  );
}
