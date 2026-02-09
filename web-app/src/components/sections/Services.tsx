'use client';

import { motion } from 'framer-motion';
import { services, siteCopy } from '@/data/mockData';
import { useRef, useState } from 'react';
import {
    Target, Camera, Video, Plane, Package, Calendar, Mic, Share2, ArrowRight
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
    strategy: <Target size={40} strokeWidth={1.5} />,
    camera: <Camera size={40} strokeWidth={1.5} />,
    video: <Video size={40} strokeWidth={1.5} />,
    drone: <Plane size={40} strokeWidth={1.5} />,
    product: <Package size={40} strokeWidth={1.5} />,
    event: <Calendar size={40} strokeWidth={1.5} />,
    podcast: <Mic size={40} strokeWidth={1.5} />,
    social: <Share2 size={40} strokeWidth={1.5} />,
};

export function Services() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <section ref={containerRef} className="relative bg-black py-20 md:py-32 overflow-hidden">
            {/* Animated grid background */}
            <div className="absolute inset-[-50%] opacity-[0.04] pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(rgba(255,16,240,0.5) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,16,240,0.5) 1px, transparent 1px)`,
                    backgroundSize: '80px 80px',
                }} />
            </div>

            {/* Floating orbs */}
            <div className="absolute top-20 left-10 w-96 h-96 bg-[var(--color-accent)] rounded-full blur-[150px] opacity-15 pointer-events-none" />
            <div className="absolute bottom-20 right-10 w-72 h-72 bg-[var(--color-accent)] rounded-full blur-[120px] opacity-15 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 md:mb-24">
                    <div>
                        <motion.span
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: '100px' }}
                            transition={{ duration: 0.6 }}
                            className="text-[var(--color-accent)] text-sm uppercase tracking-[0.3em] mb-4 block"
                        >
                            Serviços
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: '100px' }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-tight"
                        >
                            {siteCopy.services.title}
                        </motion.h2>
                    </div>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '100px' }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-white/50 text-lg max-w-md mt-6 lg:mt-0 lg:text-right"
                    >
                        {siteCopy.services.subtitle}
                    </motion.p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {services.map((service, index) => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            index={index}
                            isActive={activeIndex === index}
                            onActivate={() => setActiveIndex(index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

interface ServiceCardProps {
    service: (typeof services)[0];
    index: number;
    isActive: boolean;
    onActivate: () => void;
}

function ServiceCard({ service, index, isActive, onActivate }: ServiceCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    // Make first two cards larger
    const isLarge = index < 2;
    const spanClass = isLarge ? 'lg:col-span-2 lg:row-span-1' : '';

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            onViewportEnter={onActivate}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className={`group relative ${spanClass}`}
            onClick={onActivate}
        >
            <motion.div
                animate={{
                    scale: isActive ? 1.02 : 1,
                    borderColor: isActive ? 'rgba(255,16,240,0.5)' : 'rgba(255,255,255,0.1)',
                }}
                transition={{ duration: 0.5 }}
                className={`
          relative h-full p-8 rounded-2xl overflow-hidden cursor-pointer
          bg-gradient-to-br from-white/[0.04] to-transparent
          border border-white/10
          backdrop-blur-sm
          ${isLarge ? 'min-h-[280px]' : 'min-h-[240px]'}
        `}
            >
                {/* Animated corner decoration */}
                <motion.div
                    animate={{
                        opacity: isActive ? 1 : 0,
                        scale: isActive ? 1 : 0.8,
                    }}
                    transition={{ duration: 0.5 }}
                    className="absolute top-0 right-0 w-24 h-24"
                >
                    <div className="absolute top-4 right-4 w-12 h-12 border-t border-r border-[var(--color-accent)]" />
                </motion.div>

                {/* Glow effect on hover */}
                <motion.div
                    animate={{
                        opacity: isActive ? 0.15 : 0,
                    }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)] to-transparent"
                />

                {/* Number indicator */}
                <motion.span
                    animate={{
                        opacity: isActive ? 0.3 : 0.08,
                        x: isActive ? 0 : -10,
                        scale: isActive ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.5 }}
                    className="absolute top-4 right-6 text-8xl font-bold text-white pointer-events-none select-none"
                >
                    {String(index + 1).padStart(2, '0')}
                </motion.span>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col">
                    {/* Icon with rotation on hover */}
                    <motion.div
                        animate={{
                            color: isActive ? 'var(--color-accent)' : 'rgba(255,255,255,0.6)',
                            scale: isActive ? 1.15 : 1,
                            rotate: isActive ? 10 : 0,
                        }}
                        transition={{ duration: 0.5, type: 'spring' }}
                        className="mb-6"
                    >
                        {iconMap[service.icon] || <Target size={40} strokeWidth={1.5} />}
                    </motion.div>

                    {/* Title */}
                    <motion.h3
                        animate={{
                            color: isActive ? '#ffffff' : 'rgba(255,255,255,0.9)',
                        }}
                        transition={{ duration: 0.5 }}
                        className="text-xl md:text-2xl font-bold mb-3"
                    >
                        {service.title}
                    </motion.h3>

                    {/* Description */}
                    <motion.p
                        animate={{
                            opacity: isActive ? 0.8 : 0.5,
                        }}
                        transition={{ duration: 0.5 }}
                        className="text-sm md:text-base leading-relaxed flex-grow"
                    >
                        {service.description}
                    </motion.p>

                    {/* CTA on hover */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{
                            opacity: isActive ? 1 : 0,
                            y: isActive ? 0 : 10,
                        }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-2 text-[var(--color-accent)] text-sm font-medium mt-4"
                    >
                        <span>Saber mais</span>
                        <motion.div
                            animate={{ x: isActive ? [0, 5, 0] : 0 }}
                            transition={{ duration: 0.6, repeat: isActive ? Infinity : 0 }}
                        >
                            <ArrowRight size={16} />
                        </motion.div>
                    </motion.div>
                </div>

                {/* Bottom accent line */}
                <motion.div
                    animate={{
                        scaleX: isActive ? 1 : 0,
                    }}
                    transition={{ duration: 0.5 }}
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--color-accent)] to-transparent origin-left"
                />
            </motion.div>
        </motion.div>
    );
}

export default Services;
