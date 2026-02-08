'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TextRevealProps {
    children: string;
    className?: string;
    delay?: number;
    once?: boolean;
}

export function TextReveal({ children, className, delay = 0, once = true }: TextRevealProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once, margin: '-100px' });

    const words = children.split(' ');

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: delay },
        }),
    };

    const child = {
        hidden: {
            opacity: 0,
            y: 50,
            rotateX: -90,
        },
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: {
                type: 'spring',
                damping: 12,
                stiffness: 100,
            },
        },
    };

    return (
        <motion.span
            ref={ref}
            className={cn('inline-flex flex-wrap', className)}
            variants={container}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            style={{ perspective: 500 }}
        >
            {words.map((word, index) => (
                <motion.span
                    key={index}
                    className="inline-block mr-[0.25em] overflow-hidden"
                    variants={child}
                >
                    {word}
                </motion.span>
            ))}
        </motion.span>
    );
}

export default TextReveal;
