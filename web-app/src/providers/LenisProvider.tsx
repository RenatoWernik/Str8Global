'use client';

import { ReactLenis, useLenis } from '@studio-freight/react-lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ReactNode, useState, useEffect } from 'react';

interface LenisProviderProps {
  children: ReactNode;
}

/**
 * Syncs Lenis smooth scroll with GSAP ScrollTrigger.
 * CRITICAL: ScrollTrigger.update() must run on every Lenis frame
 * to prevent position desync after navigation (Pitfall 1).
 */
function LenisScrollSync({ children }: { children: ReactNode }) {
  useLenis(() => {
    // Sync ScrollTrigger on EVERY Lenis scroll frame
    ScrollTrigger.update();
  });

  useEffect(() => {
    // Force refresh after mount to fix positions after navigation
    const timeout = setTimeout(() => ScrollTrigger.refresh(), 100);
    return () => clearTimeout(timeout);
  }, []);

  return <>{children}</>;
}

export function LenisProvider({ children }: LenisProviderProps) {
  const [shouldUseLenis, setShouldUseLenis] = useState(false);

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 768px)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const checkConditions = () => {
      const isMobile = mobileQuery.matches;
      const prefersReducedMotion = motionQuery.matches;

      // Disable Lenis if mobile OR reduced motion
      setShouldUseLenis(!isMobile && !prefersReducedMotion);
    };

    checkConditions();

    const mobileHandler = () => checkConditions();
    const motionHandler = () => checkConditions();

    mobileQuery.addEventListener('change', mobileHandler);
    motionQuery.addEventListener('change', motionHandler);

    return () => {
      mobileQuery.removeEventListener('change', mobileHandler);
      motionQuery.removeEventListener('change', motionHandler);
    };
  }, []);

  if (!shouldUseLenis) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.12,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      }}
    >
      <LenisScrollSync>{children as any}</LenisScrollSync>
    </ReactLenis>
  );
}

export default LenisProvider;
