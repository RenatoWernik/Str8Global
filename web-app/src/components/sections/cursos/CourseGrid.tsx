'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Users, FileSearch, LayoutTemplate, ClipboardCheck, Phone, Mail } from 'lucide-react';
import { courses, cursosCopy } from '@/data/cursosData';
import { HighlightText } from '@/components/ui/HighlightText';
import { useState } from 'react';

const iconMap: Record<string, React.ReactNode> = {
  Users: <Users size={32} strokeWidth={1.5} />,
  FileSearch: <FileSearch size={32} strokeWidth={1.5} />,
  LayoutTemplate: <LayoutTemplate size={32} strokeWidth={1.5} />,
  ClipboardCheck: <ClipboardCheck size={32} strokeWidth={1.5} />,
  Phone: <Phone size={32} strokeWidth={1.5} />,
  Mail: <Mail size={32} strokeWidth={1.5} />,
};

export function CourseGrid() {
  const gridCourses = courses.filter(c => c.id !== 'creator-lab');

  return (
    <section className="relative bg-black py-20 md:py-32 overflow-hidden">
      {/* Subtle grid */}
      <div className="absolute inset-[-50%] opacity-[0.02] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(255,16,240,0.5) 1px, transparent 1px),
                     linear-gradient(90deg, rgba(255,16,240,0.5) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />
      </div>

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
            {cursosCopy.grid.label}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4"
          >
            {cursosCopy.grid.title.split('\n').map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/60 text-lg md:text-xl max-w-xl font-medium"
          >
            <HighlightText text={cursosCopy.grid.subtitle} />
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {gridCourses.map((course, index) => (
            <CourseCard key={course.id} course={course} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface CourseCardProps {
  course: (typeof courses)[0];
  index: number;
}

function CourseCard({ course, index }: CourseCardProps) {
  const [isActive, setIsActive] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 1, 0.5, 1] }}
      className="group relative cursor-pointer"
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
    >
      <motion.div
        animate={{
          y: isActive ? -8 : 0,
          scale: isActive ? 1.02 : 1,
          boxShadow: isActive
            ? '0 20px 40px rgba(0,0,0,0.5), 0 0 40px rgba(255,16,240,0.1)'
            : '0 10px 30px rgba(0,0,0,0.3), 0 0 0px rgba(255,16,240,0)',
        }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative flex flex-col h-full w-full rounded-2xl md:rounded-3xl overflow-hidden bg-[#0a0a0a] border border-white/5"
      >
        {/* LED border glow */}
        <div
          className="absolute inset-0 rounded-2xl md:rounded-3xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-screen pointer-events-none z-0"
          style={{
            background: 'linear-gradient(135deg, rgba(255,16,240,0.3) 0%, transparent 50%, rgba(255,16,240,0.15) 100%)',
          }}
        />
        <div className="absolute inset-[1px] md:inset-[2px] z-[2] rounded-[15px] md:rounded-[22px] bg-[#0c0c0e]" />
        <div className="absolute top-0 left-0 right-0 h-[80px] z-[3] bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none rounded-t-[15px] md:rounded-t-[22px]" />

        <div className="relative z-[4] flex-1 p-5 md:p-6 lg:p-8 flex flex-col">
          {/* Tag */}
          <span className="text-[var(--color-accent)] text-xs uppercase tracking-widest font-medium mb-4">
            {course.tag}
          </span>

          {/* Icon */}
          <motion.div
            animate={{
              color: isActive ? 'var(--color-accent)' : 'rgba(255,255,255,0.7)',
              scale: isActive ? 1.1 : 1,
            }}
            transition={{ duration: 0.4, type: 'spring' }}
            className="mb-4 inline-flex p-2.5 md:p-3 rounded-xl bg-white/5 border border-white/10 shadow-lg w-fit"
          >
            {iconMap[course.icon] || <FileSearch size={32} strokeWidth={1.5} />}
          </motion.div>

          {/* Title */}
          <h3 className="text-lg md:text-xl font-bold mb-2">{course.title}</h3>

          {/* Description */}
          <p className="text-white/60 text-sm leading-relaxed mb-4 flex-1">
            <HighlightText text={course.description} />
          </p>

          {/* Features */}
          <ul className="space-y-1.5 mb-6">
            {course.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2 text-white/50 text-xs md:text-sm">
                <span className="w-1 h-1 rounded-full bg-[var(--color-accent)] mt-1.5 shrink-0" />
                {feature}
              </li>
            ))}
          </ul>

          {/* Beta badge */}
          {course.beta && (
            <span className="inline-flex items-center px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-[10px] font-bold uppercase tracking-wider w-fit mb-4">
              Beta · Vagas Limitadas
            </span>
          )}

          {/* Price + CTA */}
          <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
            <div>
              {course.free ? (
                <span className="text-2xl font-bold text-[var(--color-accent)]">Grátis</span>
              ) : (
                <>
                  <span className="text-2xl font-bold text-white">{course.currency}{course.price}</span>
                  {course.priceLabel && (
                    <span className="text-white/40 text-sm">{course.priceLabel}</span>
                  )}
                </>
              )}
            </div>

            <a
              href={course.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-[var(--color-accent)] text-white hover:text-black text-sm font-bold rounded-full transition-all duration-300 border border-white/10 hover:border-[var(--color-accent)]"
            >
              <span>{course.cta}</span>
              <ArrowRight size={14} strokeWidth={2.5} />
            </a>
          </div>

          {/* Decorative number */}
          <span className="absolute bottom-2 right-4 text-[6rem] font-black text-white/[0.02] leading-none select-none pointer-events-none">
            {String(index + 2).padStart(2, '0')}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default CourseGrid;
