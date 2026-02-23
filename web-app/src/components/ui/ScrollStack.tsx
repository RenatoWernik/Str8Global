'use client';

import { useEffect, useRef, useCallback, ReactNode } from 'react';
import { useLenis } from '@studio-freight/react-lenis';
import './ScrollStack.css';

interface ScrollStackItemProps {
    children: ReactNode;
    itemClassName?: string;
}

export const ScrollStackItem = ({ children, itemClassName = '' }: ScrollStackItemProps) => (
    <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
);

interface ScrollStackProps {
    children: ReactNode;
    className?: string;
    itemDistance?: number;
    itemScale?: number;
    itemStackDistance?: number;
    stackPosition?: string;
    scaleEndPosition?: string;
    baseScale?: number;
    onStackComplete?: () => void;
}

/**
 * ScrollStack — scroll-driven card stacking effect.
 * Hooks into Lenis scroll callback for frame-perfect sync.
 * Does NOT create its own scroll listener or rAF loop.
 */
const ScrollStack = ({
    children,
    className = '',
    itemDistance = 60,
    itemScale = 0.03,
    itemStackDistance = 30,
    stackPosition = '20%',
    scaleEndPosition = '10%',
    baseScale = 0.88,
    onStackComplete
}: ScrollStackProps) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const stackCompletedRef = useRef(false);
    const cardsRef = useRef<HTMLElement[]>([]);
    const cardOffsetsRef = useRef<number[]>([]);
    const endOffsetRef = useRef(0);
    const mountedRef = useRef(false);
    const lastValuesRef = useRef<string[]>([]);

    const parsePercentage = useCallback((value: string | number, vh: number) => {
        if (typeof value === 'string' && value.includes('%')) {
            return (parseFloat(value) / 100) * vh;
        }
        return parseFloat(value as string);
    }, []);

    // Measure true layout offsets (with transforms stripped)
    const measureOffsets = useCallback(() => {
        const cards = cardsRef.current;
        if (!cards.length) return;

        // Strip transforms to get real layout positions
        const saved: string[] = [];
        cards.forEach((card, i) => {
            saved[i] = card.style.transform;
            card.style.transform = 'none';
        });

        // Force reflow, then read
        const scrollY = window.scrollY;
        cardOffsetsRef.current = cards.map(c => c.getBoundingClientRect().top + scrollY);

        const endEl = wrapperRef.current?.querySelector('.scroll-stack-end') as HTMLElement;
        endOffsetRef.current = endEl ? endEl.getBoundingClientRect().top + scrollY : 0;

        // Restore transforms
        cards.forEach((card, i) => {
            card.style.transform = saved[i] || '';
        });
    }, []);

    // Core transform update — called by Lenis on every frame
    const updateTransforms = useCallback((scrollY: number) => {
        const cards = cardsRef.current;
        const offsets = cardOffsetsRef.current;
        if (!cards.length || !offsets.length) return;

        const vh = window.innerHeight;
        const stackPosPx = parsePercentage(stackPosition, vh);
        const scaleEndPx = parsePercentage(scaleEndPosition, vh);
        const endTop = endOffsetRef.current;

        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            if (!card) continue;

            const cardTop = offsets[i];
            const triggerStart = cardTop - stackPosPx - itemStackDistance * i;
            const triggerEnd = cardTop - scaleEndPx;
            const pinEnd = endTop - vh * 0.5;

            // Scale: lerp from 1 → targetScale as scroll progresses
            let scaleProgress = 0;
            const range = triggerEnd - triggerStart;
            if (range > 0 && scrollY > triggerStart) {
                scaleProgress = Math.min(1, (scrollY - triggerStart) / range);
            }
            const targetScale = baseScale + i * itemScale;
            const scale = 1 - scaleProgress * (1 - targetScale);

            // Pin: stick card when scrolled past trigger, release at pinEnd
            let ty = 0;
            if (scrollY >= triggerStart && scrollY <= pinEnd) {
                ty = scrollY - cardTop + stackPosPx + itemStackDistance * i;
            } else if (scrollY > pinEnd) {
                ty = pinEnd - cardTop + stackPosPx + itemStackDistance * i;
            }

            // Write transform only if changed (compare string to avoid object alloc)
            const transformStr = `translate3d(0,${ty.toFixed(1)}px,0) scale(${scale.toFixed(4)})`;
            if (lastValuesRef.current[i] !== transformStr) {
                card.style.transform = transformStr;
                lastValuesRef.current[i] = transformStr;
            }

            // Stack complete callback (last card)
            if (i === cards.length - 1) {
                const isPinned = scrollY >= triggerStart && scrollY <= pinEnd;
                if (isPinned && !stackCompletedRef.current) {
                    stackCompletedRef.current = true;
                    onStackComplete?.();
                } else if (!isPinned && stackCompletedRef.current) {
                    stackCompletedRef.current = false;
                }
            }
        }
    }, [
        itemScale, itemStackDistance, stackPosition, scaleEndPosition,
        baseScale, onStackComplete, parsePercentage
    ]);

    // Hook into Lenis — fires every frame in sync with Lenis's rAF
    useLenis((lenis) => {
        if (mountedRef.current) {
            updateTransforms(lenis.scroll);
        }
    });

    useEffect(() => {
        const wrapper = wrapperRef.current;
        if (!wrapper) return;

        const cards = Array.from(wrapper.querySelectorAll('.scroll-stack-card')) as HTMLElement[];
        cardsRef.current = cards;
        lastValuesRef.current = new Array(cards.length).fill('');

        cards.forEach((card, i) => {
            if (i < cards.length - 1) {
                card.style.marginBottom = `${itemDistance}px`;
            }
            card.style.willChange = 'transform';
            card.style.transformOrigin = 'top center';
            card.style.backfaceVisibility = 'hidden';
        });

        // Measure after layout settles
        requestAnimationFrame(() => {
            measureOffsets();
            mountedRef.current = true;
            updateTransforms(window.scrollY);
        });

        // Re-measure on resize
        const onResize = () => {
            measureOffsets();
            updateTransforms(window.scrollY);
        };
        window.addEventListener('resize', onResize, { passive: true });

        return () => {
            window.removeEventListener('resize', onResize);
            mountedRef.current = false;
            stackCompletedRef.current = false;
            cardsRef.current = [];
            cardOffsetsRef.current = [];
            lastValuesRef.current = [];
        };
    }, [itemDistance, measureOffsets, updateTransforms]);

    return (
        <div className={`scroll-stack-wrapper ${className}`.trim()} ref={wrapperRef}>
            {children}
            <div className="scroll-stack-end" />
        </div>
    );
};

export default ScrollStack;
