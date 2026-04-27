'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { TypewriterText } from '@/components/animations/TypewriterText';
import { PremiumLogo } from '@/components/animations/PremiumLogo';
import { siteCopy } from '@/data/mockData';
import { HighlightText } from '@/components/ui/HighlightText';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';

const Globe = dynamic(
    () => import('@/components/ui/globe').then(mod => ({ default: mod.Globe })),
    { ssr: false, loading: () => <div className="w-full h-full" /> }
);

const STATIC_TEXT = 'A Tua Marca Merece';
const TYPING_SPEED = 80;
const STATIC_TYPING_DELAY = 1700;

/**
 * Types text once and stops. Uses refs to avoid stale closure issues.
 */
function StaticTypewriter({
    text,
    className,
    delay = 0,
    typingSpeed = 80,
    onComplete,
}: {
    text: string;
    className?: string;
    delay?: number;
    typingSpeed?: number;
    onComplete?: () => void;
}) {
    const [display, setDisplay] = useState('');
    const [cursorVisible, setCursorVisible] = useState(false);
    const [showCursor, setShowCursor] = useState(true);
    const charIndexRef = useRef(0);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const onCompleteRef = useRef(onComplete);
    onCompleteRef.current = onComplete;

    useEffect(() => {
        const clear = () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        };

        const tick = () => {
            charIndexRef.current++;
            const newText = text.substring(0, charIndexRef.current);
            setDisplay(newText);

            if (charIndexRef.current >= text.length) {
                // Done typing
                onCompleteRef.current?.();
                // Hide cursor after a small delay
                timerRef.current = setTimeout(() => setShowCursor(false), 500);
            } else {
                timerRef.current = setTimeout(tick, typingSpeed);
            }
        };

        // Start after delay
        charIndexRef.current = 0;
        timerRef.current = setTimeout(() => {
            setCursorVisible(true);
            tick();
        }, delay);

        return clear;
    }, [text, delay, typingSpeed]);

    // Cursor blink
    useEffect(() => {
        if (!showCursor) return;
        const interval = setInterval(() => {
            setCursorVisible(v => !v);
        }, 530);
        return () => clearInterval(interval);
    }, [showCursor]);

    return (
        <span className={cn('inline-block relative', className)}>
            {display}
            {showCursor && (
                <span
                    className="inline-block w-[3px] md:w-[5px] h-[0.9em] bg-white align-middle ml-1 md:ml-2 -mt-1 md:-mt-2 transition-opacity duration-100"
                    style={{ opacity: cursorVisible ? 1 : 0 }}
                />
            )}
        </span>
    );
}

export function Hero() {
    const [staticDone, setStaticDone] = useState(false);

    return (
        <section className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-[#050507] py-20 md:py-0">
            {/* Globe Background */}
            <div className="absolute inset-x-0 -top-20 -bottom-20 z-0 overflow-hidden flex flex-col justify-center items-center">
                <div className="absolute inset-x-0 top-[18%] sm:top-[28%] md:top-[30%] lg:top-[25%] z-0 flex justify-center items-start pointer-events-none">
                    <div className="relative w-[92%] sm:w-[180%] md:w-[200%] max-w-[420px] sm:max-w-[800px] md:max-w-[2000px] lg:max-w-[2500px] aspect-square pointer-events-auto opacity-100">
                        <Globe className="opacity-100" />
                    </div>
                </div>
                <div className="absolute inset-0 bg-black/60 z-10 pointer-events-none" />
            </div>

            {/* Accent gradient overlay */}
            <div
                className="absolute inset-0 pointer-events-none z-[2]"
                style={{
                    background: 'radial-gradient(ellipse at 50% 0%, rgba(255,16,240,0.08) 0%, transparent 60%)',
                }}
            />

            {/* Dark gradient overlay for depth */}
            <div
                className="absolute inset-0 pointer-events-none z-[4]"
                style={{
                    background: 'linear-gradient(180deg, rgba(5,5,7,0.3) 0%, transparent 30%, transparent 70%, rgba(5,5,7,0.5) 100%)',
                }}
            />

            {/* Main Content */}
            <div className="relative z-10 text-center px-4 sm:px-6 max-w-6xl mx-auto">
                {/* Premium Animated Logo */}
                <div className="mb-8 md:mb-10 flex justify-center">
                    <PremiumLogo size={280} className="w-[160px] h-[160px] sm:w-[200px] sm:h-[200px] md:w-[280px] md:h-[280px]" />
                </div>

                {/* Agency Label */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.8 }}
                    className="text-sm md:text-base uppercase tracking-[0.3em] text-white/50 mb-4 md:mb-6"
                >
                    {siteCopy.brand.tagline}
                </motion.p>

                {/* Main Headline — H1 for SEO */}
                <h1 className="text-3xl sm:text-4xl md:text-7xl lg:text-9xl font-bold leading-[1.1] tracking-tighter mb-6 md:mb-8">
                    <span className="block">
                        <StaticTypewriter
                            text={STATIC_TEXT}
                            delay={STATIC_TYPING_DELAY}
                            typingSpeed={TYPING_SPEED}
                            onComplete={() => setStaticDone(true)}
                        />
                    </span>
                    <span className="block min-h-[1.2em]">
                        {staticDone && (
                            <TypewriterText
                                words={siteCopy.hero.rotatingWords}
                                className="text-[var(--color-accent)]"
                                typingSpeed={TYPING_SPEED}
                                deletingSpeed={50}
                                pauseDuration={1800}
                                initialDelay={300}
                            />
                        )}
                    </span>
                </h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.2, duration: 0.8 }}
                    className="text-sm sm:text-base md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed"
                >
                    <HighlightText text={siteCopy.hero.subheadline} />
                </motion.p>
            </div>

            {/* Corner decorations */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute top-8 left-8 text-xs text-white/30 font-mono z-10 hidden md:block"
            >
                {siteCopy.brand.name.toUpperCase()} © {new Date().getFullYear()}
            </motion.div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute top-8 right-8 text-xs text-white/30 font-mono z-10 hidden md:block"
            >
                A SERVIR LISBOA & CASCAIS
            </motion.div>
        </section>
    );
}

export default Hero;
