'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { projects, siteCopy, Project } from '@/data/mockData';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { Play, X } from 'lucide-react';

export function PortfolioGrid() {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (selectedProject) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [selectedProject]);

    return (
        <>
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

                    {/* Dynamic Asymmetric Bento Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 auto-rows-[250px] md:auto-rows-[300px]">
                        {projects.map((project, index) => {
                            // Determine dynamic span sizes based on position to create a bento box feel
                            const getSpanClass = () => {
                                // 1st item: large highlight
                                if (index === 0) return "md:col-span-8 md:row-span-2";
                                // 2nd item: tall side piece
                                if (index === 1) return "md:col-span-4 md:row-span-2";
                                // 3rd & 4th items: wide splits
                                if (index === 2 || index === 3) return "md:col-span-6 md:row-span-1";
                                // 5th item: full width banner
                                if (index === 4) return "md:col-span-12 md:row-span-2";
                                // Fallback
                                return "md:col-span-4 md:row-span-1";
                            };

                            return (
                                <GridItem
                                    key={project.id}
                                    project={project}
                                    index={index}
                                    className={getSpanClass()}
                                    onSelect={() => {
                                        if (project.video) {
                                            setSelectedProject(project);
                                        }
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Video Lightbox Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-8"
                        onClick={() => setSelectedProject(null)}
                    >
                        <button
                            onClick={() => setSelectedProject(null)}
                            className="absolute top-4 right-4 md:top-8 md:right-8 z-[110] p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ duration: 0.4, type: 'spring', damping: 25 }}
                            className="relative w-full max-w-6xl aspect-video rounded-xl md:rounded-2xl overflow-hidden bg-black shadow-[0_0_50px_rgba(255,16,240,0.15)] ring-1 ring-white/10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <video
                                src={selectedProject.video}
                                autoPlay
                                controls
                                className="w-full h-full object-contain"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

interface GridItemProps {
    project: Project;
    index: number;
    className: string;
    onSelect: () => void;
}

function GridItem({ project, index, className, onSelect }: GridItemProps) {
    const [isActive, setIsActive] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Detect touch device
    useEffect(() => {
        setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }, []);

    // Click handler - open modal rather than inline play/pause
    const handleClick = () => {
        onSelect();
    };

    const handleMouseEnter = () => {
        if (!isTouchDevice) {
            setIsActive(true);
            // Only auto-play preview on hover if not already playing
            if (videoRef.current && project.video && !isPlaying) {
                videoRef.current.play().catch(() => { }); // Catch play interruption promise rejection
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
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative overflow-hidden rounded-2xl cursor-pointer group bg-white/5 border border-white/10 hover:border-[var(--color-accent)]/50 transition-colors duration-500 ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
        >
            {/* Image */}
            <motion.div
                animate={{ scale: isActive ? 1.05 : 1 }}
                transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
                className="absolute inset-0"
            >
                <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index < 2}
                />
            </motion.div>

            {/* Video overlay (muted hover preview) */}
            {project.video && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isActive || isPlaying ? 1 : 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 z-10 bg-black"
                >
                    <video
                        ref={videoRef}
                        src={project.video}
                        preload="none"
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover opacity-90"
                    />
                </motion.div>
            )}

            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Play Button Indicator (Center) */}
            {project.video && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                        opacity: isActive ? 0 : 1,
                        scale: isActive ? 0.8 : 1
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
                >
                    <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                        <Play size={24} className="text-white fill-white ml-1" />
                    </div>
                </motion.div>
            )}

            {/* Content Container (Bottom Left) */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: isTouchDevice || isActive ? 0 : 10, opacity: isTouchDevice || isActive ? 1 : 0.8 }}
                transition={{ duration: 0.4 }}
                className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-40 pointer-events-none flex flex-col justify-end h-full"
            >
                {/* Year Badge */}
                <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 rounded-full bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/30 text-[var(--color-accent)] text-[10px] md:text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
                        {project.year}
                    </span>
                    <span className="text-xs text-white/60 tracking-wider">
                        {project.client}
                    </span>
                </div>

                <h3 className="text-2xl md:text-4xl font-bold mb-2 text-white drop-shadow-lg leading-tight group-hover:text-[var(--color-accent)] transition-colors duration-300">
                    {project.title}
                </h3>

                <p className="text-sm md:text-base text-white/80 line-clamp-2 md:line-clamp-3 max-w-2xl font-medium">
                    {project.description}
                </p>
            </motion.div>

            {/* Decorative Corner Framing (Top Right) */}
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                transition={{ duration: 0.4 }}
                className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-[var(--color-accent)] z-30 pointer-events-none"
            />
        </motion.div>
    );
}

export default PortfolioGrid;

