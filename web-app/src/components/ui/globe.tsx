"use client";

import createGlobe from "cobe";
import { useCallback, useEffect, useRef } from "react";
import { useSpring } from "react-spring";

import { cn } from "@/lib/utils";

const GLOBE_CONFIG: any = {
    width: 800,
    height: 800,
    onRender: () => { },
    devicePixelRatio: 1,
    phi: 0,
    theta: 0.3,
    dark: 0,
    diffuse: 0,
    mapSamples: 2000,
    mapBrightness: 12,
    baseColor: [0.05, 0.15, 0.6],
    markerColor: [1, 16 / 255, 240 / 255],
    glowColor: [1, 16 / 255, 240 / 255],
    markers: [
        { location: [14.5995, 120.9842], size: 0.03 },
        { location: [19.076, 72.8777], size: 0.1 },
        { location: [23.8103, 90.4125], size: 0.05 },
        { location: [30.0444, 31.2357], size: 0.07 },
        { location: [39.9042, 116.4074], size: 0.08 },
        { location: [-23.5505, -46.6333], size: 0.1 },
        { location: [19.4326, -99.1332], size: 0.1 },
        { location: [40.7128, -74.006], size: 0.1 },
        { location: [34.6937, 135.5022], size: 0.05 },
        { location: [41.0082, 28.9784], size: 0.06 },
    ],
};

export function Globe({
    className,
    config = GLOBE_CONFIG,
}: {
    className?: string;
    config?: any;
}) {
    const phiRef = useRef(0);
    const widthRef = useRef(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const pointerInteracting = useRef<number | null>(null);
    const pointerInteractionMovement = useRef(0);
    const resizeTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
    const isVisibleRef = useRef(true);
    const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null);

    const [{ r }, api] = useSpring(() => ({
        r: 0,
        config: {
            mass: 1,
            tension: 280,
            friction: 40,
            precision: 0.001,
        },
    }));

    const updatePointerInteraction = (value: number | null) => {
        pointerInteracting.current = value;
        if (canvasRef.current) {
            canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab";
        }
    };

    const updateMovement = (clientX: number) => {
        if (pointerInteracting.current !== null) {
            const delta = clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta;
            api.start({ r: delta / 200 });
        }
    };

    const onRender = useCallback(
        (state: any) => {
            // Pause render loop when globe is off-screen
            if (!isVisibleRef.current) return;

            if (pointerInteracting.current === null) {
                phiRef.current += 0.005;
            }
            state.phi = phiRef.current + r.get();
            state.width = widthRef.current;
            state.height = widthRef.current;
        },
        [r],
    );

    // Intersection Observer: pause globe when scrolled out of view
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisibleRef.current = entry.isIntersecting;
            },
            { threshold: 0 }
        );

        observer.observe(container);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        // Debounced resize handler
        const onResize = () => {
            clearTimeout(resizeTimerRef.current);
            resizeTimerRef.current = setTimeout(() => {
                if (canvasRef.current) {
                    widthRef.current = canvasRef.current.offsetWidth;
                }
            }, 150);
        };

        window.addEventListener("resize", onResize, { passive: true });

        if (canvasRef.current) {
            widthRef.current = canvasRef.current.offsetWidth;
        }
        const initWidth = widthRef.current || 600;

        // Reduce quality on mobile for better performance
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const mobileOverrides = isMobile ? { mapSamples: 800, devicePixelRatio: 0.75 } : {};

        const globe = createGlobe(canvasRef.current!, {
            ...config,
            ...mobileOverrides,
            width: initWidth,
            height: initWidth,
            onRender,
        });
        globeRef.current = globe;

        setTimeout(() => {
            if (canvasRef.current) canvasRef.current.style.opacity = "1";
        });

        return () => {
            globe.destroy();
            globeRef.current = null;
            window.removeEventListener("resize", onResize);
            clearTimeout(resizeTimerRef.current);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className={cn(
                "absolute inset-0 mx-auto aspect-[1/1] w-full max-w-full",
                className,
            )}
        >
            <canvas
                className={cn(
                    "h-full w-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]",
                )}
                ref={canvasRef}
                onPointerDown={(e) =>
                    updatePointerInteraction(
                        e.clientX - pointerInteractionMovement.current,
                    )
                }
                onPointerUp={() => updatePointerInteraction(null)}
                onPointerOut={() => updatePointerInteraction(null)}
                onPointerLeave={() => updatePointerInteraction(null)}
                onPointerCancel={() => updatePointerInteraction(null)}
                onMouseMove={(e) => {
                    if (pointerInteracting.current !== null) {
                        updateMovement(e.clientX);
                    }
                }}
                onTouchMove={(e) => {
                    if (e.touches[0] && pointerInteracting.current !== null) {
                        updateMovement(e.touches[0].clientX);
                    }
                }}
            />
        </div>
    );
}
