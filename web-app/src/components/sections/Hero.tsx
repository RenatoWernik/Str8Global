'use client';

import { motion } from 'framer-motion';
import { TextReveal } from '@/components/animations/TextReveal';
import { RotatingText } from '@/components/animations/RotatingText';
import { ArrowDown } from 'lucide-react';

export function Hero() {
    const scrollToNext = () => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth',
        });
    };

    return (
        <section className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-black">
            {/* Subtle animated gradient background */}
            <motion.div
                className="absolute inset-0 opacity-30"
                animate={{
                    background: [
                        'radial-gradient(circle at 20% 50%, rgba(255,16,240,0.15) 0%, transparent 50%)',
                        'radial-gradient(circle at 80% 50%, rgba(255,16,240,0.15) 0%, transparent 50%)',
                        'radial-gradient(circle at 50% 80%, rgba(255,16,240,0.15) 0%, transparent 50%)',
                        'radial-gradient(circle at 20% 50%, rgba(255,16,240,0.15) 0%, transparent 50%)',
                    ],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            />

            {/* Main Content */}
            <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
                {/* Agency Label */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="text-sm md:text-base uppercase tracking-[0.3em] text-white/50 mb-6"
                >
                    Marketing & Photography Agency
                </motion.p>

                {/* Main Headline */}
                <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold leading-[0.9] tracking-tighter mb-8">
                    <TextReveal delay={0.4}>We Create</TextReveal>
                    <br />
                    <span className="inline-flex items-center gap-4">
                        <TextReveal delay={0.6}>Bold</TextReveal>
                        <RotatingText
                            words={['Visuals', 'Stories', 'Brands', 'Impact']}
                            className="text-[var(--color-accent)]"
                            interval={2500}
                        />
                    </span>
                </h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12"
                >
                    Premium creative studio crafting unforgettable visual experiences for brands that dare to stand out.
                </motion.p>

                {/* CTA Button */}
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-[var(--color-accent)] text-black font-semibold rounded-full hover:bg-[var(--color-accent-hover)] transition-colors"
                >
                    View Our Work
                </motion.button>
            </div>

            {/* Scroll Indicator */}
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                onClick={scrollToNext}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 hover:text-white/80 transition-colors cursor-pointer"
            >
                <span className="text-xs uppercase tracking-widest">Scroll</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    <ArrowDown size={20} />
                </motion.div>
            </motion.button>

            {/* Corner decorations */}
            <div className="absolute top-8 left-8 text-xs text-white/30 font-mono">
                STR8GLOBAL © 2024
            </div>
            <div className="absolute top-8 right-8 text-xs text-white/30 font-mono">
                PORTO, PORTUGAL
            </div>
        </section>
    );
}

export default Hero;
