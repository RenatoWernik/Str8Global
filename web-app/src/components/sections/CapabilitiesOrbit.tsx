'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { HighlightText } from '@/components/ui/HighlightText';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { siteCopy } from '@/data/mockData';
import {
    Target, Camera, Video, Plane, Mic, Palette, BarChart3, Share2
} from 'lucide-react';

/**
 * ANIMATION LIBRARY: Framer Motion + requestAnimationFrame
 * WHY: Entrance reveals (Framer Motion) + continuous rotation (RAF for performance)
 * GSAP NOT USED: Continuous rotation via RAF is more performant than GSAP ticker
 * See: src/components/animations/ANIMATION_LIBRARY_GUIDE.md
 */

interface Capability {
    title: string;
    description: string;
    icon: React.ElementType;
}

const capabilitiesData: Capability[] = [
    { title: 'Estratégia de Redes Sociais', description: 'Planeamos o caminho para que a tua marca seja referência no mercado.', icon: Target },
    { title: 'Identidade Visual', description: 'Damos à tua marca o peso que o mercado exige.', icon: Palette },
    { title: 'Fotografia Profissional', description: 'Fotografia de produto que valida o teu preço.', icon: Camera },
    { title: 'Produção Publicitária', description: 'Planeamos, gravamos e editamos. No nosso estúdio ou na rua!', icon: Video },
    { title: 'Estúdio de Podcast', description: 'O espaço e o equipamento para o teu projeto ser ouvido com o padrão que o mercado exige.', icon: Mic },
    { title: 'Direcção Artística', description: 'Visão criativa que unifica cada peça numa linguagem visual coerente.', icon: Plane },
    { title: 'Marketing de Conteúdo', description: 'Criamos o conteúdo que coloca a tua marca na conversa e garante que és a única referência que importa no ecrã.', icon: BarChart3 },
    { title: 'Redes Sociais', description: 'Gerimos o teu posicionamento para que a tua marca se destaque e passe a dominar o feed.', icon: Share2 },
];

// Orbital positions for 8 nodes (evenly spaced around a circle)
function getOrbitalPosition(index: number, total: number, radius: number) {
    const angle = (index / total) * Math.PI * 2 - Math.PI / 2; // start from top
    return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        angle,
    };
}

/* ─── Desktop: Orbital Layout ─── */

function OrbitalDesktop({ isInView, prefersReducedMotion }: { isInView: boolean; prefersReducedMotion: boolean }) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const rotationRef = useRef(0);
    const groupRef = useRef<SVGGElement>(null);
    const labelsRef = useRef<(HTMLDivElement | null)[]>([]);
    const animRef = useRef<number>(0);

    const radius = 240;
    const svgSize = 640;
    const center = svgSize / 2;

    // Keep activeIndex in sync for the RAF loop without re-triggering it
    const activeIndexRef = useRef(activeIndex);
    useEffect(() => { activeIndexRef.current = activeIndex; }, [activeIndex]);

    // Slow continuous rotation via direct DOM manipulation (no React re-renders)
    useEffect(() => {
        if (!isInView || prefersReducedMotion) return;
        let last = performance.now();

        const tick = (now: number) => {
            const dt = now - last;
            last = now;
            if (activeIndexRef.current === null) {
                rotationRef.current += dt * 0.003;
            }

            // Update SVG group transform directly
            const rot = rotationRef.current;
            const rotRad = (rot * Math.PI) / 180;
            const cos = Math.cos(rotRad);
            const sin = Math.sin(rotRad);

            // Update each SVG node group via direct DOM
            if (groupRef.current) {
                const groups = groupRef.current.children;
                for (let i = 0; i < capabilitiesData.length; i++) {
                    const pos = getOrbitalPosition(i, capabilitiesData.length, radius);
                    const nx = center + pos.x * cos - pos.y * sin;
                    const ny = center + pos.x * sin + pos.y * cos;
                    const g = groups[i] as SVGGElement;
                    if (g) g.setAttribute('transform', `translate(${nx},${ny})`);

                    // Update HTML label position
                    const label = labelsRef.current[i];
                    if (label) {
                        label.style.left = `${(nx / svgSize) * 100}%`;
                        label.style.top = `${(ny / svgSize) * 100}%`;
                    }
                }
            }

            animRef.current = requestAnimationFrame(tick);
        };

        animRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(animRef.current);
    }, [isInView, prefersReducedMotion]);

    return (
        <div className="relative w-full max-w-[640px] mx-auto aspect-square hidden md:block">
            <svg
                viewBox={`0 0 ${svgSize} ${svgSize}`}
                className="w-full h-full"
            >
                <defs>
                    <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="rgb(255,16,240)" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="rgb(255,16,240)" stopOpacity="0" />
                    </radialGradient>
                    <filter id="nodeGlow">
                        <feGaussianBlur stdDeviation="6" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Center glow */}
                <circle cx={center} cy={center} r={100} fill="url(#centerGlow)" />

                {/* Orbit ring */}
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke="white"
                    strokeOpacity={0.04}
                    strokeWidth={1}
                    strokeDasharray="4 8"
                />

                {/* Connection lines from center (static, updated via CSS) */}
                <g ref={groupRef}>
                    {capabilitiesData.map((cap, i) => {
                        const pos = getOrbitalPosition(i, capabilitiesData.length, radius);
                        const nx = center + pos.x;
                        const ny = center + pos.y;
                        const isActive = activeIndex === i;

                        return (
                            <g key={i} transform={`translate(${nx},${ny})`}>
                                {/* Connection line from center */}
                                <line
                                    x1={center - nx}
                                    y1={center - ny}
                                    x2={0}
                                    y2={0}
                                    stroke="rgb(255,16,240)"
                                    strokeOpacity={isActive ? 0.3 : 0.06}
                                    strokeWidth={isActive ? 1.5 : 0.5}
                                    style={{ transition: 'stroke-opacity 0.4s, stroke-width 0.4s' }}
                                />

                                {/* Node outer ring */}
                                <circle
                                    cx={0}
                                    cy={0}
                                    r={isActive ? 38 : 32}
                                    fill={isActive ? 'rgba(255,16,240,0.08)' : 'rgba(12,12,14,0.9)'}
                                    stroke={isActive ? 'rgb(255,16,240)' : 'rgba(255,255,255,0.08)'}
                                    strokeWidth={isActive ? 2 : 1}
                                    filter={isActive ? 'url(#nodeGlow)' : undefined}
                                    style={{ transition: 'all 0.4s ease', cursor: 'pointer' }}
                                    onMouseEnter={() => setActiveIndex(i)}
                                    onMouseLeave={() => setActiveIndex(null)}
                                />

                                {/* Node number */}
                                <text
                                    x={0}
                                    y={1}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fill={isActive ? 'rgb(255,16,240)' : 'rgba(255,255,255,0.5)'}
                                    fontSize={13}
                                    fontWeight={700}
                                    fontFamily="system-ui"
                                    style={{ transition: 'fill 0.3s', cursor: 'pointer', pointerEvents: 'none' }}
                                >
                                    {String(i + 1).padStart(2, '0')}
                                </text>
                            </g>
                        );
                    })}
                </g>

                {/* Center text */}
                <text
                    x={center}
                    y={center - 8}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize={14}
                    fontWeight={800}
                    letterSpacing={2}
                >
                    STR8
                </text>
                <text
                    x={center}
                    y={center + 10}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="rgb(255,16,240)"
                    fontSize={10}
                    fontWeight={700}
                    letterSpacing={3}
                >
                    GLOBAL
                </text>
            </svg>

            {/* Floating labels around the SVG — HTML overlay */}
            {capabilitiesData.map((cap, i) => {
                const pos = getOrbitalPosition(i, capabilitiesData.length, radius);
                const normX = (center + pos.x) / svgSize;
                const normY = (center + pos.y) / svgSize;
                const isActive = activeIndex === i;
                const Icon = cap.icon;
                const labelSide = normX > 0.5 ? 'left' : 'right';

                return (
                    <motion.div
                        key={i}
                        ref={(el) => { labelsRef.current[i] = el; }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
                        className="absolute pointer-events-auto cursor-pointer"
                        style={{
                            left: `${normX * 100}%`,
                            top: `${normY * 100}%`,
                            transform: 'translate(-50%, -50%)',
                            willChange: 'left, top',
                        }}
                        onMouseEnter={() => setActiveIndex(i)}
                        onMouseLeave={() => setActiveIndex(null)}
                    >
                        <AnimatePresence>
                            {isActive && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                    transition={{ duration: 0.25 }}
                                    className={`absolute z-50 w-56 p-4 rounded-xl bg-[#0c0c0e] border border-[var(--color-accent)]/30 shadow-[0_0_30px_rgba(255,16,240,0.1)] ${labelSide === 'left' ? 'left-10' : 'right-10'} top-1/2 -translate-y-1/2`}
                                >
                                    <div className="flex items-center gap-2.5 mb-2">
                                        <Icon size={18} className="text-[var(--color-accent)]" />
                                        <span className="text-sm font-bold text-white">{cap.title}</span>
                                    </div>
                                    <p className="text-xs text-white/50 leading-relaxed">
                                        {cap.description}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                );
            })}
        </div>
    );
}

/* ─── Mobile: Interactive vertical timeline ─── */

function MobileTimeline({ isInView }: { isInView: boolean }) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <div className="md:hidden relative">
            {/* Vertical connecting line */}
            <div className="absolute left-6 top-0 bottom-0 w-px">
                <motion.div
                    initial={{ scaleY: 0 }}
                    animate={isInView ? { scaleY: 1 } : {}}
                    transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
                    className="w-full h-full bg-gradient-to-b from-[var(--color-accent)]/30 via-[var(--color-accent)]/10 to-transparent origin-top"
                />
            </div>

            <div className="space-y-2">
                {capabilitiesData.map((cap, i) => {
                    const Icon = cap.icon;
                    const isActive = activeIndex === i;

                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -30 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.2 + i * 0.08, ease: [0.25, 1, 0.5, 1] }}
                            className="relative pl-14 cursor-pointer"
                            onClick={() => setActiveIndex(isActive ? null : i)}
                        >
                            {/* Node dot */}
                            <motion.div
                                animate={{
                                    scale: isActive ? 1.3 : 1,
                                    boxShadow: isActive ? '0 0 20px rgba(255,16,240,0.4)' : '0 0 0px rgba(255,16,240,0)',
                                }}
                                transition={{ duration: 0.3 }}
                                className={`absolute left-3.5 top-4 w-5 h-5 rounded-full border-2 flex items-center justify-center z-10 transition-colors duration-300 ${
                                    isActive
                                        ? 'bg-[var(--color-accent)] border-[var(--color-accent)]'
                                        : 'bg-[#0c0c0e] border-white/15'
                                }`}
                            >
                                <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${isActive ? 'bg-black' : 'bg-white/30'}`} />
                            </motion.div>

                            {/* Card */}
                            <motion.div
                                animate={{
                                    borderColor: isActive ? 'rgba(255,16,240,0.3)' : 'rgba(255,255,255,0.05)',
                                }}
                                transition={{ duration: 0.3 }}
                                className="p-4 rounded-xl bg-white/[0.02] border border-white/5"
                            >
                                <div className="flex items-center gap-3">
                                    <motion.div
                                        animate={{ color: isActive ? 'rgb(255,16,240)' : 'rgba(255,255,255,0.4)' }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Icon size={20} />
                                    </motion.div>
                                    <span className={`text-sm font-bold transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/70'}`}>
                                        {cap.title}
                                    </span>
                                    <span className="ml-auto text-[10px] font-mono text-white/20">
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                </div>

                                <AnimatePresence>
                                    {isActive && (
                                        <motion.p
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="text-xs text-white/50 leading-relaxed mt-3 overflow-hidden"
                                        >
                                            {cap.description}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

/* ─── Main Export ─── */

export function CapabilitiesOrbit() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { margin: '-80px' });
    const prefersReducedMotion = useReducedMotion();

    return (
        <div ref={ref}>
            {/* Header */}
            <div className="text-center mb-12 md:mb-16">
                <motion.h2
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6"
                >
                    <HighlightText text={siteCopy.capabilities.title} />
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-white/60 text-base md:text-lg max-w-lg mx-auto"
                >
                    <HighlightText text={siteCopy.capabilities.subtitle} />
                </motion.p>
            </div>

            {/* Desktop: Orbital */}
            <OrbitalDesktop isInView={isInView} prefersReducedMotion={prefersReducedMotion} />

            {/* Desktop: Capability list below orbit */}
            <div className="hidden md:grid grid-cols-4 gap-4 mt-10 max-w-3xl mx-auto">
                {capabilitiesData.map((cap, i) => {
                    const Icon = cap.icon;
                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.4, delay: 0.6 + i * 0.06 }}
                            className="text-center group cursor-default"
                        >
                            <div className="text-white/30 group-hover:text-[var(--color-accent)] transition-colors duration-300 flex justify-center mb-2">
                                <Icon size={18} />
                            </div>
                            <span className="text-xs text-white/40 group-hover:text-white/70 transition-colors duration-300 font-medium">
                                {cap.title}
                            </span>
                        </motion.div>
                    );
                })}
            </div>

            {/* Mobile: Timeline */}
            <MobileTimeline isInView={isInView} />
        </div>
    );
}

export default CapabilitiesOrbit;
