'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, CheckCircle2, Zap, Sparkles } from 'lucide-react';
import { HighlightText } from '@/components/ui/HighlightText';

export interface CTASectionProps {
    badge: string;
    headline: string;
    subtitle: string;
    buttonText: string;
    buttonHref: string;
    trustSignals?: { icon: typeof Clock; text: string }[];
}

const defaultTrustSignals = [
    { icon: Clock, text: 'Resposta em menos de 24h' },
    { icon: CheckCircle2, text: 'Sem compromisso' },
    { icon: Zap, text: 'Orçamento gratuito' },
];

export function CTASection({
    badge,
    headline,
    subtitle,
    buttonText,
    buttonHref,
    trustSignals = defaultTrustSignals,
}: CTASectionProps) {
    const [isHovered, setIsHovered] = useState(false);

    const whatsappDefault = `https://wa.me/351966128922?text=${encodeURIComponent('Olá! Vi o vosso website e gostaria de saber mais sobre os vossos serviços.')}`;
    const href = buttonHref || whatsappDefault;

    return (
        <section className="relative bg-white pt-24 md:pt-32 pb-20 md:pb-28 px-6 overflow-hidden">
            {/* Subtle accent glow on white */}
            <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[var(--color-accent)] rounded-full blur-[300px] opacity-[0.06]" />
            <div className="absolute bottom-[-10%] right-[15%] w-[400px] h-[400px] bg-purple-500 rounded-full blur-[200px] opacity-[0.04]" />

            <div className="max-w-7xl mx-auto relative z-10">

                {/* Urgency badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex justify-center mb-8"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 text-[var(--color-accent)] text-xs font-bold uppercase tracking-widest">
                        <Sparkles size={14} className="animate-pulse" />
                        {badge}
                        <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-ping" />
                    </span>
                </motion.div>

                {/* Headline */}
                <div className="text-center mb-6">
                    <motion.h2
                        initial={{ opacity: 0, y: 60 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-4 text-black"
                    >
                        {headline.split('\n').map((line, i) => (
                            <span key={i} className="block">
                                <HighlightText text={line} variant="light" />
                            </span>
                        ))}
                    </motion.h2>
                </div>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-black/60 text-base md:text-xl text-center max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    <HighlightText text={subtitle} variant="light" />
                </motion.p>

                {/* Trust signals */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-wrap justify-center gap-6 md:gap-10 mb-12"
                >
                    {trustSignals.map((signal, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                            className="flex items-center gap-2 text-black/40 text-sm"
                        >
                            <signal.icon size={16} className="text-[var(--color-accent)]" />
                            <span>{signal.text}</span>
                        </motion.div>
                    ))}
                </motion.div>

                {/* CTA Button */}
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4, type: 'spring', damping: 20 }}
                    className="flex justify-center"
                >
                    <a href={href} target="_blank" rel="noopener noreferrer">
                        <motion.button
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                            className="relative group inline-flex items-center gap-4 px-10 py-5 sm:px-14 sm:py-6 bg-black text-white font-bold text-lg sm:text-xl rounded-full overflow-hidden cursor-pointer transition-shadow duration-500 shadow-[0_0_40px_rgba(0,0,0,0.15)] hover:shadow-[0_0_60px_rgba(var(--color-accent-rgb),0.3)]"
                        >
                            {/* Shimmer effect */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--color-accent)]/20 to-transparent -skew-x-12"
                                animate={{
                                    x: isHovered ? ['calc(-100% - 50px)', 'calc(100% + 50px)'] : 'calc(-100% - 50px)',
                                }}
                                transition={{
                                    duration: 0.8,
                                    ease: 'easeInOut',
                                }}
                            />

                            <span className="relative z-10">{buttonText}</span>

                            <motion.span
                                className="relative z-10"
                                animate={{ x: isHovered ? 5 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ArrowRight size={22} strokeWidth={2.5} />
                            </motion.span>
                        </motion.button>
                    </a>
                </motion.div>
            </div>
        </section>
    );
}

export default CTASection;
