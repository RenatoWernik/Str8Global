'use client';

import { useEffect } from 'react';

export default function RestrictedShell({
    children,
}: {
    children: React.ReactNode;
}) {
    // Add restricted-page class to body to opt out of global typography overrides
    useEffect(() => {
        document.body.classList.add('restricted-page');
        return () => {
            document.body.classList.remove('restricted-page');
        };
    }, []);

    return (
        <div className="restricted-root bg-[#0a0a0f] text-white min-h-screen">
            {children}
        </div>
    );
}
