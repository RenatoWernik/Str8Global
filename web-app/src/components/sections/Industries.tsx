'use client';

import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { industries, siteCopy } from '@/data/mockData';
import { useRef, useState } from 'react';

export function Industries() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

    const handleToggle = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section ref={containerRef} className="relative bg-black py-32 overflow-hidden">
            {/* Animated mesh gradient background */}
            <motion.div
                style={{ y: backgroundY }}
                className="absolute inset-0 opacity-20"
            >
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-purple-600 to-transparent rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gradient-to-tl from-[var(--color-accent)] to-transparent rounded-full blur-[100px]" />
            </motion.div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header - Split design */}
                <div className="grid lg:grid-cols-2 gap-8 mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '50px' }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-[var(--color-accent)] text-sm uppercase tracking-[0.3em] mb-4 block">
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
                            {siteCopy.industries.subtitle}
                        </p>
                    </motion.div>
                </div>

                {/* Industries - Accordion Layout */}
                <div className="space-y-3">
                    {industries.map((industry, index) => (
                        <IndustryRow
                            key={industry.id}
                            industry={industry}
                            index={index}
                            isActive={activeIndex === index}
                            isOtherActive={activeIndex !== null && activeIndex !== index}
                            onToggle={() => handleToggle(index)}
                        />
                    ))}
                </div>

                {/* Bottom decorative element */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="mt-20 flex justify-center"
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
    isActive: boolean;
    isOtherActive: boolean;
    onToggle: () => void;
}

function IndustryRow({ industry, index, isActive, isOtherActive, onToggle }: IndustryRowProps) {
    const rowRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const spotlightX = useSpring(mouseX, { stiffness: 300, damping: 25 });
    const spotlightY = useSpring(mouseY, { stiffness: 300, damping: 25 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!rowRef.current) return;
        const rect = rowRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

    // Extract keywords for tags
    const keywords = industry.description.split('.')[0].split(',').slice(0, 3).map(k => k.trim().split(' ').slice(-2).join(' '));

    return (
        <motion.div
            ref={rowRef}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            onClick={onToggle}
            onMouseMove={handleMouseMove}
            className="group relative cursor-pointer"
        >
            <div
                className={`
          relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]
          transition-opacity duration-300
          ${isOtherActive ? 'opacity-50' : 'opacity-100'}
        `}
            >
                {/* Spotlight effect that follows cursor */}
                <motion.div
                    style={{
                        left: spotlightX,
                        top: spotlightY,
                    }}
                    className={`
            absolute w-64 h-64 -translate-x-1/2 -translate-y-1/2 
            bg-[var(--color-accent)] rounded-full blur-[60px] pointer-events-none
            transition-opacity duration-300
            ${isActive ? 'opacity-20' : 'opacity-0'}
          `}
                />

                {/* Border glow on active */}
                <div
                    className={`
            absolute inset-0 rounded-xl border border-[var(--color-accent)]/50 pointer-events-none
            transition-opacity duration-300
            ${isActive ? 'opacity-100' : 'opacity-0'}
          `}
                />

                {/* Content */}
                <div className="relative z-10 p-6 md:p-8">
                    {/* Row header - always visible */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            {/* Number */}
                            <span
                                className={`
                  text-4xl md:text-5xl font-bold tabular-nums
                  transition-colors duration-300
                  ${isActive ? 'text-[var(--color-accent)]' : 'text-white/20'}
                `}
                            >
                                {String(index + 1).padStart(2, '0')}
                            </span>

                            {/* Title */}
                            <h3
                                className={`
                  text-2xl md:text-3xl lg:text-4xl font-bold
                  transition-colors duration-300
                  ${isActive ? 'text-white' : 'text-white/80'}
                `}
                            >
                                {industry.title}
                            </h3>
                        </div>

                        {/* Animated expand indicator */}
                        <motion.div
                            animate={{
                                rotate: isActive ? 45 : 0,
                                scale: isActive ? 1.1 : [1, 1.25, 1],
                                boxShadow: isActive
                                    ? '0 0 20px rgba(255,16,240,0.5)'
                                    : ['0 0 10px rgba(255,16,240,0.3)', '0 0 25px rgba(255,16,240,0.6)', '0 0 10px rgba(255,16,240,0.3)'],
                            }}
                            transition={isActive ? {
                                duration: 0.25,
                                ease: 'easeOut',
                            } : {
                                rotate: { duration: 0.25 },
                                scale: {
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                },
                                boxShadow: {
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                },
                            }}
                            className="w-10 h-10 rounded-full border-2 border-[var(--color-accent)] flex items-center justify-center bg-black/50"
                        >
                            <span className="text-2xl font-light select-none text-[var(--color-accent)]">
                                +
                            </span>
                        </motion.div>
                    </div>

                    {/* Expanded content - CSS grid for smooth height animation */}
                    <div
                        className="grid transition-all duration-500 ease-out"
                        style={{
                            gridTemplateRows: isActive ? '1fr' : '0fr',
                        }}
                    >
                        <div className="overflow-hidden">
                            <div className="mt-6 pl-[4.5rem] md:pl-[5.5rem]">
                                <p
                                    className={`
                    text-white/60 text-lg max-w-2xl leading-relaxed
                    transition-all duration-500 ease-out
                    ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
                  `}
                                >
                                    {industry.description}
                                </p>

                                {/* Tags */}
                                <div
                                    className={`
                    flex flex-wrap gap-2 mt-4
                    transition-all duration-500 ease-out delay-75
                    ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
                  `}
                                >
                                    {keywords.map((keyword, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1 text-xs uppercase tracking-wider bg-white/5 border border-white/10 rounded-full text-white/50"
                                        >
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative line */}
                <div
                    className={`
            absolute bottom-0 left-0 right-0 h-[2px] 
            bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-accent)]/50 to-transparent 
            origin-left transition-transform duration-500 ease-out
            ${isActive ? 'scale-x-100' : 'scale-x-0'}
          `}
                />
            </div>
        </motion.div>
    );
}

export default Industries;
