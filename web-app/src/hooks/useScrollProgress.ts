'use client';

import { useState, useEffect } from 'react';

interface ScrollProgress {
    progress: number; // 0 to 1
    scrollY: number;
    direction: 'up' | 'down' | null;
}

export function useScrollProgress(): ScrollProgress {
    const [scrollProgress, setScrollProgress] = useState<ScrollProgress>({
        progress: 0,
        scrollY: 0,
        direction: null,
    });

    useEffect(() => {
        let lastScrollY = 0;

        const handleScroll = () => {
            const scrollY = window.scrollY;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const progress = maxScroll > 0 ? scrollY / maxScroll : 0;
            const direction = scrollY > lastScrollY ? 'down' : scrollY < lastScrollY ? 'up' : null;

            lastScrollY = scrollY;

            setScrollProgress({
                progress: Math.min(1, Math.max(0, progress)),
                scrollY,
                direction,
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return scrollProgress;
}
