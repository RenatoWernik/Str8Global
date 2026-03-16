'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// Animation: Framer Motion (layoutId transition + AnimatePresence — see ANIMATION_LIBRARY_GUIDE.md)
// Why Framer Motion: layoutId creates seamless shared-element transitions between states.
// GSAP cannot automatically morph elements between DOM positions like Framer's layoutId.
// AnimatePresence handles enter/exit orchestration with proper cleanup on unmount.

interface ImageLightboxProps {
  src: string;
  alt: string;
  layoutId: string;           // Must match the triggering element's layoutId
  isOpen: boolean;
  onClose: () => void;
}

export function ImageLightbox({
  src,
  alt,
  layoutId,
  isOpen,
  onClose,
}: ImageLightboxProps) {
  const prefersReducedMotion = useReducedMotion();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Auto-focus close button for accessibility
      closeButtonRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle Escape key to close lightbox
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Transition duration: 0 if reduced motion, 0.4s otherwise
  const transitionDuration = prefersReducedMotion ? 0 : 0.4;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: transitionDuration }}
          onClick={onClose}
        >
          {/* Close button - absolute positioned */}
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close lightbox"
            className="absolute top-4 right-4 z-10 p-2 text-white hover:text-white/70 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
          >
            <X size={32} strokeWidth={2} />
          </button>

          {/* Image container with layoutId for morph transition */}
          <motion.div
            layoutId={layoutId}
            className="relative w-full h-full max-w-7xl max-h-[90vh] mx-auto px-4"
            onClick={(e) => e.stopPropagation()}
            transition={{
              layout: {
                duration: transitionDuration,
                ease: [0.25, 0.1, 0.25, 1],
              },
            }}
          >
            <div className="relative w-full h-full">
              <Image
                src={src}
                alt={alt}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1400px"
                priority
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
