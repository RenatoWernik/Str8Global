'use client';

import { motion } from 'framer-motion';
import { InfiniteCarousel } from '@/components/animations/InfiniteCarousel';
import { clients } from '@/data/mockData';

export function ClientsSection() {
    return (
        <section className="relative bg-black py-24 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 mb-16">
                <motion.h2
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl md:text-6xl font-bold text-center mb-4"
                >
                    Trusted By
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="text-white/50 text-center text-lg max-w-xl mx-auto"
                >
                    We&apos;ve partnered with leading global brands
                </motion.p>
            </div>

            <InfiniteCarousel speed={40} direction="left">
                {clients.map((client) => (
                    <ClientLogo key={client.id} name={client.name} />
                ))}
            </InfiniteCarousel>

            <div className="h-8" />

            <InfiniteCarousel speed={35} direction="right">
                {[...clients].reverse().map((client) => (
                    <ClientLogo key={client.id} name={client.name} />
                ))}
            </InfiniteCarousel>
        </section>
    );
}

function ClientLogo({ name }: { name: string }) {
    return (
        <motion.div
            whileHover={{ scale: 1.1 }}
            className="flex items-center justify-center w-40 h-20 bg-white/5 rounded-lg border border-white/10 hover:border-[var(--color-accent)] transition-colors cursor-pointer group"
        >
            <span className="text-white/40 group-hover:text-[var(--color-accent)] font-bold text-lg transition-colors">
                {name}
            </span>
        </motion.div>
    );
}

export default ClientsSection;
