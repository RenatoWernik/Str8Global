'use client';

import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface TypewriterTextProps {
    words: string[];
    className?: string;
    typingSpeed?: number;
    deletingSpeed?: number;
    pauseDuration?: number;
    initialDelay?: number;
}

export function TypewriterText({
    words,
    className,
    typingSpeed = 120,
    deletingSpeed = 60,
    pauseDuration = 2000,
    initialDelay = 0,
}: TypewriterTextProps) {
    const [display, setDisplay] = useState('');
    const [cursorVisible, setCursorVisible] = useState(false);

    const stateRef = useRef({
        wordIndex: 0,
        charIndex: 0,
        isDeleting: false,
        started: false,
    });
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const clear = () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        };

        const tick = () => {
            const s = stateRef.current;
            const word = words[s.wordIndex];

            if (s.isDeleting) {
                s.charIndex--;
                setDisplay(word.substring(0, s.charIndex));

                if (s.charIndex === 0) {
                    s.isDeleting = false;
                    s.wordIndex = (s.wordIndex + 1) % words.length;
                    timerRef.current = setTimeout(tick, typingSpeed);
                } else {
                    timerRef.current = setTimeout(tick, deletingSpeed);
                }
            } else {
                s.charIndex++;
                setDisplay(word.substring(0, s.charIndex));

                if (s.charIndex === word.length) {
                    timerRef.current = setTimeout(() => {
                        s.isDeleting = true;
                        tick();
                    }, pauseDuration);
                } else {
                    timerRef.current = setTimeout(tick, typingSpeed);
                }
            }
        };

        timerRef.current = setTimeout(() => {
            stateRef.current.started = true;
            setCursorVisible(true);
            tick();
        }, initialDelay);

        return clear;
    }, [words, typingSpeed, deletingSpeed, pauseDuration, initialDelay]);

    // Cursor blink
    useEffect(() => {
        const interval = setInterval(() => {
            setCursorVisible(v => !v);
        }, 530);
        return () => clearInterval(interval);
    }, []);

    return (
        <span className={cn('inline-block relative', className)}>
            {display}
            <span
                className="inline-block w-[3px] md:w-[5px] h-[0.9em] bg-[var(--color-accent)] align-middle ml-1 md:ml-2 -mt-1 md:-mt-2 transition-opacity duration-100"
                style={{ opacity: cursorVisible && stateRef.current.started ? 1 : 0 }}
            />
        </span>
    );
}

export default TypewriterText;
