'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Aperture, Focus, Mic, MessageCircle } from 'lucide-react';
import { studios, rentalCopy, CONTACTS, getWhatsAppUrl, type Studio, type StudioTier } from '@/data/rentalData';
import ScrollReveal from '@/components/animations/ScrollReveal';

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
        <ScrollReveal baseOpacity={0.3} delay={0}>
          <span className="text-[var(--color-accent)] text-sm uppercase tracking-[0.3em] mb-4 block">
            {rentalCopy.studio.label}
          </span>
        </ScrollReveal>
        <ScrollReveal baseOpacity={0.3} delay={0.1}>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4">
            {rentalCopy.studio.title}
          </h2>
        </ScrollReveal>
        <ScrollReveal baseOpacity={0.3} delay={0.2}>
          <p className="text-white/50 text-lg max-w-xl mb-16">
            {rentalCopy.studio.subtitle}
          </p>
        </ScrollReveal>

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

import Image from 'next/image';

function StudioCard({ studio, index }: { studio: Studio; index: number }) {
  const [showContacts, setShowContacts] = useState(false);

  // Generate base message for WhatsApp
  const messageBody = `Olá! Gostaria de reservar o ${studio.name}. Podem indicar-me a disponibilidade?`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group h-full"
    >
      <div
        className={`
          relative h-full p-6 md:p-8 rounded-2xl overflow-hidden flex flex-col
          bg-gradient-to-br from-white/[0.04] to-transparent
          border border-white/10
          backdrop-blur-sm
          hover:border-white/20 transition-all duration-300
        `}
      >
        {/* Image Background (if exists) */}
        {studio.image && (
          <div className="absolute inset-x-0 top-0 h-48 z-0">
            <Image
              src={studio.image}
              alt={studio.name}
              fill
              className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500 mask-image-b-fade"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
          </div>
        )}

        {/* Hover glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/0 to-transparent group-hover:from-[var(--color-accent)]/5 transition-all duration-500" />

        <div className="relative z-10 flex flex-col h-full mt-4">
          {/* Icon + Name */}
          <div className="flex items-center gap-4 mb-8">
            <div className={`p-3 rounded-xl bg-black/50 border border-white/10 text-[var(--color-accent)] backdrop-blur-md`}>
              {studioIcons[studio.icon] || <Aperture size={32} strokeWidth={1.5} />}
            </div>
            <h3 className="text-2xl md:text-3xl font-bold drop-shadow-md">{studio.name}</h3>
          </div>

          {/* Tiers */}
          <div className="space-y-4 mb-8">
            {studio.tiers.map((tier) => (
              <TierRow key={tier.name} tier={tier} />
            ))}
          </div>

          {/* WhatsApp CTA */}
          <div className="mt-auto pt-6 border-t border-white/5">
            <AnimatePresence mode="wait">
              {!showContacts ? (
                <motion.button
                  key="main-btn"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onClick={() => setShowContacts(true)}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium
                    bg-white/[0.03] text-white hover:bg-[var(--color-accent)] hover:text-black
                    border border-white/10 hover:border-transparent
                    transition-all duration-300"
                >
                  <MessageCircle size={16} />
                  <span>Reservar via WhatsApp</span>
                </motion.button>
              ) : (
                <motion.div
                  key="contacts"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col gap-2 w-full"
                >
                  <a
                    href={getWhatsAppUrl(CONTACTS.IGOR.number, messageBody)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-sm font-medium
                      bg-white/[0.03] text-white hover:bg-[var(--color-accent)] hover:text-black
                      border border-white/10 hover:border-transparent
                      transition-all duration-300"
                  >
                    <span>Falar com {CONTACTS.IGOR.name}</span>
                  </a>
                  <a
                    href={getWhatsAppUrl(CONTACTS.MARTA.number, messageBody)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-sm font-medium
                      bg-white/[0.03] text-white hover:bg-[var(--color-accent)] hover:text-black
                      border border-white/10 hover:border-transparent
                      transition-all duration-300"
                  >
                    <span>Falar com {CONTACTS.MARTA.name}</span>
                  </a>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowContacts(false);
                    }}
                    className="text-[10px] uppercase tracking-wider text-white/40 hover:text-white text-center w-full py-1"
                  >
                    Cancelar
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
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
