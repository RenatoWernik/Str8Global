'use client';

import { motion } from 'framer-motion';
import { projects, siteCopy } from '@/data/mockData';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { Play } from 'lucide-react';

export function PortfolioGrid() {
    return (
        <section className="relative bg-black py-16 md:py-24 px-4 md:px-6">
            <div className="max-w-7xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-3xl md:text-6xl font-bold text-center mb-4"
                >
                    {siteCopy.portfolio.title}
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="text-white/50 text-center text-base md:text-lg max-w-xl mx-auto mb-10 md:mb-16"
                >
                    {siteCopy.portfolio.subtitle}
                </motion.p>

                {/* Responsive Grid: 2 cols on mobile, 3 on desktop */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
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
    const [isActive, setIsActive] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Detect touch device
    useEffect(() => {
        setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }, []);

    // Responsive aspect ratios: simpler on mobile
    const getMobileAspect = () => index % 2 === 0 ? 'aspect-[3/4]' : 'aspect-square';
    const getDesktopAspect = () => {
        if (index % 3 === 0) return 'md:aspect-[4/5]';
        if (index % 3 === 1) return 'md:aspect-square';
        return 'md:aspect-[5/4]';
    };

    // Click handler - toggle video play/pause
    const handleClick = () => {
        setIsActive(!isActive);

        if (project.video && videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
            } else {
                videoRef.current.play().then(() => {
                    setIsPlaying(true);
                }).catch((err) => {
                    console.log('Video play failed:', err);
                });
            }
        }
    };

    const handleMouseEnter = () => {
        if (!isTouchDevice) {
            setIsActive(true);
            // Only auto-play preview on hover if not already playing
            if (videoRef.current && project.video && !isPlaying) {
                videoRef.current.play();
            }
        }
    };

    const handleMouseLeave = () => {
        if (!isTouchDevice) {
            setIsActive(false);
            // Only stop if playing via hover preview (not clicked to play)
            if (videoRef.current && project.video && !isPlaying) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
            }
        }
    };


    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: index * 0.05 }}
            className={`relative overflow-hidden rounded-lg md:rounded-xl cursor-pointer group ${getMobileAspect()} ${getDesktopAspect()}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
        >
            {/* Image */}
            <motion.div
                animate={{ scale: isActive ? 1.1 : 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="absolute inset-0"
            >
                <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                    priority={index < 4}
                />
            </motion.div>

            {/* Video overlay */}
            {project.video && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isActive || isPlaying ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 z-10"
                >
                    <video
                        ref={videoRef}
                        src={project.video}
                        preload="metadata"
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                    />
                </motion.div>
            )}

            {/* Video indicator badge */}
            {project.video && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                        opacity: isActive ? 0 : 1,
                        scale: isActive ? 0.8 : 1
                    }}
                    className="absolute top-2 md:top-4 left-2 md:left-4 z-20 bg-black/60 backdrop-blur-sm rounded-full p-1.5 md:p-2"
                >
                    <Play size={12} className="md:w-4 md:h-4 text-white fill-white" />
                </motion.div>
            )}

            {/* Overlay - always visible on mobile, hover on desktop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isTouchDevice || isActive ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-3 md:p-6 z-20"
            >
                <span className="text-[10px] md:text-xs uppercase tracking-widest text-[var(--color-accent)] mb-1 md:mb-2">
                    {project.category}
                </span>
                <h3 className="text-sm md:text-2xl font-bold mb-0.5 md:mb-2 line-clamp-1">{project.title}</h3>
                <p className="text-xs md:text-sm text-white/70 line-clamp-2 hidden md:block">{project.description}</p>
            </motion.div>

            {/* Corner accent on hover */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: isActive ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute top-2 md:top-4 right-2 md:right-4 w-4 md:w-8 h-4 md:h-8 border-t-2 border-r-2 border-[var(--color-accent)] z-30"
            />
        </motion.div>
    );
}

export default PortfolioGrid;

