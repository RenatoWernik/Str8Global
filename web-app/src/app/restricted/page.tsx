'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function RestrictedLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);
    const emailRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Check if already authenticated
    useEffect(() => {
        fetch('/api/auth/session')
            .then(res => res.json())
            .then(data => {
                if (data.authenticated) {
                    router.replace('/restricted/dashboard');
                } else {
                    setChecking(false);
                }
            })
            .catch(() => setChecking(false));
    }, [router]);

    useEffect(() => {
        if (!checking && emailRef.current) {
            emailRef.current.focus();
        }
    }, [checking]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Erro ao autenticar');
                setLoading(false);
                return;
            }

            router.replace('/restricted/dashboard');
        } catch {
            setError('Erro de conexão. Tente novamente.');
            setLoading(false);
        }
    };

    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                    <span className="text-sm text-white/40 tracking-[0.2em] uppercase">A verificar sessão...</span>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] relative overflow-hidden">
            {/* Jarvis-style ambient background */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.3) 1px, transparent 1px)
            `,
                        backgroundSize: '60px 60px',
                    }}
                />
                {/* Radial glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px]" />
                <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-blue-600/5 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 w-full max-w-md mx-4"
            >
                {/* Card */}
                <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-8 md:p-10 shadow-2xl">
                    {/* Top accent line */}
                    <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

                    {/* Logo / Title Area */}
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            <div className="inline-flex items-center gap-2 mb-4">
                                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                                <span className="text-[10px] tracking-[0.3em] uppercase text-cyan-400/70 font-medium">
                                    Acesso Restrito
                                </span>
                            </div>
                            <h1 className="text-2xl font-semibold text-white tracking-tight">
                                Str8Global
                            </h1>
                            <p className="text-sm text-white/30 mt-2">
                                Painel de Controlo
                            </p>
                        </motion.div>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.4 }}
                        >
                            <label htmlFor="email" className="block text-[11px] tracking-[0.15em] uppercase text-white/40 mb-2 font-medium">
                                Email
                            </label>
                            <input
                                ref={emailRef}
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 transition-all duration-300"
                                placeholder="admin@str8global.com"
                                required
                                autoComplete="email"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4, duration: 0.4 }}
                        >
                            <label htmlFor="password" className="block text-[11px] tracking-[0.15em] uppercase text-white/40 mb-2 font-medium">
                                Palavra-passe
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 transition-all duration-300"
                                placeholder="••••••••••••"
                                required
                                autoComplete="current-password"
                            />
                        </motion.div>

                        {/* Error */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5, height: 0 }}
                                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                                    exit={{ opacity: 0, y: -5, height: 0 }}
                                    className="flex items-center gap-2 text-red-400/90 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3"
                                >
                                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Submit */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.4 }}
                        >
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full relative bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-500/50 text-cyan-400 font-medium py-3 rounded-lg text-sm tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden"
                            >
                                {/* Hover glow */}
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <span className="relative">
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                                            A autenticar...
                                        </span>
                                    ) : (
                                        'Entrar no Painel'
                                    )}
                                </span>
                            </button>
                        </motion.div>
                    </form>

                    {/* Bottom accent */}
                    <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                </div>

                {/* Subtle footer text */}
                <p className="text-center text-[10px] text-white/15 mt-6 tracking-[0.2em] uppercase">
                    Str8Global © {new Date().getFullYear()} — Sistema Interno
                </p>
            </motion.div>
        </div>
    );
}
