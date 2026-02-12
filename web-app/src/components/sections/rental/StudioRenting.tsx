'use client';

import { motion } from 'framer-motion';
import { Aperture, Focus, Mic, MessageCircle } from 'lucide-react';
import { studios, rentalCopy, type Studio, type StudioTier } from '@/data/rentalData';

const WHATSAPP_NUMBER = '351933029438';

const studioIcons: Record<string, React.ReactNode> = {
  Aperture: <Aperture size={32} strokeWidth={1.5} />,
  Focus: <Focus size={32} strokeWidth={1.5} />,
  Mic: <Mic size={32} strokeWidth={1.5} />,
};

export function StudioRenting() {
  return (
    <section className="relative bg-black py-20 md:py-32 overflow-hidden">
      {/* Background orbs */}
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-[var(--color-accent)] rounded-full blur-[150px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.span
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[var(--color-accent)] text-sm uppercase tracking-[0.3em] mb-4 block"
        >
          {rentalCopy.studio.label}
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4"
        >
          {rentalCopy.studio.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-white/50 text-lg max-w-xl mb-16"
        >
          {rentalCopy.studio.subtitle}
        </motion.p>

        {/* Studios grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {studios.map((studio, index) => (
            <StudioCard key={studio.id} studio={studio} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StudioCard({ studio, index }: { studio: Studio; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div
        className={`
          relative h-full p-6 md:p-8 rounded-2xl overflow-hidden
          bg-gradient-to-br from-white/[0.04] to-transparent
          border border-white/10
          backdrop-blur-sm
          hover:border-white/20 transition-all duration-300
        `}
      >
        {/* Hover glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/0 to-transparent group-hover:from-[var(--color-accent)]/5 transition-all duration-500" />

        <div className="relative z-10">
          {/* Icon + Name */}
          <div className="flex items-center gap-4 mb-8">
            <div className="text-[var(--color-accent)]">
              {studioIcons[studio.icon] || <Aperture size={32} strokeWidth={1.5} />}
            </div>
            <h3 className="text-2xl md:text-3xl font-bold">{studio.name}</h3>
          </div>

          {/* Tiers */}
          <div className="space-y-4">
            {studio.tiers.map((tier) => (
              <TierRow key={tier.name} tier={tier} studioName={studio.name} />
            ))}
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--color-accent)] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      </div>
    </motion.div>
  );
}

function TierRow({ tier }: { tier: StudioTier }) {
  return (
    <div
      className={`
        flex items-center justify-between py-3 px-4 rounded-xl
        ${tier.featured ? 'bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20' : 'bg-white/[0.02]'}
        transition-colors duration-300
      `}
    >
      <div className="flex items-center gap-3">
        {tier.featured && (
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
        )}
        <span className={`text-sm md:text-base ${tier.featured ? 'text-white font-medium' : 'text-white/70'}`}>
          {tier.name}
        </span>
      </div>
      <span
        className={`
          font-bold text-right
          ${tier.price !== null ? 'text-lg md:text-xl text-[var(--color-accent)]' : 'text-sm text-white/40 italic'}
        `}
      >
        {tier.priceLabel}
      </span>
    </div>
  );
}

export default StudioRenting;
