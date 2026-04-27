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
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const pointerInteracting = useRef<number | null>(null);
    const pointerInteractionMovement = useRef(0);
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
            // Use canvas.width (pixel-buffer = clientWidth * dpr, set by phenomenon)
            // so the shader's resolution uniform `w` matches gl_FragCoord exactly.
            // Passing widthRef in CSS-px while gl_FragCoord runs in pixel-buffer
            // units mis-centers the sphere when dpr ≠ 1 (the off-center top-right
            // crop seen on mobile where dpr is 0.75).
            const c = canvasRef.current;
            if (c && c.width && c.height) {
                state.width = c.width;
                state.height = c.height;
            }
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
        const canvas = canvasRef.current;
        if (!canvas) return;

        let globe: ReturnType<typeof createGlobe> | null = null;
        let initialized = false;

        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const dpr = isMobile ? 0.75 : 1;
        const mobileOverrides = isMobile ? { mapSamples: 800, devicePixelRatio: 0.75 } : {};

        const init = (cssWidth: number) => {
            if (initialized) return;
            initialized = true;

            // Pass the dpr-multiplied buffer size as cobe's `width`/`height`.
            // phenomenon will set canvas.width = clientWidth * dpr, so seeding the
            // shader's resolution uniform with the same value guarantees a centered
            // sphere from the very first frame (no upper-right crop on mobile).
            const bufferSize = Math.round(cssWidth * dpr);

            globe = createGlobe(canvas, {
                ...config,
                ...mobileOverrides,
                width: bufferSize,
                height: bufferSize,
                onRender,
            });
            globeRef.current = globe;

            requestAnimationFrame(() => {
                if (canvas) canvas.style.opacity = "1";
            });
        };

        // ResizeObserver defers cobe init until the canvas has a measurable
        // non-zero width. This eliminates the layout-race that previously made
        // offsetWidth read 0 on fast mobile loads (which then fell back to 600
        // and produced the off-center / cropped globe).
        const ro = new ResizeObserver(() => {
            const w = canvas.clientWidth;
            if (w > 0) init(w);
        });
        ro.observe(canvas);

        return () => {
            ro.disconnect();
            globe?.destroy();
            globeRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
