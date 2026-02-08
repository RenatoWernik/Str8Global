'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface SimplifiedLogoProps {
    size?: number;
    className?: string;
}

export function PremiumLogo({ size = 220, className = '' }: SimplifiedLogoProps) {
    return (
        <motion.div
            className={`relative ${className}`}
            style={{ width: size, height: size }}
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{
                duration: 1.2,
                delay: 0.3,
                ease: [0.23, 1, 0.32, 1],
            }}
        >
            {/* Subtle ambient glow that breathes */}
            <motion.div
                animate={{
                    opacity: [0.15, 0.25, 0.15],
                    scale: [0.95, 1.05, 0.95],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                    background: 'radial-gradient(circle, rgba(255,16,240,0.2) 0%, transparent 60%)',
                    filter: 'blur(30px)',
                }}
            />

            {/* Logo image */}
            <Image
                src="/logo.svg"
                alt="Str8Global"
                width={size}
                height={size}
                className="relative z-10 drop-shadow-[0_0_40px_rgba(255,16,240,0.2)]"
                priority
            />
        </motion.div>
    );
}

export default PremiumLogo;
