'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const stats = [
  { value: '500+', label: 'Projetos Realizados' },
  { value: '120+', label: 'Clientes Satisfeitos' },
  { value: '5+', label: 'Anos de Experiência' },
  { value: '2', label: 'Fotógrafos de Elite' },
];

const services = [
  {
    title: 'Fotografia Comercial',
    description: 'Imagens premium para marcas que querem destacar-se no mercado.',
    icon: '01',
  },
  {
    title: 'Eventos & Cobertura',
    description: 'Captação profissional de momentos que marcam a diferença.',
    icon: '02',
  },
  {
    title: 'Retratos & Lifestyle',
    description: 'Sessões personalizadas que revelam a essência de cada pessoa.',
    icon: '03',
  },
  {
    title: 'Conteúdo Digital',
    description: 'Material visual otimizado para redes sociais e campanhas digitais.',
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
        <p className="text-white/50 text-sm uppercase tracking-wider">
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
        <p className="text-white/50 text-sm leading-relaxed">
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
      <div className="relative py-20 md:py-32 px-6 overflow-hidden">
        {/* Background accent glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[var(--color-accent)] rounded-full blur-[200px] opacity-10" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl md:text-7xl lg:text-8xl font-bold mb-8">
              O Próximo Projecto
              <br />
              é{' '}<span className="text-[var(--color-accent)]">
                Seu
              </span>
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white/60 text-lg max-w-xl mx-auto mb-8"
            >
              A sua marca merece mais do que &quot;fotos bonitas&quot;. Merece resultados.
              Fale connosco — o pior que pode acontecer é ficar impressionado.
            </motion.p>
            <motion.a
              href="/#contacto"
              whileHover={{ scale: 1.05, gap: '1rem' }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-8 py-4 sm:px-10 sm:py-5 bg-[var(--color-accent)] text-black font-bold text-base sm:text-lg rounded-full hover:bg-[var(--color-accent-hover)] transition-colors"
            >
              Contactar
              <ArrowRight size={20} />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default PortfolioShowcase;
