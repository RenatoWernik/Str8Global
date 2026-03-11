import type { Metadata } from 'next';
import RestrictedShell from './RestrictedShell';

export const metadata: Metadata = {
    title: 'Str8Global — Painel de Controlo',
    robots: { index: false, follow: false },
};

export default function RestrictedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <RestrictedShell>{children}</RestrictedShell>;
}
