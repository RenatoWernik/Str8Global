'use client';

import { useRef, useState } from 'react';
import { RentalHero, GearRenting, StudioRenting, CoworkStudio, CoworkStandalone } from '@/components/sections/rental';
import { type RentalTab } from '@/data/rentalData';
import { CTASection } from '@/components/sections/CTASection';
import { ctaCopy } from '@/data/ctaData';
import { useRentalAvailability } from '@/hooks/useRentalAvailability';

export default function AluguelPage() {
  const [activeTab, setActiveTab] = useState<RentalTab>('gear');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { loading, isItemAvailable, getCoworkSpots, hasData } = useRentalAvailability(selectedDate);

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
        <CoworkStudio
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          loading={loading}
          getCoworkSpots={getCoworkSpots}
          hasData={hasData}
        />
      </div>

      {/* Cowork Standalone Section */}
      <div ref={coworkRef}>
        <CoworkStandalone />
      </div>

      {/* CTA Section */}
      <CTASection
        badge={ctaCopy.aluguel.badge}
        headline={ctaCopy.aluguel.headline}
        subtitle={ctaCopy.aluguel.subtitle}
        buttonText={ctaCopy.aluguel.buttonText}
        buttonHref={ctaCopy.aluguel.buttonHref}
      />
    </main>
  );
}
