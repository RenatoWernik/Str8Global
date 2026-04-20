'use client';

import { motion } from 'framer-motion';
import { HighlightText } from '@/components/ui/HighlightText';
import { siteCopy } from '@/data/mockData';
import { Eye, TrendingUp, Target, Users, DollarSign, Calendar } from 'lucide-react';

interface CaseStudyMetric {
    icon: React.ElementType;
    value: string;
    label: string;
}

interface CaseStudy {
    brand: string;
    tagline: string;
    metrics: CaseStudyMetric[];
    accent: string;
}

const caseStudies: CaseStudy[] = [
    {
        brand: 'Rádio Popular',
        tagline: 'Campanhas publicitárias em alto volume',
        accent: '#FF10F0',
        metrics: [
            { icon: Eye, value: '1M+', label: 'Views — Repair Services' },
            { icon: Eye, value: '339K', label: 'Views — Electronia' },
            { icon: TrendingUp, value: '130K+', label: 'Reach em 3 dias — Black Friday' },
        ],
    },
    {
        brand: 'TreeStory',
        tagline: 'Escala orgânica e paid media com eficiência',
        accent: '#FF10F0',
        metrics: [
            { icon: Users, value: '30K', label: 'Seguidores alcançados' },
            { icon: DollarSign, value: '< €0.05', label: 'CPC em paid ads' },
            { icon: Calendar, value: 'Alta', label: 'Performance em campanhas sazonais' },
        ],
    },
];

export function ResultsComparison() {
    return (
        <div>
            {/* Header */}
            <motion.h2
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-3xl sm:text-4xl md:text-6xl font-bold text-center mb-4 md:mb-6"
            >
                <HighlightText text={siteCopy.stats.title} />
            </motion.h2>

            <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-white/50 text-center text-sm md:text-base max-w-lg mx-auto mb-12 md:mb-16"
            >
                Resultados reais de marcas que confiaram no nosso ecossistema.
            </motion.p>

            {/* Case studies grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
                {caseStudies.map((study, index) => (
                    <CaseStudyCard key={study.brand} study={study} index={index} />
                ))}
            </div>
        </div>
    );
}

function CaseStudyCard({ study, index }: { study: CaseStudy; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="group relative p-6 md:p-8 rounded-2xl md:rounded-3xl bg-white/[0.02] border border-white/5 hover:border-[var(--color-accent)]/30 transition-colors duration-500 overflow-hidden"
        >
            {/* Hover glow */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{
                    background:
                        'radial-gradient(circle at 50% 0%, rgba(255,16,240,0.08) 0%, transparent 70%)',
                }}
            />

            <div className="relative z-10">
                {/* Brand name */}
                <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-[var(--color-accent)] text-xs md:text-sm font-mono tracking-wider uppercase">
                        {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                        {study.brand}
                    </h3>
                </div>
                <p className="text-white/50 text-sm md:text-base mb-8">
                    {study.tagline}
                </p>

                {/* Metrics */}
                <div className="space-y-4 md:space-y-5">
                    {study.metrics.map((metric, i) => {
                        const Icon = metric.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                                className="flex items-center gap-4 pb-4 md:pb-5 border-b border-white/5 last:border-b-0 last:pb-0"
                            >
                                <div className="flex-shrink-0 w-10 h-10 md:w-11 md:h-11 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 flex items-center justify-center">
                                    <Icon size={18} className="text-[var(--color-accent)]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-2xl md:text-3xl font-bold text-white leading-none mb-1">
                                        {metric.value}
                                    </div>
                                    <div className="text-xs md:text-sm text-white/50 leading-snug">
                                        {metric.label}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--color-accent)] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        </motion.div>
    );
}

export default ResultsComparison;
