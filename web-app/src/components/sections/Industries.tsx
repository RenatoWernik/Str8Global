'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { industries, siteCopy } from '@/data/mockData';
import { HighlightText } from '@/components/ui/HighlightText';
import { useRef } from 'react';
import Image from 'next/image';

export function Industries() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

    return (
        <section ref={containerRef} className="relative bg-black py-32 overflow-hidden">
            {/* Animated mesh gradient background */}
            <motion.div
                style={{ y: backgroundY }}
                className="absolute inset-0 opacity-20 pointer-events-none"
            >
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-purple-600 to-transparent rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gradient-to-tl from-[var(--color-accent)] to-transparent rounded-full blur-[100px]" />
            </motion.div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header - Split design */}
                <div className="grid lg:grid-cols-2 gap-8 mb-20 lg:mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '50px' }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-[var(--color-accent)] text-xs md:text-sm uppercase tracking-[0.3em] mb-4 block">
                            Indústrias
                        </span>
                        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                            {siteCopy.industries.title}
                        </h2>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '50px' }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex items-end"
                    >
                        <p className="text-white/50 text-lg lg:text-xl max-w-md">
                            <HighlightText text={siteCopy.industries.subtitle} />
                        </p>
                    </motion.div>
                </div>

                {/* Industries - Zig-Zag Layout */}
                <div className="space-y-32 md:space-y-48">
                    {industries.map((industry, index) => (
                        <IndustryRow
                            key={industry.id}
                            industry={industry}
                            index={index}
                        />
                    ))}
                </div>

                {/* Bottom decorative element */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="mt-32 flex justify-center"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-px bg-gradient-to-r from-transparent to-white/20" />
                        <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
                        <div className="w-16 h-px bg-gradient-to-l from-transparent to-white/20" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

interface IndustryRowProps {
    industry: (typeof industries)[0];
    index: number;
}

function IndustryRow({ industry, index }: IndustryRowProps) {
    const isEven = index % 2 === 0;

    // Use explicit tags from data
    const keywords = industry.tags || [];

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className={`flex flex-col gap-12 md:gap-16 lg:gap-24 items-center ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
        >
            {/* Text Content */}
            <div className={`w-full lg:w-1/2 flex flex-col justify-center ${isEven ? 'lg:pr-12' : 'lg:pl-12'}`}>
                <div className="flex items-center gap-4 mb-6">
                    <span className="text-5xl md:text-7xl lg:text-8xl font-black text-[var(--color-accent)] opacity-60 drop-shadow-[0_0_15px_rgba(255,16,240,0.3)] tabular-nums leading-none">
                        {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold">
                        {industry.title}
                    </h3>
                </div>

                <p className="text-white/90 text-[1.35rem] md:text-2xl lg:text-[1.7rem] font-medium leading-relaxed mb-10 max-w-2xl drop-shadow-md">
                    <HighlightText text={industry.description} />
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-3">
                    {keywords.map((keyword, i) => (
                        <span
                            key={i}
                            className="px-5 py-2.5 text-sm md:text-base font-medium uppercase tracking-wider bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 rounded-full text-white shadow-[0_0_15px_rgba(255,16,240,0.15)] hover:bg-[var(--color-accent)]/20 hover:border-[var(--color-accent)] transition-all cursor-default"
                        >
                            {keyword}
                        </span>
                    ))}
                </div>
            </div>

            {/* Image Content */}
            <motion.div
                className="w-full lg:w-1/2 relative h-[400px] sm:h-[500px] lg:h-[700px] rounded-2xl md:rounded-3xl overflow-hidden group"
                whileHover={{ scale: 0.98 }}
                transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
            >
                {industry.image && (
                    <Image
                        src={industry.image}
                        alt={industry.title}
                        fill
                        className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        quality={95}
                    />
                )}
                {/* Gradient overlays to ensure text readability if it ever overlaps and for aesthetics */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-700 ease-in-out" />
                <div className="absolute inset-0 border border-white/10 rounded-2xl md:rounded-3xl pointer-events-none transition-colors duration-700 ease-in-out group-hover:border-[var(--color-accent)]/50 mix-blend-overlay" />
            </motion.div>
        </motion.div>
    );
}

export default Industries;
