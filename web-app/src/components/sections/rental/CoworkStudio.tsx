'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Check, MessageCircle } from 'lucide-react';
import {
  coworkStudioPlans,
  coworkStudioAmenities,
  rentalCopy,
  CONTACTS,
  getWhatsAppUrl,
  type CoworkStudioPeriod,
  type CoworkStudioPlan,
} from '@/data/rentalData';
import ScrollReveal from '@/components/animations/ScrollReveal';
import ShinyText from '@/components/animations/ShinyText';

const periodLabels: Record<CoworkStudioPeriod, string> = {
  diaria: 'Diária',
  semanal: 'Semanal',
  mensal: 'Mensal',
};

const periods: CoworkStudioPeriod[] = ['diaria', 'semanal', 'mensal'];

export function CoworkStudio() {
  const [activePeriod, setActivePeriod] = useState<CoworkStudioPeriod>('mensal');

  return (
    <section className="relative bg-black py-20 md:py-32 overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-[var(--color-accent)] rounded-full blur-[150px] opacity-10 pointer-events-none" />
      <div className="absolute bottom-40 left-0 w-72 h-72 bg-purple-600 rounded-full blur-[120px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <ScrollReveal baseOpacity={0.3}>
          <span className="text-[var(--color-accent)] text-sm uppercase tracking-[0.3em] mb-4 block">
            {rentalCopy.coworkStudio.label}
          </span>
        </ScrollReveal>
        <ScrollReveal baseOpacity={0.3} delay={0.1}>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4">
            <ShinyText duration={4}>{rentalCopy.coworkStudio.title}</ShinyText>
          </h2>
        </ScrollReveal>
        <ScrollReveal baseOpacity={0.3} delay={0.2}>
          <p className="text-white/50 text-lg max-w-xl mb-12">
            {rentalCopy.coworkStudio.subtitle}
          </p>
        </ScrollReveal>

        {/* Period toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center mb-16"
        >
          <div className="inline-flex bg-white/[0.04] border border-white/10 rounded-full p-1">
            {periods.map((period) => (
              <button
                key={period}
                onClick={() => setActivePeriod(period)}
                className={`
                  relative px-6 py-2.5 text-sm font-medium rounded-full transition-colors duration-300
                  ${activePeriod === period ? 'text-black' : 'text-white/60 hover:text-white/80'}
                `}
              >
                {activePeriod === period && (
                  <motion.div
                    layoutId="periodToggle"
                    className="absolute inset-0 bg-[var(--color-accent)] rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{periodLabels[period]}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coworkStudioPlans.map((plan, index) => (
            <PlanCard key={plan.name} plan={plan} period={activePeriod} index={index} />
          ))}
        </div>

        {/* Amenities */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-white/40 text-sm mb-4 uppercase tracking-wider">Todos os planos incluem</p>
          <div className="flex flex-wrap justify-center gap-4">
            {coworkStudioAmenities.map((amenity) => (
              <span
                key={amenity}
                className="flex items-center gap-2 px-4 py-2 text-sm text-white/60 bg-white/[0.03] border border-white/10 rounded-full"
              >
                <Check size={14} className="text-[var(--color-accent)]" />
                {amenity}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

import Image from 'next/image';

function PlanCard({
  plan,
  period,
  index,
}: {
  plan: CoworkStudioPlan;
  period: CoworkStudioPeriod;
  index: number;
}) {
  const [showContacts, setShowContacts] = useState(false);
  const pricing = plan.pricing[period];
  const isFeatured = plan.featured;

  // Generate base message for WhatsApp
  const messageBody = `Olá! Tenho interesse no plano Cowork + Estúdio "${plan.name}". Podem dar-me mais informações?`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative h-full"
    >
      <div
        className={`
          relative h-full p-6 md:p-8 rounded-2xl overflow-hidden flex flex-col
          bg-gradient-to-br from-white/[0.04] to-transparent
          backdrop-blur-sm
          transition-all duration-300
          ${isFeatured
            ? 'border border-[var(--color-accent)]/50 hover:border-[var(--color-accent)]/70 shadow-[0_0_30px_rgba(255,16,240,0.1)]'
            : 'border border-white/10 hover:border-white/20'
          }
        `}
      >
        {/* Image Background (if exists) */}
        {plan.image && (
          <div className="absolute inset-x-0 top-0 h-48 z-0">
            <Image
              src={plan.image}
              alt={plan.name}
              fill
              className="object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-500 mask-image-b-fade"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
          </div>
        )}

        {/* Featured badge */}
        {isFeatured && (
          <div className="absolute top-4 right-4 z-20 px-3 py-1 text-[10px] uppercase tracking-wider font-bold bg-[var(--color-accent)] text-black rounded-full">
            Popular
          </div>
        )}

        {/* Glow effect for featured */}
        {isFeatured && (
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/5 to-transparent" />
        )}

        <div className="relative z-10 flex flex-col h-full mt-2">
          {/* Plan name */}
          <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
          <p className="text-white/40 text-sm mb-8">{plan.description}</p>

          {/* Pricing */}
          {pricing ? (
            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl md:text-5xl font-bold text-[var(--color-accent)]">
                  {pricing.price}€
                </span>
                <span className="text-white/40 text-sm">
                  /{period === 'diaria' ? 'dia' : period === 'semanal' ? 'sem' : 'mês'}
                </span>
              </div>
              <p className="text-white/50 text-sm mt-2">
                {pricing.studioHours} incluídas
              </p>
            </div>
          ) : (
            <div className="mb-6">
              <span className="text-xl text-white/30 italic">Indisponível</span>
              <p className="text-white/30 text-sm mt-2">
                Não disponível neste período
              </p>
            </div>
          )}

          {/* WhatsApp CTA */}
          <div className="mt-auto">
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
        <div
          className={`
            absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--color-accent)] to-transparent
            transition-transform duration-500 origin-left
            ${isFeatured ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}
          `}
        />
      </div>
    </motion.div>
  );
}

export default CoworkStudio;
