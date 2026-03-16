'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useInView } from '@/hooks/useInView';

// Animation: GSAP (scroll-triggered character reveal — see ANIMATION_LIBRARY_GUIDE.md)
// Why GSAP: Character-level stagger animation with precise timing control
// for scroll-driven text reveals. Framer Motion doesn't support character
// splitting or fine-grained stagger control without additional libraries.

interface CharRevealProps {
  text: string;
  tag?: 'h2' | 'h3' | 'span';
  className?: string;
  staggerDelay?: number;
  duration?: number;
}

export function CharReveal({
  text,
  tag = 'h2',
  className = '',
  staggerDelay = 0.03,
  duration = 0.6,
}: CharRevealProps) {
  const containerRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isInView = useInView(containerRef, { triggerOnce: true });

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    let cleanup: (() => void) | undefined;

    // Dynamically import Splitting.js to avoid SSR issues
    // Splitting.js manipulates the DOM directly and must run client-side only
    (async () => {
      try {
        const Splitting = (await import('splitting')).default;
        await import('splitting/dist/splitting-cells.css');

        // Split text into individual character spans
        const results = Splitting({
          target: element,
          by: 'chars',
        });

        if (!results || results.length === 0) return;

        const chars = element.querySelectorAll('.char');

        if (prefersReducedMotion) {
          // TEXT-04 requirement: No animation for reduced motion preference
          // Show all characters immediately for accessibility compliance
          gsap.set(chars, { opacity: 1, y: 0 });
        } else if (isInView) {
          // Animate characters with stagger when scrolled into view
          gsap.fromTo(
            chars,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration,
              stagger: staggerDelay,
              ease: 'power3.out',
            }
          );
        }

        cleanup = () => {
          // Kill all GSAP animations on this element to prevent memory leaks
          gsap.killTweensOf(chars);
        };
      } catch (error) {
        console.error('Failed to initialize Splitting.js:', error);
      }
    })();

    return () => {
      cleanup?.();
    };
  }, [isInView, prefersReducedMotion, staggerDelay, duration]);

  const Tag = tag;

  return (
    <Tag ref={containerRef as any} className={className}>
      {text}
    </Tag>
  );
}
