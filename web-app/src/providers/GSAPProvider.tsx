'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register GSAP plugins
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface GSAPContextType {
    gsap: typeof gsap;
    ScrollTrigger: typeof ScrollTrigger;
}

const GSAPContext = createContext<GSAPContextType | null>(null);

interface GSAPProviderProps {
    children: ReactNode;
}

export function GSAPProvider({ children }: GSAPProviderProps) {
    useEffect(() => {
        // Debounced refresh — avoid dozens of ScrollTrigger.refresh() during resize
        let timeout: ReturnType<typeof setTimeout>;
        const handleResize = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => ScrollTrigger.refresh(), 200);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            clearTimeout(timeout);
            window.removeEventListener('resize', handleResize);
            ScrollTrigger.killAll();
        };
    }, []);

    return (
        <GSAPContext.Provider value={{ gsap, ScrollTrigger }}>
            {children}
        </GSAPContext.Provider>
    );
}

export function useGSAPContext() {
    const context = useContext(GSAPContext);
    if (!context) {
        throw new Error('useGSAPContext must be used within a GSAPProvider');
    }
    return context;
}

export default GSAPProvider;
