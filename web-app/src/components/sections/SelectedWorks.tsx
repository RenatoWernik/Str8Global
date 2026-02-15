'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { projects, siteCopy } from '@/data/mockData';
import Image from 'next/image';
import { Play } from 'lucide-react';

// Use first 4 projects from the list
const selectedWorksProjects = projects.slice(0, 4);

export function SelectedWorks() {
    return (
        <section className="relative bg-black">
            <div className="py-16 md:py-24 px-4 md:px-6">
                <motion.h2
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-3xl md:text-6xl font-bold text-center mb-4"
                >
                    {siteCopy.selectedWorks.title}
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="text-white/50 text-center text-base md:text-lg max-w-xl mx-auto"
                >
                    {siteCopy.selectedWorks.subtitle}
                </motion.p>
            </div>

            {selectedWorksProjects.map((project, index) => (
                <ProjectSlide key={project.id} project={project} index={index} />
            ))}
        </section>
    );
}

interface ProjectSlideProps {
    project: (typeof projects)[0];
    index: number;
}

function ProjectSlide({ project, index }: ProjectSlideProps) {
    const ref = useRef(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Toggle video play/pause on click
    const handleVideoToggle = () => {
        if (!videoRef.current) return;

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
    };

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });

    // Reduced parallax on mobile
    const yRange = isMobile ? [50, -50] : [100, -100];
    const y = useTransform(scrollYProgress, [0, 1], yRange);
    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.9, 1, 1, 0.9]);

    return (
        <motion.div
            ref={ref}
            style={{ opacity, scale }}
            className="relative h-[80vh] md:h-screen w-full flex items-center justify-center overflow-hidden"
        >
            {/* Background: Video or Image with Parallax */}
            <motion.div
                style={{ y }}
                className="absolute inset-0 z-0"
            >
                {/* Video background for projects with video */}
                {project.video && (
                    <video
                        ref={videoRef}
                        src={project.video}
                        preload="metadata"
                        muted
                        loop
                        playsInline
                        onLoadedData={() => setVideoLoaded(true)}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isPlaying && videoLoaded ? 'opacity-100' : 'opacity-0'}`}
                    />
                )}

                {/* Image fallback (shows until video loads, or always for non-video projects) */}
                <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className={`object-cover ${isPlaying && videoLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
                    sizes="100vw"
                    priority={index === 0}
                />
                <div className="absolute inset-0 bg-black/50" />
            </motion.div>

            {/* Video play/pause button */}
            {project.video && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleVideoToggle}
                    className="absolute top-4 md:top-8 left-4 md:left-8 z-20 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 md:px-4 md:py-2 flex items-center gap-2 cursor-pointer hover:bg-black/80 transition-colors"
                >
                    {isPlaying ? (
                        <>
                            <div className="w-3 h-3 md:w-4 md:h-4 flex items-center justify-center gap-0.5">
                                <div className="w-1 h-3 md:h-4 bg-white rounded-sm" />
                                <div className="w-1 h-3 md:h-4 bg-white rounded-sm" />
                            </div>
                            <span className="text-xs md:text-sm text-white">Pausar</span>
                        </>
                    ) : (
                        <>
                            <Play size={12} className="md:w-4 md:h-4 text-white fill-white" />
                            <span className="text-xs md:text-sm text-white">Vídeo</span>
                        </>
                    )}
                </motion.button>
            )}

            {/* Content */}
            <div className="relative z-10 text-center px-4 md:px-6 max-w-4xl mx-auto">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-xs md:text-sm uppercase tracking-[0.2em] md:tracking-[0.3em] text-[var(--color-accent)] mb-3 md:mb-4 block"
                >
                    {project.category}
                </motion.span>

                <motion.h3
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl md:text-7xl lg:text-8xl font-bold mb-4 md:mb-6"
                >
                    {project.title}
                </motion.h3>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="text-sm md:text-lg text-white/70 max-w-xl mx-auto mb-6 md:mb-8 line-clamp-3 md:line-clamp-none"
                >
                    {project.description}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center justify-center gap-4 md:gap-8 text-xs md:text-sm text-white/50"
                >
                    <span>Cliente: {project.client}</span>
                    <span>Ano: {project.year}</span>
                </motion.div>
            </div>
        </motion.div>
    );
}

export default SelectedWorks;
