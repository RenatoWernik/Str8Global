'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    CalendarDays,
    ClipboardList,
    BarChart3,
    LogOut,
    Menu,
    X,
    ChevronRight,
} from 'lucide-react';

const navItems = [
    { href: '/restricted/dashboard', label: 'Visão Geral', icon: LayoutDashboard },
    { href: '/restricted/dashboard/reservas', label: 'Reservas', icon: ClipboardList },
    { href: '/restricted/dashboard/calendario', label: 'Calendário', icon: CalendarDays },
    { href: '/restricted/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [authenticated, setAuthenticated] = useState(false);
    const [checking, setChecking] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        fetch('/api/auth/session')
            .then(res => res.json())
            .then(data => {
                if (data.authenticated) {
                    setAuthenticated(true);
                } else {
                    router.replace('/restricted');
                }
            })
            .catch(() => router.replace('/restricted'))
            .finally(() => setChecking(false));
    }, [router]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.replace('/restricted');
    };

    if (checking || !authenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                    <span className="text-sm text-white/40 tracking-[0.2em] uppercase">
                        A carregar painel...
                    </span>
                </motion.div>
            </div>
        );
    }

    const isActive = (href: string) => {
        if (href === '/restricted/dashboard') return pathname === href;
        return pathname.startsWith(href);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex">
            {/* ── Desktop Sidebar ── */}
            <aside className="hidden lg:flex flex-col w-[260px] border-r border-white/[0.06] bg-[#0c0c14]/80 backdrop-blur-xl fixed inset-y-0 left-0 z-40">
                {/* Logo area */}
                <div className="p-6 border-b border-white/[0.06]">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/20 flex items-center justify-center shrink-0">
                            <span className="text-cyan-400 font-bold text-sm tracking-tight text-shadow-glow">S8</span>
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-base font-bold text-white tracking-tight truncate">Str8Global</h1>
                            <p className="text-[9px] text-cyan-400/40 tracking-[0.2em] uppercase font-medium leading-none mt-1">Command Center</p>
                        </div>
                    </div>
                </div>

                {/* Nav links */}
                <nav className="flex-1 py-4 px-3 space-y-1">
                    {navItems.map(({ href, label, icon: Icon }) => {
                        const active = isActive(href);
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group relative ${active
                                    ? 'text-cyan-400 bg-cyan-500/10'
                                    : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
                                    }`}
                            >
                                {active && (
                                    <motion.div
                                        layoutId="sidebar-indicator"
                                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-cyan-400 rounded-r-full"
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <Icon size={18} className={active ? 'text-cyan-400' : 'text-white/30 group-hover:text-white/50'} />
                                <span className="font-medium">{label}</span>
                                {active && <ChevronRight size={14} className="ml-auto text-cyan-400/50" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom */}
                <div className="p-4 border-t border-white/[0.06]">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full"
                    >
                        <LogOut size={18} />
                        <span>Terminar Sessão</span>
                    </button>
                </div>
            </aside>

            {/* ── Mobile Header ── */}
            <div className="lg:hidden fixed top-0 inset-x-0 z-50 h-14 bg-[#0c0c14]/90 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/20 flex items-center justify-center">
                        <span className="text-cyan-400 font-bold text-xs">S8</span>
                    </div>
                    <span className="text-sm font-semibold text-white">Str8Global</span>
                </div>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition"
                >
                    {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Mobile sidebar overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="lg:hidden fixed inset-0 bg-black/60 z-40"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="lg:hidden fixed inset-y-0 left-0 w-[280px] z-50 bg-[#0c0c14] border-r border-white/[0.06] flex flex-col pt-16"
                        >
                            <nav className="flex-1 py-4 px-3 space-y-1">
                                {navItems.map(({ href, label, icon: Icon }) => {
                                    const active = isActive(href);
                                    return (
                                        <Link
                                            key={href}
                                            href={href}
                                            onClick={() => setSidebarOpen(false)}
                                            className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-all duration-200 ${active
                                                ? 'text-cyan-400 bg-cyan-500/10'
                                                : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
                                                }`}
                                        >
                                            <Icon size={18} />
                                            <span className="font-medium">{label}</span>
                                        </Link>
                                    );
                                })}
                            </nav>
                            <div className="p-4 border-t border-white/[0.06]">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-red-400 w-full"
                                >
                                    <LogOut size={18} />
                                    <span>Terminar Sessão</span>
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* ── Main Content ── */}
            <main className="flex-1 lg:ml-[260px] pt-14 lg:pt-0">
                {/* Top bar */}
                <header className="hidden lg:flex items-center justify-between h-16 px-8 border-b border-white/[0.06] bg-[#0a0a0f]/50 backdrop-blur-sm sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-sm text-white/50">
                            {new Date().toLocaleDateString('pt-PT', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-white/40">
                            Bem-vindo, <span className="text-white/70 font-medium">Igor & Marta</span>
                        </span>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border border-cyan-500/20 flex items-center justify-center">
                            <span className="text-cyan-400 text-xs font-bold">IM</span>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <div className="p-4 md:p-6 lg:p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
