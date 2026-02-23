'use client';

import { motion } from 'framer-motion';
import { capabilities, stats, siteCopy } from '@/data/mockData';
import { HighlightText } from '@/components/ui/HighlightText';
import { CountUp } from '@/components/animations/CountUp';

export function Capabilities() {
    return (
        <section className="relative bg-black py-32 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Stats */}
                <motion.h2
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-3xl sm:text-4xl md:text-6xl font-bold text-center mb-12 md:mb-16"
                >
                    {siteCopy.stats.title}
                </motion.h2>

                {/* Stats — single whileInView instead of ScrollFloat + whileInView + CountUp observer */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-32">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            className="text-center"
                        >
                            <div className="text-4xl sm:text-5xl md:text-7xl font-bold text-[var(--color-accent)] mb-2">
                                <CountUp end={stat.value} suffix={stat.suffix} duration={2.5} />
                            </div>
                            <div className="text-xs sm:text-sm text-white/50 uppercase tracking-widest leading-tight">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Capabilities */}
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <motion.h2
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6"
                        >
                            {siteCopy.capabilities.title}
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-white/60 text-lg max-w-md"
                        >
                            <HighlightText text={siteCopy.capabilities.subtitle} />
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {capabilities.map((capability, index) => (
                            <motion.div
                                key={capability}
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="text-base sm:text-lg md:text-xl font-medium text-white/80 cursor-default py-2 border-b border-white/10 hover:text-[var(--color-accent)] hover:translate-x-2 transition-all duration-300"
                            >
                                {capability}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Capabilities;
