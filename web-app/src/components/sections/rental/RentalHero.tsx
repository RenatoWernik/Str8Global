'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Camera, Video, Building, Laptop } from 'lucide-react';
import { rentalCopy, rentalTabs, type RentalTab } from '@/data/rentalData';

import { Globe } from '@/components/ui/globe';

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
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Move the background down slightly as the user scrolls
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <>
      {/* Hero */}
      <section ref={containerRef} className="relative bg-black pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Interactive Aurora & Globe Background with Parallax */}
        <motion.div
          className="absolute inset-x-0 -top-20 -bottom-20 z-0 overflow-hidden flex flex-col justify-center items-center"
          style={{ y: backgroundY }}
        >
          {/* Aurora Background */}


          {/* Interactive Globe enlarged and positioned lower to be cut by the section end */}
          <div className="absolute inset-x-0 top-[40%] md:top-[30%] lg:top-[25%] z-0 flex justify-center items-start pointer-events-none">
            <div className="relative w-[250%] md:w-[200%] max-w-[1200px] md:max-w-[2000px] lg:max-w-[2500px] aspect-square pointer-events-auto opacity-100">
              <Globe className="opacity-100" />
            </div>
          </div>

          {/* Dark overlay to ensure text readability */}
          <div className="absolute inset-0 bg-black/60 z-10 pointer-events-none" />
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 pointer-events-none">
          <motion.span
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[var(--color-accent)] text-sm uppercase tracking-[0.3em] mb-4 block pointer-events-auto"
          >
            {rentalCopy.hero.label}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6 pointer-events-auto"
          >
            {rentalCopy.hero.title.split('&')[0]}
            <span className="text-[var(--color-accent)]">&amp;</span>
            {rentalCopy.hero.title.split('&')[1]}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/80 text-lg md:text-xl max-w-2xl pointer-events-auto font-medium drop-shadow-md"
          >
            {rentalCopy.hero.subtitle}
          </motion.p>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
      </section>

      {/* Sticky Tab Navigation — offset by navbar height (h-20 = 5rem) */}
      <nav className="sticky top-20 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10">
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
