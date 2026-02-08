'use client';

import { motion, Variants } from 'motion/react';

const draw: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => {
        const delay = i * 0.5;
        return {
            pathLength: 1,
            opacity: 1,
            transition: {
                pathLength: { delay, type: 'spring', duration: 1.5, bounce: 0 },
                opacity: { delay, duration: 0.01 },
            },
        };
    },
};

interface AnimatedLogoProps {
    size?: number;
    className?: string;
}

export function AnimatedLogo({ size = 200, className = '' }: AnimatedLogoProps) {
    // Scale factor to convert from original viewBox (2250x2250) to our display size
    const scale = size / 2250;

    return (
        <motion.svg
            width={size}
            height={size}
            viewBox="0 0 2250 2250"
            initial="hidden"
            animate="visible"
            className={className}
            style={{ maxWidth: '80vw' }}
        >
            {/* Main logo path - the large S8 shape */}
            <motion.path
                d="M0 0 C1.63450607 0.00081573 1.63450607 0.00081573 3.30203247 0.00164795 C55.51274561 0.1208124 107.64863942 11.74761008 153.94677734 36.38916016 C155.93930669 37.44200411 157.94651736 38.46242227 159.95703125 39.48046875 C170.35591377 44.79445084 180.15796892 50.81134214 189.8125 57.375 C190.4219043 57.78862793 191.03130859 58.20225586 191.65917969 58.62841797 C204.92182856 67.70305444 217.35371648 77.86267418 229.0859375 88.8359375 C231.61895483 91.19476453 234.20535885 93.4739244 236.8125 95.75 C261.21947868 117.69675523 280.57605783 145.71357156 296.56347656 174.15576172 C297.3357039 175.52783884 298.11273661 176.89723875 298.89746094 178.26220703 C317.00403627 209.76764811 327.6652514 245.60071925 334.0625 281.1875 C334.21372314 282.02055664 334.36494629 282.85361328 334.52075195 283.71191406 C337.50988073 301.39351376 338.18678532 319.03634692 338.125 336.9375 C338.12226578 338.58600952 338.12226578 338.58600952 338.11947632 340.26782227 C338.07330839 356.82090267 337.57261659 373.01895298 334.8125 389.375 C334.64089355 390.43364258 334.46928711 391.49228516 334.29248047 392.58300781 C329.29187404 422.78327431 319.91823452 451.34066744 307.8125 479.375"
                stroke="#ffffff"
                strokeWidth="8"
                fill="transparent"
                strokeLinecap="round"
                strokeLinejoin="round"
                variants={draw}
                custom={0}
                transform="translate(1126.1875,552.625)"
            />

            {/* Text paths - STR8GLOBAL */}
            <motion.path
                d="M0 0 C0.85929108 -0.00860046 1.71858215 -0.01720093 2.60391235 -0.02606201 C3.54885056 -0.03032196 4.49378876 -0.03458191 5.46736145 -0.03897095 C6.95786011 -0.05123718 6.95786011 -0.05123718 8.47846985 -0.06375122 C11.77790215 -0.08863101 15.07729131 -0.10512911 18.37678528 -0.11953735 C20.06545936 -0.12752287 20.06545936 -0.12752287 21.78824806 -0.13566971 C27.74849899 -0.16241426 33.70872889 -0.18178382 39.66902161 -0.19619751 C45.82506874 -0.21283602 51.98057957 -0.25760403 58.13642406 -0.30856895"
                stroke="#ff10f0"
                strokeWidth="6"
                fill="transparent"
                strokeLinecap="round"
                variants={draw}
                custom={1}
                transform="translate(894.1036834716797,1280.8460998535156)"
            />

            <motion.path
                d="M0 0 C35.64 0 71.28 0 108 0 C108 5.61 108 11.22 108 17 C93.48 17 78.96 17 64 17 C64 37.13 64 57.26 64 78 C57.73 78 51.46 78 45 78 C45 57.87 45 37.74 45 17 C30.15 17 15.3 17 0 17 C0 11.39 0 5.78 0 0 Z"
                stroke="#ffffff"
                strokeWidth="4"
                fill="transparent"
                strokeLinecap="round"
                variants={draw}
                custom={2}
                transform="translate(638,1281)"
            />

            {/* Gradient definition */}
            <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff10f0" />
                    <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
            </defs>
        </motion.svg>
    );
}

export default AnimatedLogo;
