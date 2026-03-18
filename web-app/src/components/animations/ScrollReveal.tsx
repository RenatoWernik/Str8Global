'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface ScrollRevealProps {
    children: ReactNode;
    scrollContainerRef?: React.RefObject<HTMLElement | null>;
    enableBlur?: boolean;
    baseOpacity?: number;
    baseRotation?: number;
    blurStrength?: number;
    containerClassName?: string;
    textClassName?: string;
    rotationEnd?: string;
    delay?: number;
}

export function ScrollReveal({
    children,
    scrollContainerRef,
    enableBlur = false,
    baseOpacity = 0,
    baseRotation = 5,
    blurStrength = 10,
    containerClassName,
    textClassName,
    rotationEnd = 'top 80%', // Kept for backwards compatibility, not strictly used
    delay = 0,
}: ScrollRevealProps) {
    const prefersReducedMotion = useReducedMotion();

    if (prefersReducedMotion) {
        return (
            <div className={cn(containerClassName)}>
                <div className={cn(textClassName)}>{children}</div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ 
                opacity: baseOpacity, 
                y: 60, 
                rotateX: baseRotation, 
                filter: enableBlur ? `blur(${blurStrength}px)` : 'blur(0px)' 
            }}
            whileInView={{ 
                opacity: 1, 
                y: 0, 
                rotateX: 0, 
                filter: 'blur(0px)' 
            }}
            viewport={{ 
                once: true, 
                margin: "-10%",
                ...(scrollContainerRef ? { root: scrollContainerRef } : {})
            }}
            transition={{ 
                duration: 1.2, 
                delay: delay, 
                ease: [0.16, 1, 0.3, 1] 
            }}
            className={cn('will-change-transform', containerClassName)}
            style={{ perspective: '1000px' }}
        >
            <div className={cn(textClassName)} style={{ transformStyle: 'preserve-3d' }}>
                {children}
            </div>
        </motion.div>
    );
}

export default ScrollReveal;
