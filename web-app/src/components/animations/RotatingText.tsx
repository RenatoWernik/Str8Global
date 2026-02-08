'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RotatingTextProps {
    words: string[];
    className?: string;
    interval?: number;
}

export function RotatingText({ words, className, interval = 3000 }: RotatingTextProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % words.length);
        }, interval);

        return () => clearInterval(timer);
    }, [words.length, interval]);

    return (
        <span className={cn('inline-block relative', className)}>
            <AnimatePresence mode="wait">
                <motion.span
                    key={currentIndex}
                    initial={{ y: 40, opacity: 0, rotateX: -90 }}
                    animate={{ y: 0, opacity: 1, rotateX: 0 }}
                    exit={{ y: -40, opacity: 0, rotateX: 90 }}
                    transition={{
                        type: 'spring',
                        stiffness: 100,
                        damping: 15,
                    }}
                    className="inline-block text-[var(--color-accent)]"
                    style={{ perspective: 500 }}
                >
                    {words[currentIndex]}
                </motion.span>
            </AnimatePresence>
        </span>
    );
}

export default RotatingText;
