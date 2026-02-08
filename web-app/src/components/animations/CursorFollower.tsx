'use client';

import { motion } from 'framer-motion';
import { useCursorPosition } from '@/hooks';
import { useReducedMotion } from '@/hooks';

export function CursorFollower() {
    const { x, y } = useCursorPosition();
    const prefersReducedMotion = useReducedMotion();

    if (prefersReducedMotion) return null;

    return (
        <>
            {/* Main cursor dot */}
            <motion.div
                className="fixed w-4 h-4 bg-[var(--color-accent)] rounded-full pointer-events-none z-[9999] mix-blend-difference"
                animate={{
                    x: x - 8,
                    y: y - 8,
                }}
                transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 28,
                    mass: 0.5,
                }}
            />
            {/* Outer ring */}
            <motion.div
                className="fixed w-10 h-10 border border-[var(--color-accent)] rounded-full pointer-events-none z-[9998] mix-blend-difference"
                animate={{
                    x: x - 20,
                    y: y - 20,
                }}
                transition={{
                    type: 'spring',
                    stiffness: 150,
                    damping: 15,
                    mass: 0.1,
                }}
            />
        </>
    );
}

export default CursorFollower;
