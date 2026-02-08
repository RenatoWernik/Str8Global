'use client';

import { useState, useEffect, RefObject } from 'react';

interface UseInViewOptions {
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
}

export function useInView(
    ref: RefObject<Element | null>,
    options: UseInViewOptions = {}
): boolean {
    const { threshold = 0, rootMargin = '0px', triggerOnce = false } = options;
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                const inView = entry.isIntersecting;
                setIsInView(inView);

                if (inView && triggerOnce) {
                    observer.unobserve(element);
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [ref, threshold, rootMargin, triggerOnce]);

    return isInView;
}
