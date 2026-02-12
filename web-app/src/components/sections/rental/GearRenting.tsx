'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import {
  gearItems,
  gearCategoryLabels,
  rentalCopy,
  type GearCategoryId,
  type GearItem,
} from '@/data/rentalData';

const WHATSAPP_NUMBER = '351933029438';

const categories = Object.keys(gearCategoryLabels) as GearCategoryId[];

export function GearRenting() {
  const [activeCategory, setActiveCategory] = useState<GearCategoryId>('acessorios');

  const filteredItems = gearItems.filter((item) => item.category === activeCategory);

  return (
    <section className="relative bg-black py-20 md:py-32 overflow-hidden">
      {/* Background orb */}
      <div className="absolute top-40 right-0 w-80 h-80 bg-[var(--color-accent)] rounded-full blur-[150px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.span
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[var(--color-accent)] text-sm uppercase tracking-[0.3em] mb-4 block"
        >
          {rentalCopy.gear.label}
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4"
        >
          {rentalCopy.gear.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-white/50 text-lg max-w-xl mb-12"
        >
          {rentalCopy.gear.subtitle}
        </motion.p>

        {/* Category pills */}
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`
                relative px-5 py-2.5 text-xs uppercase tracking-wider rounded-full font-medium
                transition-all duration-300
                ${
                  activeCategory === cat
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
  const fullName = item.note ? `${item.name} (${item.note})` : item.name;
  const whatsappMessage = encodeURIComponent(
    `Olá! Gostaria de alugar o seguinte equipamento:\n\n` +
    `Equipamento: ${fullName}\n` +
    `Preço: ${item.dailyPrice}€/dia\n\n` +
    `Podem indicar-me a disponibilidade?`
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative"
    >
      <div
        className={`
          relative p-6 rounded-2xl overflow-hidden
          bg-gradient-to-br from-white/[0.04] to-transparent
          border border-white/10
          backdrop-blur-sm
          hover:border-[var(--color-accent)]/30
          transition-all duration-300
        `}
      >
        {/* Hover glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/0 to-transparent group-hover:from-[var(--color-accent)]/5 transition-all duration-500" />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0 mr-4">
              <h3 className="text-base md:text-lg font-semibold text-white mb-1">
                {item.name}
              </h3>
              {item.note && (
                <span className="text-xs text-white/40">({item.note})</span>
              )}
            </div>
            <div className="flex-shrink-0 text-right">
              <span className="text-2xl md:text-3xl font-bold text-[var(--color-accent)]">
                {item.dailyPrice}€
              </span>
              <span className="text-sm text-white/40 block">/dia</span>
            </div>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium
              bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20
              hover:bg-[#25D366]/20 hover:border-[#25D366]/40
              transition-all duration-300"
          >
            <MessageCircle size={16} />
            Alugar via WhatsApp
          </a>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--color-accent)] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      </div>
    </motion.div>
  );
}

export default GearRenting;
