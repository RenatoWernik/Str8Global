'use client';

import { useRef, ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
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
    rotationEnd = 'top 80%',
    delay = 0,
}: ScrollRevealProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = useReducedMotion();

    useGSAP(() => {
        if (prefersReducedMotion) return;

        const element = containerRef.current;
        if (!element) return;

        const ctx = gsap.context(() => {
            // Initial state
            gsap.set(element, {
                opacity: baseOpacity,
                y: 60,
                rotationX: baseRotation,
                filter: enableBlur ? `blur(${blurStrength}px)` : 'none',
            });

            // Create animation timeline
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: element,
                    scroller: scrollContainerRef?.current || undefined,
                    start: 'top 90%',
                    end: rotationEnd,
                    toggleActions: 'play none none none',
                },
            });

            tl.to(element, {
                opacity: 1,
                y: 0,
                rotationX: 0,
                filter: enableBlur ? 'blur(0px)' : 'none',
                duration: 1.2,
                delay: delay,
                ease: 'power3.out',
            });
        });

        return () => ctx.revert();
    }, [scrollContainerRef, enableBlur, baseOpacity, baseRotation, blurStrength, rotationEnd, delay, prefersReducedMotion]);

    if (prefersReducedMotion) {
        return (
            <div className={cn(containerClassName)}>
                <div className={cn(textClassName)}>{children}</div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className={cn('will-change-transform', containerClassName)}
            style={{ perspective: '1000px' }}
        >
            <div className={cn(textClassName)} style={{ transformStyle: 'preserve-3d' }}>
                {children}
            </div>
        </div>
    );
}

export default ScrollReveal;
