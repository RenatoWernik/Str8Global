'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { CTASection } from '@/components/sections/CTASection';
import { ctaCopy } from '@/data/ctaData';

const stats = [
  { value: '+500', label: 'Projetos Entregues' },
  { value: '+200', label: 'Marcas' },
  { value: '+4', label: 'Anos de Mercado' },
  { value: '2', label: 'Membros' },
];

const services = [
  {
    title: 'Fotografia Comercial',
    description: 'Imagens que não decoram — posicionam. Fotografia profissional em Lisboa para marcas que querem ser a única escolha lógica.',
    icon: '01',
  },
  {
    title: 'Cobertura de Eventos',
    description: 'O seu evento merece cobertura com nível de cinema. Captação profissional em Lisboa e Cascais que prolonga o impacto além do último aplauso.',
    icon: '02',
  },
  {
    title: 'Retratos & Marcas Pessoais',
    description: 'Autoridade não se proclama — transmite-se. Sessões de retrato que reflectem quem já é: o líder incontestável do seu sector.',
    icon: '03',
  },
  {
    title: 'Conteúdo para Redes Sociais',
    description: 'Material visual arquitectado com precisão cirúrgica para dominar feeds. Produção de conteúdo em Lisboa optimizado para engagement e conversão.',
    icon: '04',
  },
];

function StatCard({ stat, index }: { stat: (typeof stats)[0]; index: number }) {
  return (
    <motion.div
      className="relative text-center p-6 group"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
    >
      <div className="absolute inset-0 rounded-xl border border-white/5 bg-white/[0.02] group-hover:border-[rgba(255,16,240,0.3)] group-hover:bg-[rgba(255,16,240,0.03)] transition-colors duration-300" />
      <div className="relative z-10">
        <span className="text-4xl md:text-5xl font-bold block mb-2">
          {stat.value}
        </span>
        <p className="text-white/60 text-sm uppercase tracking-wider">
          {stat.label}
        </p>
      </div>
    </motion.div>
  );
}

function ServiceCard({
  service,
  index,
}: {
  service: (typeof services)[0];
  index: number;
}) {
  return (
    <motion.div
      className="group relative p-6 md:p-8 rounded-2xl border border-white/5 bg-white/[0.01] hover:border-[var(--color-accent)]/20 transition-colors cursor-pointer overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      whileHover={{ y: -4 }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(255,16,240,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10">
        <span className="text-[var(--color-accent)] text-xs font-mono tracking-wider mb-4 block opacity-60">
          {service.icon}
        </span>
        <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-[var(--color-accent)] transition-colors">
          {service.title}
        </h3>
        <p className="text-white/70 text-sm leading-relaxed">
          {service.description}
        </p>
        <div className="mt-4 flex items-center gap-2 text-[var(--color-accent)] text-sm opacity-0 group-hover:opacity-100 transition-opacity">
          <span>Saber mais</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </motion.div>
  );
}

export function PortfolioShowcase() {
  return (
    <section className="relative bg-black overflow-hidden">
      {/* Static accent line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/20 to-transparent pointer-events-none" />

      {/* Stats section */}
      <div className="py-16 md:py-24 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <CTASection
        badge={ctaCopy.portfolio.badge}
        headline={ctaCopy.portfolio.headline}
        subtitle={ctaCopy.portfolio.subtitle}
        buttonText={ctaCopy.portfolio.buttonText}
        buttonHref={ctaCopy.portfolio.buttonHref}
      />
    </section>
  );
}

export default PortfolioShowcase;
