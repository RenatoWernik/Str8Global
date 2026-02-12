'use client';

import { useMemo } from 'react';

interface AuroraBackgroundProps {
    className?: string;
    color1?: string;      // default: "#FF10F0" (magenta)
    color2?: string;      // default: "#8B00FF" (roxo)
    color3?: string;      // default: "#00FFFF" (ciano)
    intensity?: number;   // default: 0.3
    speed?: number;       // default: 1
}

const AuroraBackground = ({
    className = '',
    color1 = '#FF10F0',
    color2 = '#8B00FF',
    color3 = '#00FFFF',
    intensity = 0.3,
    speed = 1
}: AuroraBackgroundProps) => {
    const animationDuration = useMemo(() => `${15 / speed}s`, [speed]);
    
    const gradientStyle = useMemo(() => ({
        '--aurora-color-1': color1,
        '--aurora-color-2': color2,
        '--aurora-color-3': color3,
        '--aurora-intensity': intensity,
        '--aurora-duration': animationDuration,
    } as React.CSSProperties), [color1, color2, color3, intensity, animationDuration]);

    return (
        <div 
            className={`aurora-background ${className}`}
            style={gradientStyle}
        >
            <div className="aurora-blob aurora-blob-1" />
            <div className="aurora-blob aurora-blob-2" />
            <div className="aurora-blob aurora-blob-3" />
            <div className="aurora-overlay" />
            
            <style jsx>{`
                .aurora-background {
                    position: absolute;
                    inset: 0;
                    overflow: hidden;
                    background: #000000;
                    z-index: 0;
                }
                
                .aurora-blob {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(80px);
                    opacity: var(--aurora-intensity);
                    animation: aurora-move var(--aurora-duration) ease-in-out infinite;
                    will-change: transform;
                }
                
                .aurora-blob-1 {
                    width: 60%;
                    height: 60%;
                    background: var(--aurora-color-1);
                    top: -20%;
                    left: -10%;
                    animation-delay: 0s;
                }
                
                .aurora-blob-2 {
                    width: 70%;
                    height: 70%;
                    background: var(--aurora-color-2);
                    top: 20%;
                    right: -20%;
                    animation-delay: -5s;
                }
                
                .aurora-blob-3 {
                    width: 50%;
                    height: 50%;
                    background: var(--aurora-color-3);
                    bottom: -10%;
                    left: 30%;
                    animation-delay: -10s;
                }
                
                .aurora-overlay {
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%);
                    pointer-events: none;
                }
                
                @keyframes aurora-move {
                    0%, 100% {
                        transform: translate(0, 0) scale(1) rotate(0deg);
                    }
                    25% {
                        transform: translate(10%, 15%) scale(1.1) rotate(5deg);
                    }
                    50% {
                        transform: translate(-5%, 25%) scale(0.95) rotate(-3deg);
                    }
                    75% {
                        transform: translate(-15%, 5%) scale(1.05) rotate(3deg);
                    }
                }
                
                @media (prefers-reduced-motion: reduce) {
                    .aurora-blob {
                        animation: none;
                    }
                }
            `}</style>
        </div>
    );
};

export default AuroraBackground;
