'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { InfiniteCarousel } from '@/components/animations/InfiniteCarousel';
import { HighlightText } from '@/components/ui/HighlightText';
import { clients, siteCopy } from '@/data/mockData';

export function ClientsSection() {
    return (
        <section className="relative bg-black py-24 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 mb-16">
                <motion.h2
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-3xl sm:text-4xl md:text-6xl font-bold text-center mb-4 text-white"
                >
                    <HighlightText text={siteCopy.clients.title} />
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="text-white/70 text-center text-lg max-w-xl mx-auto"
                >
                    <HighlightText text={siteCopy.clients.subtitle} />
                </motion.p>
            </div>

            <InfiniteCarousel speed={40} direction="left">
                {clients.map((client) => (
                    <ClientLogo key={client.id} client={client} />
                ))}
            </InfiniteCarousel>

            <div className="h-8" />

            <InfiniteCarousel speed={35} direction="right">
                {[...clients].reverse().map((client) => (
                    <ClientLogo key={`rev-${client.id}`} client={client} />
                ))}
            </InfiniteCarousel>
        </section>
    );
}

function ClientLogo({ client }: { client: { name: string; logo: string } }) {
    const isLarge = client.name === 'Worten' || client.name === 'KuantoKusta';
    return (
        <div className="flex items-center justify-center w-40 h-20 sm:w-56 sm:h-28 bg-white/5 rounded-lg border border-white/10 hover:border-[var(--color-accent)] hover:scale-110 transition-all duration-200 cursor-pointer group relative overflow-hidden">
            <Image
                src={client.logo}
                alt={client.name}
                fill
                sizes="(max-width: 640px) 160px, 224px"
                className={`object-contain transition-all duration-300 ${isLarge ? 'p-1 sm:p-2 scale-110' : 'p-3 sm:p-4'
                    }`}
            />
        </div>
    );
}

export default ClientsSection;
