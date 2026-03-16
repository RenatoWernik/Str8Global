'use client';

import { useRef, useState, useEffect, RefObject } from 'react';

interface UseSectionInViewOptions {
  threshold?: number;
  rootMargin?: string;
}

/**
 * Provides section-level viewport observation with a single IntersectionObserver.
 *
 * This hook reduces performance overhead by replacing individual per-image whileInView
 * patterns with one observer per section (VFX-06 compliance).
 *
 * Uses native IntersectionObserver (not Framer Motion) per TEXT-02 decision.
 * Triggers only once per section to minimize observer overhead.
 *
 * @param options.threshold - Percentage of section visible to trigger (default: 0.1)
 * @param options.rootMargin - Margin around viewport (default: '-5% 0px')
 * @returns Object with sectionRef to attach to section container and isInView boolean
 */
export function useSectionInView(
  options: UseSectionInViewOptions = {}
): {
  sectionRef: RefObject<HTMLElement | null>;
  isInView: boolean;
} {
  const { threshold = 0.1, rootMargin = '-5% 0px' } = options;
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        if (inView) {
          setIsInView(true);
          // triggerOnce: true — once section is revealed, disconnect observer
          observer.unobserve(element);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    // Cleanup: disconnect observer on unmount
    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  return { sectionRef, isInView };
}
