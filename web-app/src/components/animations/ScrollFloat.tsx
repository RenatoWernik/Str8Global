'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface ScrollFloatProps {
    children: ReactNode;
    className?: string;
    offset?: number;
    direction?: 'up' | 'down';
}

export function ScrollFloat({
    children,
    className,
    offset = 50,
    direction = 'up',
}: ScrollFloatProps) {
    const yOffset = direction === 'up' ? offset : -offset;

    return (
        <motion.div
            className={cn('will-change-transform', className)}
            initial={{ y: yOffset, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{
                type: 'spring',
                stiffness: 50,
                damping: 20,
                duration: 0.8,
            }}
        >
            {children}
        </motion.div>
    );
}

export default ScrollFloat;
