'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { siteCopy } from '@/data/mockData';
import Image from 'next/image';
import { useRef, useEffect, useState, memo, useCallback } from 'react';

const galleryImages = [
    { id: '1', image: '/images/gallery/1.JPG', title: 'Legado de Roma', category: 'Arquitetura' },
    { id: '2', image: '/images/gallery/2.JPG', title: 'Instante Mágico', category: 'Urbano' },
    { id: '3', image: '/images/gallery/3.JPG', title: 'Horizonte Infinito', category: 'Paisagem' },
    { id: '4', image: '/images/gallery/4.JPG', title: 'Cores de Lisboa', category: 'Urbano' },
    { id: '5', image: '/images/gallery/5.JPG', title: 'Ouro sobre Tejo', category: 'Paisagem' },
    { id: '6', image: '/images/gallery/6.JPG', title: 'Fiel Companheiro', category: 'Retrato' },
    { id: '7', image: '/images/gallery/7.JPG', title: 'Voo Estático', category: 'Natureza' },
    { id: '8', image: '/images/gallery/8.JPG', title: 'Prece Silenciosa', category: 'Cultura' },
    { id: '9', image: '/images/gallery/9.JPG', title: 'União e Fé', category: 'Cultura' },
    { id: '10', image: '/images/gallery/10.JPG', title: 'Olhar Curioso', category: 'Natureza' }
];

export function HorizontalGallery() {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [scrollDistance, setScrollDistance] = useState(0);

    // Measure actual track width instead of guessing with isMobile
    const measureTrack = useCallback(() => {
        if (trackRef.current) {
            const trackWidth = trackRef.current.scrollWidth;
            const viewportWidth = window.innerWidth;
            setScrollDistance(Math.max(0, trackWidth - viewportWidth + 100));
        }
    }, []);

    useEffect(() => {
        measureTrack();
        let timeout: ReturnType<typeof setTimeout>;
        const debouncedMeasure = () => {
            clearTimeout(timeout);
            timeout = setTimeout(measureTrack, 200);
        };
        window.addEventListener('resize', debouncedMeasure, { passive: true });
        return () => {
            clearTimeout(timeout);
            window.removeEventListener('resize', debouncedMeasure);
        };
    }, [measureTrack]);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    const x = useTransform(scrollYProgress, [0, 1], [0, -scrollDistance]);

    return (
        <section ref={containerRef} className="relative h-[200vh] md:h-[250vh] bg-white">
            <div className="sticky top-0 h-screen overflow-hidden">
                {/* Header */}
                <div className="absolute top-8 md:top-12 left-4 md:left-6 right-4 md:right-6 z-10 flex justify-between items-center">
                    <motion.h2
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-xl sm:text-2xl md:text-5xl font-bold text-black"
                    >
                        A Nossa Visão
                    </motion.h2>
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-black/40 text-xs md:text-sm hidden md:block"
                    >
                        {siteCopy.nav.scroll} para explorar
                    </motion.span>
                </div>

                {/* Horizontal scroll container */}
                <motion.div
                    ref={trackRef}
                    style={{ x }}
                    className="flex h-full items-center gap-4 md:gap-6 pl-4 md:pl-6 absolute top-0 left-0 will-change-transform"
                >
                    {galleryImages.map((item, index) => (
                        <GalleryItem key={item.id} item={item} index={index} />
                    ))}
                </motion.div>

                {/* Progress bar */}
                <div className="absolute bottom-8 md:bottom-12 left-4 md:left-6 right-4 md:right-6 h-[2px] bg-black/10 rounded-full overflow-hidden">
                    <motion.div
                        style={{ scaleX: scrollYProgress }}
                        className="h-full bg-[var(--color-accent)] origin-left will-change-transform"
                    />
                </div>
            </div>
        </section>
    );
}

interface GalleryItemProps {
    item: (typeof galleryImages)[0];
    index: number;
}

const GalleryItem = memo(function GalleryItem({ item, index }: GalleryItemProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, delay: index * 0.02 }}
            className="relative w-[240px] sm:w-[280px] md:w-[400px] h-[55vh] sm:h-[60vh] md:h-[70vh] flex-shrink-0 rounded-xl md:rounded-2xl overflow-hidden group cursor-pointer"
            whileHover={{ scale: 0.98 }}
        >
            <Image
                src={item.image}
                alt={item.title}
                fill
                quality={75}
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 280px, 400px"
                loading={index < 3 ? 'eager' : 'lazy'}
            />

            {/* Gradient overlay — CSS only */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-40 group-hover:opacity-80 transition-opacity duration-300" />

            {/* Content — CSS-only responsive (no isMobile state) */}
            <div className="absolute bottom-0 left-0 right-0 p-4 pb-6 md:p-6 translate-y-0 opacity-100 md:translate-y-5 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-300">
                <span className="text-[10px] md:text-xs uppercase tracking-widest text-[var(--color-accent)] mb-1 block">
                    {item.category}
                </span>
                <h3 className="text-lg md:text-2xl font-bold">{item.title}</h3>
            </div>
        </motion.div>
    );
});

export default HorizontalGallery;
