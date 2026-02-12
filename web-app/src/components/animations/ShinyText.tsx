'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface ShinyTextProps {
    children: ReactNode;
    className?: string;
    shimmerColor?: string;
    shimmerWidth?: number;
    duration?: number;
}

export function ShinyText({
    children,
    className,
    shimmerColor = '#FF10F0',
    shimmerWidth = 200,
    duration = 2,
}: ShinyTextProps) {
    const prefersReducedMotion = useReducedMotion();

    if (prefersReducedMotion) {
        return <span className={cn(className)}>{children}</span>;
    }

    return (
        <span
            className={cn(
                'relative inline-block bg-clip-text text-transparent',
                className
            )}
            style={{
                backgroundImage: `linear-gradient(
                    90deg,
                    #FFFFFF 0%,
                    #FFFFFF 40%,
                    ${shimmerColor} 50%,
                    #FFFFFF 60%,
                    #FFFFFF 100%
                )`,
                backgroundSize: `${shimmerWidth}% 100%`,
                animation: `shimmer ${duration}s infinite linear`,
            }}
        >
            <style jsx>{`
                @keyframes shimmer {
                    0% {
                        background-position: -${shimmerWidth}% 0;
                    }
                    100% {
                        background-position: ${shimmerWidth}% 0;
                    }
                }
            `}</style>
            {children}
        </span>
    );
}

export default ShinyText;
