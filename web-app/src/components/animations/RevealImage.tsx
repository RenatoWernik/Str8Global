'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// Animation: GSAP (scroll-triggered clip-path reveal — see ANIMATION_LIBRARY_GUIDE.md)
// Why GSAP: Precise clip-path animation control with custom easing and delay support.
// Framer Motion's whileInView creates one IntersectionObserver per image (13 observers total),
// while this component accepts isInView from parent, reducing to 1 observer per section (VFX-06).

interface RevealImageProps {
  src: string;
  alt: string;
  className?: string;       // Applied to outer container div
  imageClassName?: string;  // Applied to Next.js Image
  aspectRatio?: string;     // Tailwind aspect class e.g. "aspect-[4/5]", default "aspect-video"
  isInView: boolean;        // Controlled by parent section (not self-observed)
  delay?: number;           // Stagger delay in seconds, default 0
  direction?: 'up' | 'down' | 'left' | 'right'; // Reveal direction, default 'up'
}

export function RevealImage({
  src,
  alt,
  className = '',
  imageClassName = '',
  aspectRatio = 'aspect-video',
  isInView,
  delay = 0,
  direction = 'up',
}: RevealImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Determine initial clip-path based on direction
    const initialClipPath: Record<typeof direction, string> = {
      up: 'inset(100% 0 0 0)',     // Hidden from bottom, reveals upward
      down: 'inset(0 0 100% 0)',   // Hidden from top, reveals downward
      left: 'inset(0 100% 0 0)',   // Hidden from right, reveals leftward
      right: 'inset(0 0 0 100%)',  // Hidden from left, reveals rightward
    };

    const fromClipPath = initialClipPath[direction];

    if (prefersReducedMotion) {
      // Accessibility: Show image immediately without animation when reduced motion preferred
      gsap.set(container, { clipPath: 'inset(0 0 0 0)' });
    } else if (isInView) {
      // Animate clip-path reveal when parent section enters viewport
      gsap.fromTo(
        container,
        { clipPath: fromClipPath },
        {
          clipPath: 'inset(0 0 0 0)',
          duration: 0.8,
          delay,
          ease: 'power3.inOut',
        }
      );
    }

    // Cleanup: Kill animations on unmount to prevent memory leaks
    return () => {
      gsap.killTweensOf(container);
    };
  }, [isInView, prefersReducedMotion, delay, direction]);

  return (
    <div
      ref={containerRef}
      className={`${aspectRatio} relative overflow-hidden ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-cover ${imageClassName}`}
        loading="eager"
      />
    </div>
  );
}
