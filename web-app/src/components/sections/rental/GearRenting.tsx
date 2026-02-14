'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import Image from 'next/image';
import {
  gearItems,
  gearCategoryLabels,
  rentalCopy,
  CONTACTS,
  getWhatsAppUrl,
  type GearCategoryId,
  type GearItem,
} from '@/data/rentalData';
import ScrollReveal from '@/components/animations/ScrollReveal';
import ShinyText from '@/components/animations/ShinyText';

const categories = Object.keys(gearCategoryLabels) as GearCategoryId[];

export function GearRenting() {
  const [activeCategory, setActiveCategory] = useState<GearCategoryId>('cameras');

  const filteredItems = gearItems.filter((item) => item.category === activeCategory);

  return (
    <section className="relative bg-black py-20 md:py-32 overflow-hidden">
      {/* Background orb */}
      <div className="absolute top-40 right-0 w-80 h-80 bg-[var(--color-accent)] rounded-full blur-[150px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <ScrollReveal baseOpacity={0.3} delay={0}>
          <span className="text-[var(--color-accent)] text-sm uppercase tracking-[0.3em] mb-4 block">
            {rentalCopy.gear.label}
          </span>
        </ScrollReveal>
        <ScrollReveal baseOpacity={0.3} delay={0.1}>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4">
            <ShinyText shimmerWidth={150} duration={2.5}>{rentalCopy.gear.title}</ShinyText>
          </h2>
        </ScrollReveal>
        <ScrollReveal baseOpacity={0.3} delay={0.2}>
          <p className="text-white/50 text-lg max-w-xl mb-12">
            {rentalCopy.gear.subtitle}
          </p>
        </ScrollReveal>

        {/* Category pills */}
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`
                relative px-5 py-2.5 text-xs uppercase tracking-wider rounded-full font-medium
                transition-all duration-300
                ${activeCategory === cat
                  ? 'text-black bg-[var(--color-accent)]'
                  : 'text-white/60 bg-white/[0.04] border border-white/10 hover:border-white/20 hover:text-white/80'
                }
              `}
            >
              {gearCategoryLabels[cat]}
            </button>
          ))}
        </div>

        {/* Items grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredItems.map((item, index) => (
              <GearCard key={item.id} item={item} index={index} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function GearCard({ item, index }: { item: GearItem; index: number }) {
  const [showContacts, setShowContacts] = useState(false);

  // Generate base message for WhatsApp
  const messageBody =
    `Olá! Gostaria de alugar o seguinte equipamento:\n\n` +
    `Equipamento: ${item.name}${item.note ? ` (${item.note})` : ''}\n` +
    `Preço: ${item.dailyPrice}€/dia\n\n` +
    `Podem indicar-me a disponibilidade?`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative h-full"
    >
      <div
        className={`
          relative p-6 rounded-2xl overflow-hidden h-full flex flex-col
          bg-gradient-to-br from-white/[0.04] to-transparent
          border border-white/10
          backdrop-blur-sm
          hover:border-[var(--color-accent)]/30
          transition-all duration-300
        `}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/0 to-transparent group-hover:from-[var(--color-accent)]/5 transition-all duration-500" />

        <div className="relative z-10 flex flex-col h-full">
          {item.image && (
            <div className="relative h-48 w-full mb-6 bg-white/[0.02] rounded-xl overflow-hidden group-hover:bg-white/[0.04] transition-colors duration-500">
              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent z-10" />
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}

          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0 mr-4">
              <h3 className="text-lg font-semibold text-white mb-1 leading-tight">
                {item.name}
              </h3>
              {item.note && (
                <span className="text-xs text-white/40 block">({item.note})</span>
              )}
            </div>
            <div className="flex-shrink-0 text-right">
              <span className="text-3xl font-bold text-[var(--color-accent)]">
                {item.dailyPrice}€
              </span>
              <span className="text-xs text-white/40 block uppercase tracking-wider">/dia</span>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-white/5 min-h-[76px] relative flex flex-col justify-end">
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
                    transition-all duration-300 w-full"
                >
                  <MessageCircle size={16} />
                  <span>Alugar via WhatsApp</span>
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

export default GearRenting;
