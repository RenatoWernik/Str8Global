'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { projects, siteCopy, Project } from '@/data/mockData';
import { HighlightText } from '@/components/ui/HighlightText';
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
                        <HighlightText text={siteCopy.portfolio.title} />
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-white/70 text-center text-base md:text-lg max-w-xl mx-auto mb-10 md:mb-16"
                    >
                        {siteCopy.portfolio.subtitle}
                    </motion.p>

                    {/* Dynamic Asymmetric Bento Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 auto-rows-[280px] md:auto-rows-[300px]">
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
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 p-4 md:p-8"
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
    const videoRef = useRef<HTMLVideoElement>(null);
    const hoverTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    const handleMouseEnter = () => {
        setIsActive(true);
        // Debounced video play to avoid rapid start/stop
        if (videoRef.current && project.video) {
            hoverTimerRef.current = setTimeout(() => {
                videoRef.current?.play().catch(() => { });
            }, 150);
        }
    };

    const handleMouseLeave = () => {
        setIsActive(false);
        clearTimeout(hoverTimerRef.current);
        if (videoRef.current && project.video) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
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
            onClick={onSelect}
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
                    animate={{ opacity: isActive ? 1 : 0 }}
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

            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

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
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-black/60 border border-white/20 flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                        <Play size={22} className="text-white fill-white ml-1" />
                    </div>
                </motion.div>
            )}

            {/* Client name only — clean and minimal */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6 z-40 pointer-events-none">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white drop-shadow-lg leading-tight group-hover:text-[var(--color-accent)] transition-colors duration-300">
                    {project.client}
                </h3>
            </div>
        </motion.div>
    );
}

export default PortfolioGrid;

