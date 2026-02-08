'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { projects, siteCopy } from '@/data/mockData';
import Image from 'next/image';
import { useRef } from 'react';

export function HorizontalGallery() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    const x = useTransform(scrollYProgress, [0, 1], ['0%', `-${(projects.length - 1) * 100}%`]);

    return (
        <section ref={containerRef} className="relative h-[400vh] bg-black">
            <div className="sticky top-0 h-screen overflow-hidden">
                {/* Header */}
                <div className="absolute top-12 left-6 right-6 z-10 flex justify-between items-center">
                    <motion.h2
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold"
                    >
                        Galeria
                    </motion.h2>
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-white/50 text-sm"
                    >
                        {siteCopy.nav.scroll} para explorar
                    </motion.span>
                </div>

                {/* Horizontal scroll container */}
                <motion.div
                    style={{ x }}
                    className="flex h-full items-center gap-8 pl-6 absolute top-0 left-0"
                >
                    {projects.map((project, index) => (
                        <GalleryItem key={project.id} project={project} index={index} />
                    ))}
                </motion.div>

                {/* Progress bar */}
                <motion.div
                    className="absolute bottom-12 left-6 right-6 h-[2px] bg-white/10 rounded-full overflow-hidden"
                >
                    <motion.div
                        style={{ scaleX: scrollYProgress }}
                        className="h-full bg-[var(--color-accent)] origin-left"
                    />
                </motion.div>
            </div>
        </section>
    );
}

interface GalleryItemProps {
    project: (typeof projects)[0];
    index: number;
}

function GalleryItem({ project }: GalleryItemProps) {
    return (
        <motion.div
            className="relative w-[80vw] md:w-[60vw] lg:w-[50vw] h-[60vh] flex-shrink-0 rounded-2xl overflow-hidden group cursor-pointer"
            whileHover={{ scale: 0.98 }}
            transition={{ duration: 0.3 }}
        >
            <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="80vw"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-8 left-8 right-8">
                    <span className="text-xs uppercase tracking-widest text-[var(--color-accent)] mb-2 block">
                        {project.category}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold">{project.title}</h3>
                </div>
            </div>
        </motion.div>
    );
}

export default HorizontalGallery;
