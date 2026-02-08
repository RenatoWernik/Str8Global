'use client';

import { useState, useEffect } from 'react';

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const breakpoints: Record<Breakpoint, string> = {
    sm: '(min-width: 640px)',
    md: '(min-width: 768px)',
    lg: '(min-width: 1024px)',
    xl: '(min-width: 1280px)',
    '2xl': '(min-width: 1536px)',
};

export function useMediaQuery(query: Breakpoint | string): boolean {
    const mediaQuery = breakpoints[query as Breakpoint] || query;
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(mediaQuery);
        setMatches(media.matches);

        const handleChange = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };

        media.addEventListener('change', handleChange);
        return () => media.removeEventListener('change', handleChange);
    }, [mediaQuery]);

    return matches;
}
