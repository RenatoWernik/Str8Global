'use client';

import { motion } from 'framer-motion';
import { projects } from '@/data/mockData';
import Image from 'next/image';
import { useState } from 'react';

export function PortfolioGrid() {
    return (
        <section className="relative bg-black py-24 px-6">
            <div className="max-w-7xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl md:text-6xl font-bold text-center mb-4"
                >
                    All Projects
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="text-white/50 text-center text-lg max-w-xl mx-auto mb-16"
                >
                    Explore our complete portfolio
                </motion.p>

                {/* Masonry Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project, index) => (
                        <GridItem key={project.id} project={project} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}

interface GridItemProps {
    project: (typeof projects)[0];
    index: number;
}

function GridItem({ project, index }: GridItemProps) {
    const [isHovered, setIsHovered] = useState(false);

    // Masonry effect: alternating heights
    const heightClass = index % 3 === 0 ? 'aspect-[4/5]' : index % 3 === 1 ? 'aspect-square' : 'aspect-[5/4]';

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`relative overflow-hidden rounded-lg cursor-pointer group ${heightClass}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image */}
            <motion.div
                animate={{ scale: isHovered ? 1.1 : 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="absolute inset-0"
            >
                <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
            </motion.div>

            {/* Overlay */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-6"
            >
                <span className="text-xs uppercase tracking-widest text-[var(--color-accent)] mb-2">
                    {project.category}
                </span>
                <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                <p className="text-sm text-white/70 line-clamp-2">{project.description}</p>
            </motion.div>

            {/* Corner accent on hover */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[var(--color-accent)]"
            />
        </motion.div>
    );
}

export default PortfolioGrid;
