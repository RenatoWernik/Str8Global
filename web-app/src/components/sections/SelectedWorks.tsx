'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { selectedWorksProjectsData, siteCopy } from '@/data/mockData';
import { HighlightText } from '@/components/ui/HighlightText';
import Image from 'next/image';
import { Play } from 'lucide-react';

// Use first 5 projects from the list
const selectedWorksProjects = selectedWorksProjectsData.slice(0, 5);

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
                    <HighlightText text={siteCopy.selectedWorks.subtitle} />
                </motion.p>
            </div>

            {selectedWorksProjects.map((project, index) => (
                <ProjectSlide key={project.id} project={project} index={index} />
            ))}
        </section>
    );
}

interface ProjectSlideProps {
    project: (typeof selectedWorksProjectsData)[0];
    index: number;
}

function ProjectSlide({ project, index }: ProjectSlideProps) {
    const ref = useRef(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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
            {/* Background: Image with Parallax */}
            <motion.div
                style={{ y }}
                className="absolute inset-0 z-0"
            >
                {/* Image */}
                <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority={index === 0}
                    quality={100}
                />
            </motion.div>
        </motion.div>
    );
}

export default SelectedWorks;
