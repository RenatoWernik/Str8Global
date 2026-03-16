'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RotatingTextProps {
    texts: string[];
    duration?: number;
    pauseDuration?: number;
    className?: string;
    initialDelay?: number;
}

export function RotatingText({
    texts,
    duration = 0.6,
    pauseDuration = 2500,
    className,
    initialDelay = 0,
}: RotatingTextProps) {
    const [index, setIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, initialDelay * 1000);

        return () => clearTimeout(timer);
    }, [initialDelay]);

    useEffect(() => {
        if (!isVisible) return;

        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % texts.length);
        }, pauseDuration + duration * 1000);

        return () => clearInterval(interval);
    }, [isVisible, pauseDuration, duration, texts.length]);

    return (
        <span className={cn('relative inline-flex flex-col h-[1.2em] overflow-hidden', className)}>
            <AnimatePresence mode="wait">
                {isVisible && (
                    <motion.span
                        key={index}
                        initial={{ y: '100%', opacity: 0 }}
                        animate={{ y: '0%', opacity: 1 }}
                        exit={{ y: '-100%', opacity: 0 }}
                        transition={{
                            duration: duration,
                            ease: [0.23, 1, 0.32, 1], // easeOutQuint
                        }}
                        className="inline-block whitespace-nowrap"
                    >
                        {texts[index]}
                    </motion.span>
                )}
            </AnimatePresence>
        </span>
    );
}

export default RotatingText;
