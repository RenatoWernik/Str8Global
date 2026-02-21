'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TypewriterTextProps {
    words: string[];
    className?: string;
    typingSpeed?: number;
    deletingSpeed?: number;
    pauseDuration?: number;
}

export function TypewriterText({
    words,
    className,
    typingSpeed = 120,
    deletingSpeed = 60,
    pauseDuration = 2000
}: TypewriterTextProps) {
    const [text, setText] = useState('');
    const [wordIndex, setWordIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentWord = words[wordIndex];

        let timeout: NodeJS.Timeout;

        if (isDeleting) {
            timeout = setTimeout(() => {
                setText(currentWord.substring(0, text.length - 1));
                if (text.length === 0) {
                    setIsDeleting(false);
                    setWordIndex((prev) => (prev + 1) % words.length);
                }
            }, deletingSpeed);
        } else {
            timeout = setTimeout(() => {
                setText(currentWord.substring(0, text.length + 1));
                if (text.length === currentWord.length) {
                    timeout = setTimeout(() => setIsDeleting(true), pauseDuration);
                }
            }, typingSpeed);
        }

        return () => clearTimeout(timeout);
    }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseDuration]);

    return (
        <span className={cn('inline-block relative', className)}>
            {text}
            <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                className="inline-block w-[3px] md:w-[5px] h-[0.9em] bg-[var(--color-accent)] align-middle ml-1 md:ml-2 -mt-1 md:-mt-2"
            />
        </span>
    );
}

export default TypewriterText;
