'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check, TrendingUp } from 'lucide-react';
import { cursosCopy } from '@/data/cursosData';
import { HighlightText } from '@/components/ui/HighlightText';

function AnimatedCounter({ value, suffix, duration = 2 }: { value: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    const stepTime = (duration * 1000) / end;
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, Math.max(stepTime, 16));

    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}

export function WhyLearn() {
  const { whyLearn } = cursosCopy;

  return (
    <section className="relative bg-[#020202] py-20 md:py-32 overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-[-50%] opacity-[0.03] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(255,16,240,0.5) 1px, transparent 1px),
                     linear-gradient(90deg, rgba(255,16,240,0.5) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      {/* Floating orbs — hidden on mobile to save GPU */}
      <div className="hidden md:block absolute top-40 right-20 w-80 h-80 bg-[var(--color-accent)] rounded-full blur-[150px] opacity-[0.08] pointer-events-none" />
      <div className="hidden md:block absolute bottom-20 left-10 w-64 h-64 bg-purple-500 rounded-full blur-[120px] opacity-[0.06] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="mb-16 md:mb-20">
          <motion.span
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[var(--color-accent)] text-sm uppercase tracking-[0.3em] mb-4 block font-medium"
          >
            {whyLearn.label}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          >
            {whyLearn.title.split('\n').map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/60 text-lg md:text-xl max-w-2xl font-medium"
          >
            <HighlightText text={whyLearn.subtitle} />
          </motion.p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16 md:mb-20">
          {whyLearn.stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative rounded-2xl bg-[#0a0a0a] border border-white/5 p-6 md:p-8 text-center overflow-hidden group"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[var(--color-accent)]/5 to-transparent" />

              <div className="relative z-10">
                <TrendingUp size={20} className="text-[var(--color-accent)] mx-auto mb-3 opacity-60" />
                <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-white/50 text-xs md:text-sm uppercase tracking-wider font-medium">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Points */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
          {whyLearn.points.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
              className="flex items-center gap-3 text-white/70 text-sm md:text-base"
            >
              <div className="w-6 h-6 rounded-full bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 flex items-center justify-center shrink-0">
                <Check size={12} className="text-[var(--color-accent)]" />
              </div>
              <span>{point}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyLearn;
