'use client';

import { useRef, useState, useEffect, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// Animation: GSAP ScrollTrigger (scroll-driven parallax — see ANIMATION_LIBRARY_GUIDE.md)
// Why GSAP: Smooth scrub-based parallax requires precise scroll position interpolation.
// Framer Motion's useScroll creates too many unnecessary re-renders for scrubbed parallax.
// ScrollTrigger's scrub: true provides optimal 60fps interpolation with zero render overhead.

gsap.registerPlugin(ScrollTrigger);

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;        // Container div classes
  imageClassName?: string;   // Next.js Image classes
  aspectRatio?: string;      // Tailwind aspect class, default "aspect-video"
  intensity?: number;        // Parallax intensity 0-15 (percentage), default 10
  children?: ReactNode;      // Overlay content (gradients, titles)
  layoutId?: string;         // Framer Motion layoutId for lightbox integration
  onClick?: () => void;      // Click handler for lightbox trigger
}

export function ParallaxImage({
  src,
  alt,
  className = '',
  imageClassName = '',
  aspectRatio = 'aspect-video',
  intensity = 10,
  children,
  layoutId,
  onClick,
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile with window.matchMedia and listen for changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    setIsMobile(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Clamp intensity to maximum 15%
  const clampedIntensity = Math.min(Math.max(intensity, 0), 15);

  // GSAP ScrollTrigger parallax (desktop + motion allowed only)
  useGSAP(
    () => {
      const imageWrapper = imageWrapperRef.current;
      const container = containerRef.current;

      // Exit early if mobile or reduced motion active (POLISH-04 compliance)
      if (isMobile || prefersReducedMotion || !imageWrapper || !container) {
        return;
      }

      // Create parallax animation with ScrollTrigger scrub
      gsap.fromTo(
        imageWrapper,
        { yPercent: -clampedIntensity },
        {
          yPercent: clampedIntensity,
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
          ease: 'none',
        }
      );
    },
    { scope: containerRef, dependencies: [isMobile, prefersReducedMotion, clampedIntensity] }
  );

  // Render wrapper with optional layoutId for lightbox integration
  const containerContent = (
    <div
      ref={containerRef}
      className={`${aspectRatio} relative overflow-hidden ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* Image wrapper with scale to accommodate parallax movement */}
      <div
        ref={imageWrapperRef}
        className="absolute inset-0 w-full h-full"
        style={{ scale: '1.15' }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className={`object-cover ${imageClassName}`}
          loading="eager"
        />
      </div>

      {/* Overlay content (gradients, titles, etc.) */}
      {children && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          {children}
        </div>
      )}
    </div>
  );

  // If layoutId provided, wrap in motion.div for lightbox transition
  if (layoutId) {
    return <motion.div layoutId={layoutId} className="w-full h-full block">{containerContent}</motion.div>;
  }

  return containerContent;
}
