'use client';

// Animation: Framer Motion (useSpring magnetic cursor — see ANIMATION_LIBRARY_GUIDE.md)

import { ReactNode, useRef, useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface MagneticCursorProps {
  children: ReactNode;
  className?: string;
  strength?: number;        // Pull strength 0-1, default 0.3
  threshold?: number;       // Activation distance in px, default 100 (not used if mouse is over element)
  as?: React.ElementType;   // Wrapper element type, default 'div'
}

export function MagneticCursor({
  children,
  className = '',
  strength = 0.3,
  threshold = 100,
  as = 'div',
}: MagneticCursorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  // Spring configuration for smooth physics-based motion
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const springX = useSpring(0, springConfig);
  const springY = useSpring(0, springConfig);

  // Detect mobile on client side
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 767px)').matches);
    };

    checkMobile();

    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const handleChange = () => checkMobile();

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Disable on mobile or when reduced motion is preferred (POLISH-04)
  if (isMobile || prefersReducedMotion) {
    return <>{children}</>;
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate offset from element center and apply strength
    const deltaX = (event.clientX - centerX) * strength;
    const deltaY = (event.clientY - centerY) * strength;

    springX.set(deltaX);
    springY.set(deltaY);
  };

  const handleMouseLeave = () => {
    // Reset to original position when mouse leaves
    springX.set(0);
    springY.set(0);
  };

  const MotionComponent = motion[as as keyof typeof motion] as typeof motion.div;

  return (
    <MotionComponent
      ref={ref}
      className={className}
      style={{
        x: springX,
        y: springY,
        display: 'inline-block',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </MotionComponent>
  );
}
