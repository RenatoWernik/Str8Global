'use client';

import { motion } from 'framer-motion';
import { Camera, Video, Building, Laptop } from 'lucide-react';
import { rentalCopy, rentalTabs, type RentalTab } from '@/data/rentalData';

const tabIcons: Record<string, React.ReactNode> = {
  Camera: <Camera size={18} strokeWidth={1.5} />,
  Video: <Video size={18} strokeWidth={1.5} />,
  Building: <Building size={18} strokeWidth={1.5} />,
  Laptop: <Laptop size={18} strokeWidth={1.5} />,
};

interface RentalHeroProps {
  activeTab: RentalTab;
  onTabChange: (tab: RentalTab) => void;
}

export function RentalHero({ activeTab, onTabChange }: RentalHeroProps) {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-black pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--color-accent)] rounded-full blur-[150px] opacity-10 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[var(--color-accent)] rounded-full blur-[120px] opacity-10 pointer-events-none" />

        {/* Accent gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(255,16,240,0.06) 0%, transparent 60%)',
          }}
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.span
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[var(--color-accent)] text-sm uppercase tracking-[0.3em] mb-4 block"
          >
            {rentalCopy.hero.label}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6"
          >
            {rentalCopy.hero.title.split('&')[0]}
            <span className="text-[var(--color-accent)]">&amp;</span>
            {rentalCopy.hero.title.split('&')[1]}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/50 text-lg md:text-xl max-w-2xl"
          >
            {rentalCopy.hero.subtitle}
          </motion.p>
        </div>
      </section>

      {/* Sticky Tab Navigation */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto scrollbar-none py-3">
            {rentalTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="relative flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap rounded-lg transition-colors"
              >
                <span className={activeTab === tab.id ? 'text-[var(--color-accent)]' : 'text-white/40'}>
                  {tabIcons[tab.icon]}
                </span>
                <span className={activeTab === tab.id ? 'text-white' : 'text-white/60 hover:text-white/80'}>
                  {tab.label}
                </span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white/[0.06] rounded-lg border border-white/10"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}

export default RentalHero;
