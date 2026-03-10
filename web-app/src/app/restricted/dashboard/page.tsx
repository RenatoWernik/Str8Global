'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    TrendingDown,
    CalendarDays,
    DollarSign,
    Package,
    Users,
    Clock,
    ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import type { Reservation, CoworkReservation } from '@/types/database';

interface DashboardData {
    reservations: Reservation[];
    coworkReservations: CoworkReservation[];
}

function formatCurrency(value: number) {
    return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(value);
}

function KPICard({
    label,
    value,
    subtitle,
    icon: Icon,
    trend,
    trendLabel,
    color = 'cyan',
    delay = 0,
}: {
    label: string;
    value: string;
    subtitle?: string;
    icon: React.ElementType;
    trend?: 'up' | 'down' | 'neutral';
    trendLabel?: string;
    color?: 'cyan' | 'emerald' | 'amber' | 'violet';
    delay?: number;
}) {
    const colorMap = {
        cyan: { bg: 'from-cyan-500/10 to-cyan-600/5', border: 'border-cyan-500/15', text: 'text-cyan-400', icon: 'bg-cyan-500/10 text-cyan-400' },
        emerald: { bg: 'from-emerald-500/10 to-emerald-600/5', border: 'border-emerald-500/15', text: 'text-emerald-400', icon: 'bg-emerald-500/10 text-emerald-400' },
        amber: { bg: 'from-amber-500/10 to-amber-600/5', border: 'border-amber-500/15', text: 'text-amber-400', icon: 'bg-amber-500/10 text-amber-400' },
        violet: { bg: 'from-violet-500/10 to-violet-600/5', border: 'border-violet-500/15', text: 'text-violet-400', icon: 'bg-violet-500/10 text-violet-400' },
    };
    const c = colorMap[color];

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={`bg-gradient-to-br ${c.bg} border ${c.border} rounded-xl p-5 relative overflow-hidden group hover:border-white/10 transition-all duration-300`}
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/[0.02] to-transparent rounded-bl-full" />
            <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg ${c.icon} flex items-center justify-center`}>
                    <Icon size={20} />
                </div>
                {trend && trendLabel && (
                    <div className={`flex items-center gap-1 text-xs font-medium ${trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-white/40'
                        }`}>
                        {trend === 'up' ? <TrendingUp size={14} /> : trend === 'down' ? <TrendingDown size={14} /> : null}
                        {trendLabel}
                    </div>
                )}
            </div>
            <div className="relative">
                <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
                <p className="text-xs text-white/40 mt-1 tracking-wide uppercase">{label}</p>
                {subtitle && <p className="text-xs text-white/25 mt-0.5">{subtitle}</p>}
            </div>
        </motion.div>
    );
}

function RecentActivity({ reservations }: { reservations: (Reservation | CoworkReservation)[] }) {
    const recent = reservations.slice(0, 8);

    if (recent.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-white/20">
                <CalendarDays size={32} className="mb-3" />
                <p className="text-sm">Sem reservas recentes</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {recent.map((res, i) => {
                const isGear = 'item_name' in res;
                return (
                    <motion.div
                        key={res.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * i, duration: 0.4 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] transition-all duration-200"
                    >
                        <div className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold ${res.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                                res.status === 'completed' ? 'bg-white/5 text-white/30' :
                                    'bg-red-500/10 text-red-400'
                            }`}>
                            {isGear ? <Package size={14} /> : <Users size={14} />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-white/80 truncate font-medium">
                                {isGear ? (res as Reservation).item_name : `Cowork — ${(res as CoworkReservation).plan_id}`}
                            </p>
                            <p className="text-xs text-white/30 truncate">{res.client}</p>
                        </div>
                        <div className="text-right shrink-0">
                            <p className="text-xs text-white/40">{new Date(res.start_date).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' })}</p>
                            <p className={`text-[10px] mt-0.5 font-medium uppercase tracking-wider ${res.status === 'active' ? 'text-emerald-400' :
                                    res.status === 'completed' ? 'text-white/25' :
                                        'text-red-400'
                                }`}>{res.status === 'active' ? 'Ativa' : res.status === 'completed' ? 'Concluída' : 'Cancelada'}</p>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}

export default function DashboardOverview() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch('/api/restricted/reservations').then(r => r.json()),
            fetch('/api/restricted/cowork-reservations').then(r => r.json()),
        ])
            .then(([reservations, coworkReservations]) => {
                setData({ reservations, coworkReservations });
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-[140px] rounded-xl bg-white/[0.02] animate-pulse border border-white/[0.04]" />
                    ))}
                </div>
                <div className="h-[400px] rounded-xl bg-white/[0.02] animate-pulse border border-white/[0.04]" />
            </div>
        );
    }

    const allRes = data?.reservations || [];
    const allCowork = data?.coworkReservations || [];
    const today = new Date().toISOString().split('T')[0];

    const activeRes = allRes.filter(r => r.status === 'active');
    const activeCowork = allCowork.filter(r => r.status === 'active');

    const currentRes = activeRes.filter(r => r.start_date <= today && r.end_date >= today);
    const upcomingRes = activeRes.filter(r => r.start_date > today);

    const totalRevenue = [...allRes, ...allCowork]
        .filter(r => r.status !== 'cancelled')
        .reduce((sum, r) => sum + (r.total_price || 0), 0);

    const monthStart = new Date();
    monthStart.setDate(1);
    const monthStartStr = monthStart.toISOString().split('T')[0];
    const monthlyRevenue = [...allRes, ...allCowork]
        .filter(r => r.status !== 'cancelled' && r.created_at >= monthStartStr)
        .reduce((sum, r) => sum + (r.total_price || 0), 0);

    const allRecent = [...allRes, ...allCowork]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return (
        <div className="space-y-8">
            {/* Page header */}
            <div>
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-bold text-white tracking-tight"
                >
                    Visão Geral
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-sm text-white/40 mt-1"
                >
                    Resumo da atividade e métricas principais
                </motion.p>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <KPICard
                    label="Receita Total"
                    value={formatCurrency(totalRevenue)}
                    subtitle="Todas as reservas"
                    icon={DollarSign}
                    color="emerald"
                    delay={0}
                />
                <KPICard
                    label="Receita Mensal"
                    value={formatCurrency(monthlyRevenue)}
                    subtitle={new Date().toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })}
                    icon={TrendingUp}
                    color="cyan"
                    delay={0.1}
                />
                <KPICard
                    label="Reservas Ativas"
                    value={`${currentRes.length + activeCowork.filter(r => r.start_date <= today && r.end_date >= today).length}`}
                    subtitle="A decorrer agora"
                    icon={Clock}
                    color="amber"
                    delay={0.2}
                />
                <KPICard
                    label="Próximas Reservas"
                    value={`${upcomingRes.length}`}
                    subtitle="Agendadas"
                    icon={CalendarDays}
                    color="violet"
                    delay={0.3}
                />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="xl:col-span-2 bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden"
                >
                    <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                        <h2 className="text-sm font-semibold text-white/80">Atividade Recente</h2>
                        <Link
                            href="/restricted/dashboard/reservas"
                            className="flex items-center gap-1 text-xs text-cyan-400/70 hover:text-cyan-400 transition-colors"
                        >
                            Ver todas <ArrowRight size={12} />
                        </Link>
                    </div>
                    <div className="p-4">
                        <RecentActivity reservations={allRecent} />
                    </div>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden"
                >
                    <div className="px-5 py-4 border-b border-white/[0.06]">
                        <h2 className="text-sm font-semibold text-white/80">Resumo Rápido</h2>
                    </div>
                    <div className="p-4 space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02]">
                            <span className="text-sm text-white/50">Total de reservas</span>
                            <span className="text-sm font-semibold text-white">{allRes.length + allCowork.length}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02]">
                            <span className="text-sm text-white/50">Equipamento</span>
                            <span className="text-sm font-semibold text-white">{allRes.filter(r => r.item_type === 'gear').length}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02]">
                            <span className="text-sm text-white/50">Estúdios</span>
                            <span className="text-sm font-semibold text-white">{allRes.filter(r => r.item_type === 'studio').length}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02]">
                            <span className="text-sm text-white/50">Cowork</span>
                            <span className="text-sm font-semibold text-white">{allCowork.length}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02]">
                            <span className="text-sm text-white/50">Canceladas</span>
                            <span className="text-sm font-semibold text-red-400">{[...allRes, ...allCowork].filter(r => r.status === 'cancelled').length}</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
