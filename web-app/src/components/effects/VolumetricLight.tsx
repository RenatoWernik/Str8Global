'use client';

import { useRef, useEffect } from 'react';

interface VolumetricLightProps {
    className?: string;
}

export default function VolumetricLight({ className = '' }: VolumetricLightProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0.5, y: 0.3 });
    const targetMouseRef = useRef({ x: 0.5, y: 0.3 });
    const timeRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        // Subtle mouse influence
        const handleMouseMove = (e: MouseEvent) => {
            targetMouseRef.current.x = e.clientX / window.innerWidth;
            targetMouseRef.current.y = e.clientY / window.innerHeight;
        };
        window.addEventListener('mousemove', handleMouseMove);

        let animationId: number;

        const render = () => {
            animationId = requestAnimationFrame(render);
            timeRef.current += 0.016;

            // Very slow, smooth mouse interpolation
            mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.008;
            mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.008;

            const { width, height } = canvas;
            ctx.clearRect(0, 0, width, height);

            // Light source position - subtle mouse influence
            const lightX = width * (0.5 + (mouseRef.current.x - 0.5) * 0.15);
            const lightY = -height * 0.1 + (mouseRef.current.y - 0.5) * height * 0.1;

            // Subtle breathing animation
            const breathe = 1 + Math.sin(timeRef.current * 0.1) * 0.03;

            // Create multiple gradient layers for volumetric effect

            // Layer 1: Main spotlight cone
            const coneGradient = ctx.createRadialGradient(
                lightX, lightY, 0,
                lightX, height * 0.5, height * 1.2 * breathe
            );
            coneGradient.addColorStop(0, 'rgba(255, 16, 240, 0.25)');
            coneGradient.addColorStop(0.2, 'rgba(255, 16, 240, 0.12)');
            coneGradient.addColorStop(0.5, 'rgba(255, 16, 240, 0.04)');
            coneGradient.addColorStop(1, 'rgba(255, 16, 240, 0)');

            // Draw cone shape
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(lightX, lightY);
            ctx.lineTo(lightX - width * 0.5, height * 1.2);
            ctx.lineTo(lightX + width * 0.5, height * 1.2);
            ctx.closePath();
            ctx.fillStyle = coneGradient;
            ctx.fill();
            ctx.restore();

            // Layer 2: Soft bloom at source
            const bloomGradient = ctx.createRadialGradient(
                lightX, lightY + height * 0.15, 0,
                lightX, lightY + height * 0.15, height * 0.4
            );
            bloomGradient.addColorStop(0, 'rgba(255, 200, 240, 0.15)');
            bloomGradient.addColorStop(0.3, 'rgba(255, 16, 240, 0.08)');
            bloomGradient.addColorStop(1, 'rgba(255, 16, 240, 0)');

            ctx.fillStyle = bloomGradient;
            ctx.fillRect(0, 0, width, height);

            // Layer 3: Atmospheric haze (subtle noise-like effect)
            const hazeOffset = timeRef.current * 0.02;
            for (let i = 0; i < 3; i++) {
                const hazeX = lightX + Math.sin(hazeOffset + i * 2) * width * 0.1;
                const hazeY = height * (0.3 + i * 0.15) + Math.cos(hazeOffset + i * 1.5) * 30;
                const hazeSize = height * (0.3 + i * 0.1);

                const hazeGradient = ctx.createRadialGradient(
                    hazeX, hazeY, 0,
                    hazeX, hazeY, hazeSize
                );
                hazeGradient.addColorStop(0, `rgba(255, 16, 240, ${0.02 - i * 0.005})`);
                hazeGradient.addColorStop(1, 'rgba(255, 16, 240, 0)');

                ctx.fillStyle = hazeGradient;
                ctx.fillRect(0, 0, width, height);
            }

            // Layer 4: Edge vignette to keep corners dark
            const vignetteGradient = ctx.createRadialGradient(
                width * 0.5, height * 0.5, height * 0.2,
                width * 0.5, height * 0.5, height * 0.9
            );
            vignetteGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
            vignetteGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
            vignetteGradient.addColorStop(1, 'rgba(0, 0, 0, 0.4)');

            ctx.fillStyle = vignetteGradient;
            ctx.fillRect(0, 0, width, height);
        };

        animationId = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className={`absolute inset-0 ${className}`}
            style={{ pointerEvents: 'none' }}
        />
    );
}
