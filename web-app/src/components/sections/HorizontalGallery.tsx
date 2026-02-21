'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { siteCopy } from '@/data/mockData';
import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';

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
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    // Smooth continuous scroll - calculates based on number of images
    // Using linear transform without any easing that could cause "locking"
    const totalWidth = galleryImages.length * (isMobile ? 300 : 420); // Approximate item width
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const scrollDistance = totalWidth - viewportWidth + 100;

    const x = useTransform(scrollYProgress, [0, 1], [0, -scrollDistance]);

    return (
        <section ref={containerRef} className="relative h-[200vh] md:h-[250vh] bg-black">
            <div className="sticky top-0 h-screen overflow-hidden">
                {/* Header */}
                <div className="absolute top-8 md:top-12 left-4 md:left-6 right-4 md:right-6 z-10 flex justify-between items-center">
                    <motion.h2
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-2xl md:text-5xl font-bold"
                    >
                        A Nossa Visão
                    </motion.h2>
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-white/50 text-xs md:text-sm hidden md:block"
                    >
                        {siteCopy.nav.scroll} para explorar
                    </motion.span>
                </div>

                {/* Horizontal scroll container - smooth continuous transform */}
                <motion.div
                    style={{ x }}
                    className="flex h-full items-center gap-4 md:gap-6 pl-4 md:pl-6 absolute top-0 left-0"
                >
                    {galleryImages.map((item, index) => (
                        <GalleryItem key={item.id} item={item} index={index} isMobile={isMobile} />
                    ))}
                </motion.div>

                {/* Progress bar */}
                <motion.div
                    className="absolute bottom-8 md:bottom-12 left-4 md:left-6 right-4 md:right-6 h-[2px] bg-white/10 rounded-full overflow-hidden"
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
    item: (typeof galleryImages)[0];
    index: number;
    isMobile: boolean;
}

function GalleryItem({ item, index, isMobile }: GalleryItemProps) {
    const [isActive, setIsActive] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, delay: index * 0.02 }}
            className="relative w-[280px] md:w-[400px] h-[60vh] md:h-[70vh] flex-shrink-0 rounded-xl md:rounded-2xl overflow-hidden group cursor-pointer"
            whileHover={{ scale: isMobile ? 1 : 0.98 }}
            onMouseEnter={() => setIsActive(true)}
            onMouseLeave={() => setIsActive(false)}
        >
            <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 280px, 400px"
            />

            {/* Gradient overlay */}
            <motion.div
                initial={{ opacity: 0.4 }}
                animate={{ opacity: isActive || isMobile ? 0.8 : 0.4 }}
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300"
            />

            {/* Content - always visible on mobile */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 p-4 md:p-6"
                initial={{ y: isMobile ? 0 : 20, opacity: isMobile ? 1 : 0 }}
                animate={{
                    y: isActive || isMobile ? 0 : 20,
                    opacity: isActive || isMobile ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
            >
                <span className="text-[10px] md:text-xs uppercase tracking-widest text-[var(--color-accent)] mb-1 block">
                    {item.category}
                </span>
                <h3 className="text-lg md:text-2xl font-bold">{item.title}</h3>
            </motion.div>
        </motion.div>
    );
}

export default HorizontalGallery;
