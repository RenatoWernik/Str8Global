'use client';

import { motion } from 'framer-motion';
import { capabilities, stats } from '@/data/mockData';
import { CountUp } from '@/components/animations/CountUp';
import { ScrollFloat } from '@/components/animations/ScrollFloat';

export function Capabilities() {
    return (
        <section className="relative bg-black py-32 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-32">
                    {stats.map((stat, index) => (
                        <ScrollFloat key={stat.label} offset={30} direction="up">
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-5xl md:text-7xl font-bold text-[var(--color-accent)] mb-2">
                                    <CountUp end={stat.value} suffix={stat.suffix} duration={2.5} />
                                </div>
                                <div className="text-sm text-white/50 uppercase tracking-widest">
                                    {stat.label}
                                </div>
                            </motion.div>
                        </ScrollFloat>
                    ))}
                </div>

                {/* Capabilities */}
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <motion.h2
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-6xl font-bold mb-6"
                        >
                            What We Do
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-white/60 text-lg max-w-md"
                        >
                            From strategy to execution, we craft comprehensive visual experiences
                            that elevate brands and captivate audiences worldwide.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {capabilities.map((capability, index) => (
                            <motion.div
                                key={capability}
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ x: 10, color: 'var(--color-accent)' }}
                                className="text-lg md:text-xl font-medium text-white/80 cursor-default py-2 border-b border-white/10 transition-colors"
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
