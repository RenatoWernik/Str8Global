'use client';

import { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { HighlightText } from '@/components/ui/HighlightText';
import { siteCopy } from '@/data/mockData';

// Data points: month → conversion %
const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

const withoutData = [1.2, 1.3, 1.1, 1.4, 1.2, 1.5, 1.3, 1.1, 1.4, 1.2, 1.3, 1.5];
const withData =    [1.2, 2.1, 3.4, 4.8, 5.9, 7.2, 8.1, 9.5, 10.8, 12.1, 13.2, 14.6];

const maxY = 16;
const yTicks = [0, 4, 8, 12, 16];

// Chart dimensions
const CHART = {
    w: 720,
    h: 380,
    pt: 30,   // padding top
    pr: 20,   // padding right
    pb: 50,   // padding bottom
    pl: 50,   // padding left
};

const plotW = CHART.w - CHART.pl - CHART.pr;
const plotH = CHART.h - CHART.pt - CHART.pb;

function toX(i: number) {
    return CHART.pl + (i / (months.length - 1)) * plotW;
}
function toY(val: number) {
    return CHART.pt + plotH - (val / maxY) * plotH;
}

function buildPath(data: number[]): string {
    return data.map((v, i) => `${i === 0 ? 'M' : 'L'}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(' ');
}

function buildAreaPath(data: number[]): string {
    const line = data.map((v, i) => `${i === 0 ? 'M' : 'L'}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(' ');
    return `${line} L${toX(data.length - 1).toFixed(1)},${toY(0).toFixed(1)} L${toX(0).toFixed(1)},${toY(0).toFixed(1)} Z`;
}

// Smooth cubic bezier path for nicer curves
function buildSmoothPath(data: number[]): string {
    if (data.length < 2) return '';
    let d = `M${toX(0).toFixed(1)},${toY(data[0]).toFixed(1)}`;
    for (let i = 1; i < data.length; i++) {
        const x0 = toX(i - 1);
        const y0 = toY(data[i - 1]);
        const x1 = toX(i);
        const y1 = toY(data[i]);
        const cpx = (x0 + x1) / 2;
        d += ` C${cpx.toFixed(1)},${y0.toFixed(1)} ${cpx.toFixed(1)},${y1.toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)}`;
    }
    return d;
}

function buildSmoothAreaPath(data: number[]): string {
    const curve = buildSmoothPath(data);
    return `${curve} L${toX(data.length - 1).toFixed(1)},${toY(0).toFixed(1)} L${toX(0).toFixed(1)},${toY(0).toFixed(1)} Z`;
}

export function ResultsComparison() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [isRevealed, setIsRevealed] = useState(false);

    // Auto-reveal "Com" line after "Sem" draws
    useEffect(() => {
        if (!isInView) return;
        const timer = setTimeout(() => setIsRevealed(true), 1600);
        return () => clearTimeout(timer);
    }, [isInView]);

    const withoutPath = buildSmoothPath(withoutData);
    const withPath = buildSmoothPath(withData);
    const withoutAreaPath = buildSmoothAreaPath(withoutData);
    const withAreaPath = buildSmoothAreaPath(withData);

    // Measure total path length for stroke animation (once)
    const [withoutLen, setWithoutLen] = useState(1200);
    const [withLen, setWithLen] = useState(1200);
    const withoutLineRef = useRef<SVGPathElement>(null);
    const withLineRef = useRef<SVGPathElement>(null);

    useLayoutEffect(() => {
        if (withoutLineRef.current) setWithoutLen(withoutLineRef.current.getTotalLength());
        if (withLineRef.current) setWithLen(withLineRef.current.getTotalLength());
    }, []);

    // Hover detection throttled to ~60fps via RAF
    const rafRef = useRef(0);
    const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
        if (rafRef.current) return;
        const clientX = e.clientX;
        rafRef.current = requestAnimationFrame(() => {
            rafRef.current = 0;
            const svg = svgRef.current;
            if (!svg) return;
            const rect = svg.getBoundingClientRect();
            const scaleX = CHART.w / rect.width;
            const mouseX = (clientX - rect.left) * scaleX;
            const relX = mouseX - CHART.pl;
            if (relX < 0 || relX > plotW) { setHoveredIndex(null); return; }
            const idx = Math.round((relX / plotW) * (months.length - 1));
            setHoveredIndex(Math.max(0, Math.min(idx, months.length - 1)));
        });
    }, []);

    const handleMouseLeave = useCallback(() => setHoveredIndex(null), []);

    return (
        <div ref={sectionRef}>
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
                className="text-white/50 text-center text-sm md:text-base max-w-lg mx-auto mb-10 md:mb-14"
            >
                Taxa de conversão ao longo de 12 meses — dados médios dos nossos clientes.
            </motion.p>

            {/* Chart container */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative max-w-3xl mx-auto"
            >
                {/* Glow — hidden on mobile */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-[var(--color-accent)] rounded-full blur-[250px] opacity-[0.03] pointer-events-none hidden md:block" />

                {/* Chart card */}
                <div className="relative z-10 p-4 md:p-6 rounded-2xl md:rounded-3xl bg-white/[0.02] border border-white/5">

                    {/* Legend */}
                    <div className="flex items-center justify-center gap-6 md:gap-8 mb-4 md:mb-6">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-[3px] rounded-full bg-white/20" />
                            <span className="text-xs md:text-sm text-white/40">Sem Str8Global</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-[3px] rounded-full bg-[var(--color-accent)]" />
                            <span className="text-xs md:text-sm text-white/70 font-medium">Com Str8Global</span>
                        </div>
                    </div>

                    {/* SVG Chart */}
                    <svg
                        ref={svgRef}
                        viewBox={`0 0 ${CHART.w} ${CHART.h}`}
                        className="w-full h-auto select-none"
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                    >
                        <defs>
                            {/* Accent gradient for area fill */}
                            <linearGradient id="accentAreaGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="rgb(255,16,240)" stopOpacity="0.25" />
                                <stop offset="100%" stopColor="rgb(255,16,240)" stopOpacity="0" />
                            </linearGradient>
                            <linearGradient id="greyAreaGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="white" stopOpacity="0.04" />
                                <stop offset="100%" stopColor="white" stopOpacity="0" />
                            </linearGradient>
                            {/* Glow filter for accent line */}
                            <filter id="accentGlow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="4" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Y-axis grid lines */}
                        {yTicks.map((tick) => (
                            <g key={tick}>
                                <line
                                    x1={CHART.pl}
                                    y1={toY(tick)}
                                    x2={CHART.w - CHART.pr}
                                    y2={toY(tick)}
                                    stroke="white"
                                    strokeOpacity={tick === 0 ? 0.1 : 0.04}
                                    strokeDasharray={tick === 0 ? undefined : '4 4'}
                                />
                                <text
                                    x={CHART.pl - 12}
                                    y={toY(tick) + 4}
                                    textAnchor="end"
                                    fill="white"
                                    fillOpacity={0.3}
                                    fontSize={11}
                                    fontFamily="monospace"
                                >
                                    {tick}%
                                </text>
                            </g>
                        ))}

                        {/* X-axis labels */}
                        {months.map((m, i) => (
                            <text
                                key={m}
                                x={toX(i)}
                                y={CHART.h - CHART.pb + 28}
                                textAnchor="middle"
                                fill="white"
                                fillOpacity={hoveredIndex === i ? 0.9 : 0.3}
                                fontSize={11}
                                fontFamily="monospace"
                                fontWeight={hoveredIndex === i ? 700 : 400}
                            >
                                {m}
                            </text>
                        ))}

                        {/* "Sem" area + line */}
                        <path
                            d={withoutAreaPath}
                            fill="url(#greyAreaGrad)"
                            opacity={isInView ? 1 : 0}
                            style={{ transition: 'opacity 0.6s ease' }}
                        />
                        <path
                            ref={withoutLineRef}
                            d={withoutPath}
                            fill="none"
                            stroke="white"
                            strokeOpacity={0.15}
                            strokeWidth={2.5}
                            strokeLinecap="round"
                            strokeDasharray={withoutLen}
                            strokeDashoffset={isInView ? 0 : withoutLen}
                            style={{ transition: `stroke-dashoffset 1.5s cubic-bezier(0.25,1,0.5,1)` }}
                        />

                        {/* "Com" area + line */}
                        <path
                            d={withAreaPath}
                            fill="url(#accentAreaGrad)"
                            opacity={isRevealed ? 1 : 0}
                            style={{ transition: 'opacity 0.8s ease 0.3s' }}
                        />
                        <path
                            ref={withLineRef}
                            d={withPath}
                            fill="none"
                            stroke="rgb(255,16,240)"
                            strokeWidth={3}
                            strokeLinecap="round"
                            filter="url(#accentGlow)"
                            strokeDasharray={withLen}
                            strokeDashoffset={isRevealed ? 0 : withLen}
                            style={{ transition: `stroke-dashoffset 2s cubic-bezier(0.25,1,0.5,1) 0.2s` }}
                        />

                        {/* Data points on "Sem" line */}
                        {withoutData.map((v, i) => (
                            <circle
                                key={`wo-${i}`}
                                cx={toX(i)}
                                cy={toY(v)}
                                r={hoveredIndex === i ? 5 : 3}
                                fill="#0c0c0e"
                                stroke="white"
                                strokeOpacity={0.2}
                                strokeWidth={1.5}
                                opacity={isInView ? 1 : 0}
                                style={{ transition: `opacity 0.4s ease ${0.8 + i * 0.05}s, r 0.2s ease` }}
                            />
                        ))}

                        {/* Data points on "Com" line */}
                        {withData.map((v, i) => (
                            <circle
                                key={`w-${i}`}
                                cx={toX(i)}
                                cy={toY(v)}
                                r={hoveredIndex === i ? 6 : 3.5}
                                fill="rgb(255,16,240)"
                                stroke="rgb(255,16,240)"
                                strokeOpacity={0.4}
                                strokeWidth={hoveredIndex === i ? 3 : 1.5}
                                opacity={isRevealed ? 1 : 0}
                                style={{ transition: `opacity 0.4s ease ${0.4 + i * 0.06}s, r 0.2s ease, stroke-width 0.2s ease` }}
                            />
                        ))}

                        {/* Hover vertical line + tooltip */}
                        {hoveredIndex !== null && (
                            <>
                                <line
                                    x1={toX(hoveredIndex)}
                                    y1={CHART.pt}
                                    x2={toX(hoveredIndex)}
                                    y2={toY(0)}
                                    stroke="white"
                                    strokeOpacity={0.08}
                                    strokeWidth={1}
                                    strokeDasharray="3 3"
                                />

                                {/* Tooltip — "Sem" */}
                                <g>
                                    <rect
                                        x={toX(hoveredIndex) - 38}
                                        y={toY(withoutData[hoveredIndex]) - 28}
                                        width={76}
                                        height={22}
                                        rx={6}
                                        fill="#1a1a1a"
                                        stroke="white"
                                        strokeOpacity={0.1}
                                        strokeWidth={1}
                                    />
                                    <text
                                        x={toX(hoveredIndex)}
                                        y={toY(withoutData[hoveredIndex]) - 13}
                                        textAnchor="middle"
                                        fill="white"
                                        fillOpacity={0.5}
                                        fontSize={11}
                                        fontWeight={600}
                                        fontFamily="monospace"
                                    >
                                        Sem: {withoutData[hoveredIndex]}%
                                    </text>
                                </g>

                                {/* Tooltip — "Com" */}
                                {isRevealed && (
                                    <g>
                                        <rect
                                            x={toX(hoveredIndex) - 38}
                                            y={toY(withData[hoveredIndex]) - 28}
                                            width={76}
                                            height={22}
                                            rx={6}
                                            fill="rgb(255,16,240)"
                                            fillOpacity={0.2}
                                            stroke="rgb(255,16,240)"
                                            strokeOpacity={0.3}
                                            strokeWidth={1}
                                        />
                                        <text
                                            x={toX(hoveredIndex)}
                                            y={toY(withData[hoveredIndex]) - 13}
                                            textAnchor="middle"
                                            fill="rgb(255,16,240)"
                                            fontSize={11}
                                            fontWeight={700}
                                            fontFamily="monospace"
                                        >
                                            Com: {withData[hoveredIndex]}%
                                        </text>
                                    </g>
                                )}
                            </>
                        )}
                    </svg>

                    {/* Y-axis label */}
                    <div className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] md:text-xs text-white/20 uppercase tracking-widest whitespace-nowrap font-mono">
                        Taxa de Conversão
                    </div>
                </div>

                {/* Bottom summary card */}
                <AnimatePresence>
                    {isRevealed && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1.8 }}
                            className="mt-6 md:mt-8 p-4 md:p-5 rounded-xl bg-white/[0.02] border border-white/5 text-center"
                        >
                            <p className="text-white/50 text-sm md:text-base">
                                Mês 12 — conversão{' '}
                                <span className="text-white/30 line-through">1.5%</span>
                                {' → '}
                                <span className="text-[var(--color-accent)] font-bold text-lg">14.6%</span>
                                {' — '}
                                um aumento de{' '}
                                <span className="text-[var(--color-accent)] font-bold">9.7x</span>
                                {'. '}
                                <span className="text-white/30">A diferença não é sorte — é ecossistema.</span>
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

export default ResultsComparison;
