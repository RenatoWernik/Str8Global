'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { RentalHero, GearRenting, StudioRenting, CoworkStudio, CoworkStandalone } from '@/components/sections/rental';
import { rentalCopy, type RentalTab } from '@/data/rentalData';

export default function AluguelPage() {
  const [activeTab, setActiveTab] = useState<RentalTab>('gear');

  const gearRef = useRef<HTMLDivElement>(null);
  const studiosRef = useRef<HTMLDivElement>(null);
  const coworkStudioRef = useRef<HTMLDivElement>(null);
  const coworkRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (tab: RentalTab) => {
    setActiveTab(tab);
    const refMap: Record<RentalTab, React.RefObject<HTMLDivElement | null>> = {
      gear: gearRef,
      studios: studiosRef,
      'cowork-studio': coworkStudioRef,
      cowork: coworkRef,
    };
    const ref = refMap[tab];
    if (ref.current) {
      const offset = 80; // sticky nav height
      const top = ref.current.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <main className="relative bg-black min-h-screen">
      {/* Hero + Sticky Navigation */}
      <RentalHero activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Gear Renting Section */}
      <div ref={gearRef}>
        <GearRenting />
      </div>

      {/* Studio Renting Section */}
      <div ref={studiosRef}>
        <StudioRenting />
      </div>

      {/* Cowork + Estúdio Section */}
      <div ref={coworkStudioRef}>
        <CoworkStudio />
      </div>

      {/* Cowork Standalone Section */}
      <div ref={coworkRef}>
        <CoworkStandalone />
      </div>

      {/* CTA Section */}
      <section className="relative bg-black pt-20 pb-32 px-6 overflow-hidden">
        {/* Background accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[var(--color-accent)] rounded-full blur-[200px] opacity-10" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8">
              {rentalCopy.cta.title.split(' ').slice(0, 2).join(' ')}
              <br />
              <span className="text-[var(--color-accent)]">
                {rentalCopy.cta.title.split(' ').slice(2).join(' ')}
              </span>
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white/60 text-lg max-w-xl mx-auto mb-8"
            >
              {rentalCopy.cta.subtitle}
            </motion.p>
            <motion.a
              href="/#contacto"
              whileHover={{ scale: 1.05, gap: '1rem' }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-10 py-5 bg-[var(--color-accent)] text-black font-bold text-lg rounded-full hover:bg-[var(--color-accent-hover)] transition-colors"
            >
              {rentalCopy.cta.button}
              <ArrowRight size={20} />
            </motion.a>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
