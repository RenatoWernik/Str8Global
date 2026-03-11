'use client';

import { motion } from 'framer-motion';
import { Rocket, Check, ArrowRight, Star } from 'lucide-react';
import { courses, cursosCopy } from '@/data/cursosData';
import { HighlightText } from '@/components/ui/HighlightText';
import { useState } from 'react';

export function FeaturedCourse() {
  const course = courses.find(c => c.id === 'creator-lab')!;
  const [isHovered, setIsHovered] = useState(false);

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
      <div className="hidden md:block absolute top-20 left-10 w-96 h-96 bg-[var(--color-accent)] rounded-full blur-[150px] opacity-10 pointer-events-none" />
      <div className="hidden md:block absolute bottom-20 right-10 w-72 h-72 bg-[var(--color-accent)] rounded-full blur-[120px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="mb-16 md:mb-20">
          <motion.span
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[var(--color-accent)] text-sm uppercase tracking-[0.3em] mb-4 block font-medium"
          >
            {cursosCopy.featured.label}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-tight"
          >
            {cursosCopy.featured.title}
          </motion.h2>
        </div>

        {/* Featured card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-2xl md:rounded-3xl overflow-hidden"
        >
          {/* LED border glow */}
          <div className="absolute inset-0 rounded-2xl md:rounded-3xl overflow-hidden opacity-60 mix-blend-screen pointer-events-none z-0"
            style={{
              background: 'linear-gradient(135deg, rgba(255,16,240,0.3) 0%, transparent 50%, rgba(255,16,240,0.15) 100%)',
            }}
          />
          <div className="absolute inset-[1px] md:inset-[2px] z-[2] rounded-[15px] md:rounded-[22px] bg-[#0c0c0e]" />

          <div className="relative z-[4] p-6 md:p-10 lg:p-14">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
              {/* Left: Info */}
              <div className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 rounded-full text-[var(--color-accent)] text-xs font-bold uppercase tracking-wider">
                      <Star size={12} fill="currentColor" />
                      Mais Popular
                    </span>
                    <span className="text-white/40 text-xs uppercase tracking-wider">{course.tag}</span>
                  </div>

                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{course.title}</h3>

                  <p className="text-white/70 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
                    <HighlightText text={cursosCopy.featured.subtitle} />
                  </p>

                  {/* Features list */}
                  <ul className="space-y-3 mb-8">
                    {course.features.map((feature, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                        className="flex items-start gap-3 text-white/80 text-sm md:text-base"
                      >
                        <Check size={18} className="text-[var(--color-accent)] mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Price + CTA */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <div>
                    <span className="text-4xl md:text-5xl font-bold text-white">{course.currency}{course.price}</span>
                    <span className="text-white/40 text-sm ml-2">{course.priceLabel || 'pagamento único'}</span>
                  </div>

                  <a
                    href={course.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      className="relative group inline-flex items-center gap-3 px-8 py-4 bg-[var(--color-accent)] text-black font-bold text-base rounded-full overflow-hidden cursor-pointer transition-shadow duration-500 hover:shadow-[0_0_40px_rgba(255,16,240,0.4)]"
                    >
                      <span>{course.cta}</span>
                      <motion.span
                        animate={{ x: isHovered ? 5 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ArrowRight size={20} strokeWidth={2.5} />
                      </motion.span>
                    </motion.button>
                  </a>
                </div>
              </div>

              {/* Right: Visual element */}
              <div className="relative flex items-center justify-center">
                <div className="relative w-full max-w-md mx-auto">
                  {/* Glow background */}
                  <div className="absolute inset-0 bg-[var(--color-accent)]/10 rounded-3xl blur-3xl" />

                  {/* Icon showcase */}
                  <div className="relative bg-[#111] rounded-2xl border border-white/5 p-10 md:p-14 flex flex-col items-center justify-center text-center">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 flex items-center justify-center mb-6"
                    >
                      <Rocket size={40} className="text-[var(--color-accent)]" strokeWidth={1.5} />
                    </motion.div>

                    <p className="text-white/50 text-sm uppercase tracking-widest mb-2">Programa Intensivo</p>
                    <p className="text-2xl md:text-3xl font-bold text-white mb-1">4 Módulos</p>
                    <p className="text-white/40 text-sm">3 Meses de Acesso</p>

                    {/* Decorative number */}
                    <span className="absolute bottom-4 right-6 text-8xl font-black text-white/[0.03] leading-none select-none pointer-events-none">
                      01
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default FeaturedCourse;
