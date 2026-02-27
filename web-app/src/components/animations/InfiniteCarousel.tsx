'use client';

import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode, useMemo, useRef } from 'react';

interface InfiniteCarouselProps {
    children: ReactNode[];
    className?: string;
    speed?: number;
    direction?: 'left' | 'right';
    pauseOnHover?: boolean;
}

export function InfiniteCarousel({
    children,
    className,
    speed = 30,
    direction = 'left',
    pauseOnHover = true,
}: InfiniteCarouselProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { margin: '100px', once: false });

    // Only duplicate 3x (minimum for seamless loop) and memoize
    const duplicatedChildren = useMemo(
        () => [...children, ...children, ...children],
        [children]
    );

    return (
        <div
            ref={containerRef}
            className={cn(
                'relative overflow-hidden',
                pauseOnHover && 'group',
                className
            )}
        >
            <motion.div
                className="flex gap-8 w-max will-change-transform"
                animate={isInView ? {
                    x: direction === 'left' ? ['0%', '-33.333%'] : ['-33.333%', '0%'],
                } : undefined}
                transition={{
                    x: {
                        repeat: Infinity,
                        repeatType: 'loop',
                        duration: speed,
                        ease: 'linear',
                    },
                }}
                style={{
                    animationPlayState: pauseOnHover ? undefined : 'running',
                }}
                whileHover={pauseOnHover ? { animationPlayState: 'paused' } : undefined}
            >
                {duplicatedChildren.map((child, index) => (
                    <div key={index} className="flex-shrink-0">
                        {child}
                    </div>
                ))}
            </motion.div>

            {/* Gradient masks */}
            <div className="absolute inset-y-0 left-0 w-12 md:w-24 bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
            <div className="absolute inset-y-0 right-0 w-12 md:w-24 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
        </div>
    );
}

export default InfiniteCarousel;

