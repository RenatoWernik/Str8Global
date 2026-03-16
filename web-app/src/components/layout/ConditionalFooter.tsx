'use client';

import { usePathname } from 'next/navigation';
import { Footer } from './Footer';

export function ConditionalFooter() {
    const pathname = usePathname();
    const isRestricted = pathname?.startsWith('/restricted');
    if (isRestricted) return null;
    return <Footer />;
}
