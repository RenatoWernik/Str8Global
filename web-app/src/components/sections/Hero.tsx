'use client';

import { motion } from 'framer-motion';
import { TextReveal } from '@/components/animations/TextReveal';
import { RotatingText } from '@/components/animations/RotatingText';
import { PremiumLogo } from '@/components/animations/PremiumLogo';
import { siteCopy } from '@/data/mockData';

export function Hero() {
    return (
        <section className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-[#050507] py-20 md:py-0">
            {/* Video Background */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {/* Mobile Video */}
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover scale-[1.02] md:hidden"
                >
                    <source src="/studio-mobile.mp4" type="video/mp4" />
                </video>
                {/* Desktop Video */}
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover hidden md:block"
                >
                    <source src="/studio.mp4" type="video/mp4" />
                </video>
                {/* Dark overlay to ensure text readability */}
                <div className="absolute inset-0 bg-black/50" />
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
            <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
                {/* Premium Animated Logo - larger on both mobile and desktop */}
                <div className="mb-8 md:mb-10 flex justify-center">
                    <PremiumLogo size={280} className="w-[220px] h-[220px] md:w-[280px] md:h-[280px]" />
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

                {/* Main Headline */}
                <h1 className="text-4xl md:text-7xl lg:text-9xl font-bold leading-[1.1] tracking-tighter mb-6 md:mb-8">
                    <span className="block">
                        <TextReveal delay={1.7}>Criamos</TextReveal>
                    </span>
                    <span className="block">
                        <RotatingText
                            words={siteCopy.hero.rotatingWords}
                            className="text-[var(--color-accent)]"
                            interval={2500}
                        />
                    </span>
                    <span className="block">
                        <TextReveal delay={1.9}>Que Convertem.</TextReveal>
                    </span>
                </h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.2, duration: 0.8 }}
                    className="text-base md:text-xl text-white/60 max-w-2xl mx-auto"
                >
                    {siteCopy.hero.subheadline}
                </motion.p>
            </div>

            {/* Corner decorations */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute top-8 left-8 text-xs text-white/30 font-mono z-10 hidden md:block"
            >
                {siteCopy.brand.name.toUpperCase()} © 2024
            </motion.div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute top-8 right-8 text-xs text-white/30 font-mono z-10 hidden md:block"
            >
                PORTUGAL
            </motion.div>
        </section>
    );
}

export default Hero;
