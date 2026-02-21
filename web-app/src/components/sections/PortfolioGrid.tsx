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

                    {/* Responsive Grid: 2 cols on mobile, 3 on desktop */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
                        {projects.map((project, index) => (
                            <GridItem
                                key={project.id}
                                project={project}
                                index={index}
                                onSelect={() => {
                                    if (project.video) {
                                        setSelectedProject(project);
                                    }
                                }}
                            />
                        ))}
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
                            className="relative w-full max-w-6xl aspect-video rounded-xl md:rounded-2xl overflow-hidden bg-black shadow-2xl"
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
    onSelect: () => void;
}

function GridItem({ project, index, onSelect }: GridItemProps) {
    const [isActive, setIsActive] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Detect touch device
    useEffect(() => {
        setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }, []);

    // Responsive aspect ratios and spans
    const getSizeClass = () => {
        switch (project.size) {
            case 'large': return 'md:col-span-2 md:row-span-2';
            case 'wide': return 'md:col-span-2';
            case 'tall': return 'md:row-span-2';
            default: return 'md:col-span-1';
        }
    };

    const getMobileAspect = () => {
        if (project.size === 'large' || project.size === 'wide') return 'aspect-video';
        if (project.size === 'tall') return 'aspect-[3/4]';
        return 'aspect-square';
    };

    const getDesktopAspect = () => {
        if (project.size === 'large') return 'aspect-square';
        if (project.size === 'wide') return 'aspect-[2/1]';
        if (project.size === 'tall') return 'aspect-[1/2]';

        // Default fallback pattern if no size specified
        if (index % 3 === 0) return 'md:aspect-[4/5]';
        if (index % 3 === 1) return 'md:aspect-square';
        return 'md:aspect-[5/4]';
    };

    // Click handler - open modal rather than inline play/pause
    const handleClick = () => {
        onSelect();
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
            className={`relative overflow-hidden rounded-lg md:rounded-xl cursor-pointer group ${getMobileAspect()} ${getDesktopAspect()} ${getSizeClass()}`}
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

