'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';

export function ConditionalNavbar() {
    const pathname = usePathname();
    const isRestricted = pathname?.startsWith('/restricted');
    if (isRestricted) return null;
    return <Navbar />;
}
