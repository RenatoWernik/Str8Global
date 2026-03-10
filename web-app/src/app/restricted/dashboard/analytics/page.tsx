'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    DollarSign,
    TrendingUp,
    BarChart3,
    PieChart,
    Package,
    Video,
    Users,
    Calendar,
    Star,
} from 'lucide-react';
import type { Reservation, CoworkReservation } from '@/types/database';

function formatCurrency(value: number) {
    return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(value);
}

// ── Simple Bar Chart (SVG) ──
function MiniBarChart({ data, color = '#22d3ee' }: { data: number[], color?: string }) {
    const max = Math.max(...data, 1);
    const barWidth = 100 / data.length;

    return (
        <svg viewBox="0 0 100 40" className="w-full h-24" preserveAspectRatio="none">
            {data.map((val, i) => {
                const height = (val / max) * 36;
                return (
                    <motion.rect
                        key={i}
                        initial={{ height: 0, y: 40 }}
                        animate={{ height, y: 40 - height }}
                        transition={{ delay: i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        x={i * barWidth + barWidth * 0.15}
                        width={barWidth * 0.7}
                        rx={1}
                        fill={color}
                        fillOpacity={0.6}
                    />
                );
            })}
        </svg>
    );
}

// ── Donut Chart (SVG) ──
function DonutChart({ segments }: { segments: { label: string; value: number; color: string }[] }) {
    const total = segments.reduce((sum, s) => sum + s.value, 0);
    if (total === 0) {
        return (
            <div className="flex items-center justify-center h-40 text-white/20 text-sm">
                Sem dados
            </div>
        );
    }

    let cumulativePercent = 0;

    return (
        <div className="flex items-center gap-6">
            <svg viewBox="0 0 36 36" className="w-32 h-32 shrink-0">
                {segments.map((seg, i) => {
                    const percent = (seg.value / total) * 100;
                    const dash = `${percent} ${100 - percent}`;
                    const offset = -cumulativePercent + 25; // start from top
                    cumulativePercent += percent;

                    return (
                        <motion.circle
                            key={i}
                            initial={{ strokeDasharray: '0 100' }}
                            animate={{ strokeDasharray: dash }}
                            transition={{ delay: i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            cx="18"
                            cy="18"
                            r="15.91549430918954"
                            fill="transparent"
                            stroke={seg.color}
                            strokeWidth="2.5"
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                        />
                    );
                })}
                <text x="18" y="17" textAnchor="middle" className="fill-white text-[4px] font-bold">
                    {formatCurrency(total)}
                </text>
                <text x="18" y="21" textAnchor="middle" className="fill-white/30 text-[2.5px]">
                    Total
                </text>
            </svg>

            <div className="space-y-2 flex-1">
                {segments.map((seg, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                        <span className="text-xs text-white/50 flex-1">{seg.label}</span>
                        <span className="text-xs text-white/70 font-medium">{formatCurrency(seg.value)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function AnalyticsPage() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [coworkReservations, setCoworkReservations] = useState<CoworkReservation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch('/api/restricted/reservations').then(r => r.json()),
            fetch('/api/restricted/cowork-reservations').then(r => r.json()),
        ])
            .then(([res, cowork]) => {
                setReservations(Array.isArray(res) ? res : []);
                setCoworkReservations(Array.isArray(cowork) ? cowork : []);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const analytics = useMemo(() => {
        const allActive = [...reservations, ...coworkReservations].filter(r => r.status !== 'cancelled');

        // Revenue by month (last 12 months)
        const now = new Date();
        const monthlyRevenue = Array.from({ length: 12 }, (_, i) => {
            const date = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
            const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            return allActive
                .filter(r => r.created_at.startsWith(monthStr))
                .reduce((sum, r) => sum + (r.total_price || 0), 0);
        });

        // Revenue by category
        const gearRevenue = reservations
            .filter(r => r.status !== 'cancelled' && r.item_type === 'gear')
            .reduce((sum, r) => sum + (r.total_price || 0), 0);
        const studioRevenue = reservations
            .filter(r => r.status !== 'cancelled' && r.item_type === 'studio')
            .reduce((sum, r) => sum + (r.total_price || 0), 0);
        const coworkRevenue = coworkReservations
            .filter(r => r.status !== 'cancelled')
            .reduce((sum, r) => sum + (r.total_price || 0), 0);

        // Top items (most rented)
        const itemCounts: Record<string, { name: string; count: number; revenue: number }> = {};
        for (const r of reservations.filter(r => r.status !== 'cancelled')) {
            if (!itemCounts[r.item_id]) {
                itemCounts[r.item_id] = { name: r.item_name, count: 0, revenue: 0 };
            }
            itemCounts[r.item_id].count++;
            itemCounts[r.item_id].revenue += r.total_price || 0;
        }
        const topItems = Object.values(itemCounts)
            .sort((a, b) => b.count - a.count)
            .slice(0, 8);

        // Unique clients
        const uniqueClients = new Set([
            ...reservations.map(r => r.client),
            ...coworkReservations.map(r => r.client),
        ]).size;

        // This month vs last month
        const thisMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthStr = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;

        const thisMonthRevenue = allActive
            .filter(r => r.created_at.startsWith(thisMonthStr))
            .reduce((sum, r) => sum + (r.total_price || 0), 0);
        const lastMonthRevenue = allActive
            .filter(r => r.created_at.startsWith(lastMonthStr))
            .reduce((sum, r) => sum + (r.total_price || 0), 0);

        const thisMonthBookings = allActive.filter(r => r.created_at.startsWith(thisMonthStr)).length;
        const lastMonthBookings = allActive.filter(r => r.created_at.startsWith(lastMonthStr)).length;

        return {
            monthlyRevenue,
            gearRevenue,
            studioRevenue,
            coworkRevenue,
            topItems,
            uniqueClients,
            thisMonthRevenue,
            lastMonthRevenue,
            thisMonthBookings,
            lastMonthBookings,
            totalRevenue: gearRevenue + studioRevenue + coworkRevenue,
            totalBookings: allActive.length,
        };
    }, [reservations, coworkReservations]);

    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-[200px] bg-white/[0.02] rounded-xl animate-pulse" />
                ))}
            </div>
        );
    }

    const revenueGrowth = analytics.lastMonthRevenue > 0
        ? ((analytics.thisMonthRevenue - analytics.lastMonthRevenue) / analytics.lastMonthRevenue * 100).toFixed(1)
        : '—';

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Analytics</h1>
                <p className="text-sm text-white/40 mt-1">Métricas, tendências e insights do negócio</p>
            </div>

            {/* Top metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                    {
                        label: 'Receita Total',
                        value: formatCurrency(analytics.totalRevenue),
                        icon: DollarSign,
                        color: 'emerald',
                    },
                    {
                        label: 'Este Mês',
                        value: formatCurrency(analytics.thisMonthRevenue),
                        subtitle: revenueGrowth !== '—' ? `${Number(revenueGrowth) >= 0 ? '+' : ''}${revenueGrowth}% vs mês anterior` : undefined,
                        icon: TrendingUp,
                        color: 'cyan',
                    },
                    {
                        label: 'Total Reservas',
                        value: `${analytics.totalBookings}`,
                        subtitle: `${analytics.thisMonthBookings} este mês`,
                        icon: Calendar,
                        color: 'amber',
                    },
                    {
                        label: 'Clientes Únicos',
                        value: `${analytics.uniqueClients}`,
                        icon: Users,
                        color: 'violet',
                    },
                ].map((card, i) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`bg-gradient-to-br from-${card.color}-500/10 to-${card.color}-600/5 border border-${card.color}-500/15 rounded-xl p-5`}
                    >
                        <div className={`w-10 h-10 rounded-lg bg-${card.color}-500/10 flex items-center justify-center mb-3`}>
                            <card.icon size={20} className={`text-${card.color}-400`} />
                        </div>
                        <p className="text-2xl font-bold text-white">{card.value}</p>
                        <p className="text-xs text-white/40 mt-1 uppercase tracking-wide">{card.label}</p>
                        {card.subtitle && <p className="text-xs text-white/25 mt-0.5">{card.subtitle}</p>}
                    </motion.div>
                ))}
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Revenue Trend */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden"
                >
                    <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2">
                        <BarChart3 size={16} className="text-cyan-400/60" />
                        <h2 className="text-sm font-semibold text-white/80">Receita Mensal (12 meses)</h2>
                    </div>
                    <div className="p-5">
                        <MiniBarChart data={analytics.monthlyRevenue} color="#22d3ee" />
                        <div className="flex justify-between mt-2 text-[9px] text-white/20 uppercase">
                            <span>{new Date(new Date().getFullYear(), new Date().getMonth() - 11, 1).toLocaleDateString('pt-PT', { month: 'short' })}</span>
                            <span>{new Date().toLocaleDateString('pt-PT', { month: 'short' })}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Category Breakdown */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden"
                >
                    <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2">
                        <PieChart size={16} className="text-violet-400/60" />
                        <h2 className="text-sm font-semibold text-white/80">Receita por Categoria</h2>
                    </div>
                    <div className="p-5">
                        <DonutChart segments={[
                            { label: 'Equipamento', value: analytics.gearRevenue, color: '#22d3ee' },
                            { label: 'Estúdios', value: analytics.studioRevenue, color: '#a78bfa' },
                            { label: 'Cowork', value: analytics.coworkRevenue, color: '#fbbf24' },
                        ]} />
                    </div>
                </motion.div>
            </div>

            {/* Top Items */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden"
            >
                <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2">
                    <Star size={16} className="text-amber-400/60" />
                    <h2 className="text-sm font-semibold text-white/80">Itens Mais Alugados</h2>
                </div>
                <div className="p-4">
                    {analytics.topItems.length === 0 ? (
                        <div className="py-8 text-center text-sm text-white/20">Sem dados de aluguer</div>
                    ) : (
                        <div className="space-y-2">
                            {analytics.topItems.map((item, i) => {
                                const maxCount = analytics.topItems[0]?.count || 1;
                                return (
                                    <div key={item.name} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/[0.02] transition">
                                        <span className="text-sm text-white/20 w-6 text-right font-mono">#{i + 1}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-white/80 font-medium truncate">{item.name}</p>
                                            <div className="mt-1.5 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(item.count / maxCount) * 100}%` }}
                                                    transition={{ delay: 0.1 * i, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                                    className="h-full bg-gradient-to-r from-cyan-500/60 to-cyan-400/40 rounded-full"
                                                />
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-sm text-white/60 font-medium">{item.count}x</p>
                                            <p className="text-[10px] text-white/25">{formatCurrency(item.revenue)}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
