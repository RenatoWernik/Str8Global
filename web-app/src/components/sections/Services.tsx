'use client';

import { motion } from 'framer-motion';
import { services, siteCopy } from '@/data/mockData';
import { HighlightText } from '@/components/ui/HighlightText';
import { useRef, useState, useEffect } from 'react';
import {
    Target, Camera, Video, Plane, Package, Calendar, Mic, Share2, ArrowRight
} from 'lucide-react';
import dynamic from 'next/dynamic';

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

// Lazy load ScrollStack — only needed on mobile
const ScrollStack = dynamic(() => import('@/components/ui/ScrollStack'), { ssr: false });
const ScrollStackItemModule = dynamic(
    () => import('@/components/ui/ScrollStack').then(mod => {
        const Wrapper = ({ children }: { children: React.ReactNode }) => (
            <mod.ScrollStackItem>{children}</mod.ScrollStackItem>
        );
        Wrapper.displayName = 'ScrollStackItem';
        return Wrapper;
    }),
    { ssr: false }
);

export function Services() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia('(max-width: 767px)');
        setIsMobile(mq.matches);
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    return (
        <section ref={containerRef} className="relative bg-[#020202] py-20 md:py-32 overflow-hidden">
            {/* Animated grid background */}
            <div className="absolute inset-[-50%] opacity-[0.03] pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(rgba(255,16,240,0.5) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,16,240,0.5) 1px, transparent 1px)`,
                    backgroundSize: '80px 80px',
                }} />
            </div>

            {/* Floating orbs */}
            <div className="absolute top-20 left-10 w-96 h-96 bg-[var(--color-accent)] rounded-full blur-[150px] opacity-10 pointer-events-none" />
            <div className="absolute bottom-20 right-10 w-72 h-72 bg-[var(--color-accent)] rounded-full blur-[120px] opacity-10 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 md:mb-24">
                    <div>
                        <motion.span
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: '100px' }}
                            transition={{ duration: 0.6 }}
                            className="text-[var(--color-accent)] text-sm uppercase tracking-[0.3em] mb-4 block font-medium"
                        >
                            Serviços
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: '100px' }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="text-3xl sm:text-4xl md:text-7xl lg:text-8xl font-bold leading-tight"
                        >
                            {siteCopy.services.title}
                        </motion.h2>
                    </div>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '100px' }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-white/60 text-lg md:text-xl font-medium max-w-lg mt-6 lg:mt-0 lg:text-right"
                    >
                        <HighlightText text={siteCopy.services.subtitle} />
                    </motion.p>
                </div>

                {/* Desktop: Bento Grid (md+) */}
                {!isMobile && (
                    <div className="grid grid-flow-row-dense grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[minmax(250px,auto)] md:auto-rows-[minmax(280px,auto)] lg:auto-rows-[minmax(280px,auto)]">
                        {services.map((service, index) => (
                            <ServiceCard
                                key={service.id}
                                service={service}
                                index={index}
                                isActive={activeIndex === index}
                                onActivate={() => setActiveIndex(index)}
                                onMouseLeave={() => setActiveIndex(null)}
                            />
                        ))}
                    </div>
                )}

                {/* Mobile: ScrollStack stacking cards (<768px) */}
                {isMobile && (
                    <ScrollStack
                        itemDistance={40}
                        itemStackDistance={20}
                        stackPosition="25%"
                        scaleEndPosition="8%"
                        baseScale={0.92}
                        itemScale={0.02}
                    >
                        {services.map((service, index) => (
                            <ScrollStackItemModule key={service.id}>
                                <MobileServiceCard service={service} index={index} />
                            </ScrollStackItemModule>
                        ))}
                    </ScrollStack>
                )}
            </div>
        </section>
    );
}

/* ─── Desktop Service Card ─── */

interface ServiceCardProps {
    service: (typeof services)[0];
    index: number;
    isActive: boolean;
    onActivate: () => void;
    onMouseLeave: () => void;
}

function ServiceCard({ service, index, isActive, onActivate, onMouseLeave }: ServiceCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    let spanClass = 'col-span-1 row-span-1';
    let isLarge = false;

    if (index === 0 || index === 3 || index === 4 || index === 7) {
        spanClass = 'col-span-1 md:col-span-2 lg:col-span-2 row-span-1';
        isLarge = true;
    } else {
        spanClass = 'col-span-1 md:col-span-1 lg:col-span-1 row-span-1';
    }

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.05, ease: [0.25, 1, 0.5, 1] }}
            className={`group relative ${spanClass} cursor-pointer`}
            onMouseEnter={onActivate}
            onMouseLeave={onMouseLeave}
            onClick={onActivate}
        >
            <motion.div
                animate={{
                    y: isActive ? -8 : 0,
                    scale: isActive && !isLarge ? 1.02 : 1,
                    boxShadow: isActive ? '0 20px 40px rgba(0,0,0,0.5), 0 0 40px rgba(255,16,240,0.1)' : '0 10px 30px rgba(0,0,0,0.3), 0 0 0px rgba(255,16,240,0)',
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={`
                  relative flex flex-col h-full w-full rounded-2xl md:rounded-3xl overflow-hidden
                  bg-[#0a0a0a] border border-white/5
                `}
            >
                {/* LED border glow */}
                <div
                    className="absolute inset-0 rounded-2xl md:rounded-3xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-screen pointer-events-none z-0"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255,16,240,0.3) 0%, transparent 50%, rgba(255,16,240,0.15) 100%)',
                    }}
                />

                <div className="absolute inset-[1px] md:inset-[2px] z-[2] rounded-[15px] md:rounded-[22px] bg-[#0c0c0e]" />
                <div className="absolute top-0 left-0 right-0 h-[100px] z-[3] bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none rounded-t-[15px] md:rounded-t-[22px]" />

                <div className="relative z-[4] flex-1 p-5 md:p-6 lg:p-8 flex flex-col">
                    <motion.div
                        animate={{ opacity: isActive ? 1 : 0.3, scale: isActive ? 1 : 0.8 }}
                        transition={{ duration: 0.4 }}
                        className="absolute top-0 right-0 w-24 h-24 pointer-events-none overflow-hidden rounded-tr-[15px] md:rounded-tr-[22px]"
                    >
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[var(--color-accent)]/20 to-transparent blur-xl" />
                    </motion.div>

                    <motion.span
                        animate={{ opacity: isActive ? 0.08 : 0.03, scale: isActive ? 1.05 : 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute bottom-[-5%] right-[0%] text-[8rem] md:text-[10rem] lg:text-[12rem] font-black text-white pointer-events-none select-none leading-none tracking-tighter"
                    >
                        {String(index + 1).padStart(2, '0')}
                    </motion.span>

                    <div className="relative z-10 h-full flex flex-col pointer-events-none justify-between">
                        <div className="w-full">
                            <motion.div
                                animate={{
                                    color: isActive ? 'var(--color-accent)' : 'rgba(255,255,255,0.7)',
                                    scale: isActive ? 1.1 : 1,
                                    rotate: isActive ? 5 : 0,
                                }}
                                transition={{ duration: 0.4, type: 'spring' }}
                                className="mb-6 inline-flex p-3 rounded-xl bg-white/5 border border-white/10 shadow-lg"
                            >
                                {iconMap[service.icon] || <Target size={32} strokeWidth={1.5} />}
                            </motion.div>

                            <motion.h3
                                animate={{ color: isActive ? '#ffffff' : 'rgba(255,255,255,0.9)' }}
                                transition={{ duration: 0.4 }}
                                style={
                                    service.title === 'Cinematografia' || service.title === 'Fotografia Premium' || service.title === 'Estúdio & Podcasting'
                                        ? { fontSize: isLarge ? '1.25rem' : '1.125rem' }
                                        : undefined
                                }
                                className={`font-bold mb-2 md:mb-3 tracking-tight ${service.title === 'Cinematografia' || service.title === 'Fotografia Premium' || service.title === 'Estúdio & Podcasting'
                                    ? ''
                                    : (isLarge ? 'text-lg md:text-xl lg:text-2xl' : 'text-base md:text-lg lg:text-xl')
                                    }`}
                            >
                                {service.title}
                            </motion.h3>
                        </div>

                        <div className="mt-auto pt-4 relative">
                            <motion.p
                                animate={{ opacity: isActive ? 0.9 : 0.6, y: isActive ? -5 : 0 }}
                                transition={{ duration: 0.4 }}
                                className={`leading-relaxed max-w-xl font-medium ${isLarge ? 'text-base md:text-lg' : 'text-sm md:text-base'}`}
                            >
                                <HighlightText text={service.description} />
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -10 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                                className="absolute -bottom-2 flex items-center gap-2 text-[var(--color-accent)] text-sm md:text-base font-bold pointer-events-auto"
                            >
                                <span>Ver Operação</span>
                                <ArrowRight size={18} />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

/* ─── Mobile Service Card (for ScrollStack) ─── */

function MobileServiceCard({ service, index }: { service: (typeof services)[0]; index: number }) {
    return (
        <div className="relative rounded-2xl overflow-hidden bg-[#0a0a0a] border border-white/8">
            <div className="absolute inset-[1px] z-[1] rounded-[15px] bg-[#0c0c0e]" />
            <div className="absolute top-0 left-0 right-0 h-16 z-[2] bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none rounded-t-[15px]" />

            <div className="relative z-[3] p-5 flex flex-col min-h-[200px]">
                {/* Number watermark */}
                <span className="absolute bottom-[-8%] right-[2%] text-[7rem] font-black text-white/[0.04] pointer-events-none select-none leading-none tracking-tighter">
                    {String(index + 1).padStart(2, '0')}
                </span>

                {/* Icon + Title row */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[var(--color-accent)]">
                        {iconMap[service.icon] || <Target size={28} strokeWidth={1.5} />}
                    </div>
                    <h3 className="text-base font-bold tracking-tight text-white/90">
                        {service.title}
                    </h3>
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed text-white/50 font-medium mb-4">
                    <HighlightText text={service.description} />
                </p>

                {/* CTA */}
                <div className="mt-auto flex items-center gap-2 text-[var(--color-accent)] text-sm font-bold">
                    <span>Ver Operação</span>
                    <ArrowRight size={16} />
                </div>
            </div>
        </div>
    );
}

export default Services;
