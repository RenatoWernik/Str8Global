'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    DollarSign,
    TrendingUp,
    Users,
    AlertCircle,
    Calendar,
    Star,
    Lightbulb,
    Target,
    Activity,
    Package,
    Video,
    Briefcase
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar
} from 'recharts';
import type { Reservation, CoworkReservation } from '@/types/database';

function formatCurrency(value: number) {
    return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(value);
}

const DAYS_OF_WEEK = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

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
        const allReservations = [...reservations, ...coworkReservations];
        const allActive = allReservations.filter(r => r.status !== 'cancelled');
        const cancelledCount = allReservations.filter(r => r.status === 'cancelled').length;
        const totalReservations = allReservations.length;

        // Basic Totals
        const totalRevenue = allActive.reduce((sum, r) => sum + (r.total_price || 0), 0);
        const aov = allActive.length > 0 ? totalRevenue / allActive.length : 0;
        const cancellationRate = totalReservations > 0 ? (cancelledCount / totalReservations) * 100 : 0;

        // Retention Rate
        const clientCounts: Record<string, number> = {};
        allActive.forEach(r => {
            const client = r.client.trim().toLowerCase();
            clientCounts[client] = (clientCounts[client] || 0) + 1;
        });
        const totalClients = Object.keys(clientCounts).length;
        const repeatClients = Object.values(clientCounts).filter(count => count > 1).length;
        const retentionRate = totalClients > 0 ? (repeatClients / totalClients) * 100 : 0;

        // Year to Date (YTD) vs Previous YTD
        const now = new Date();
        const currentYear = now.getFullYear();
        const ytdRevenue = allActive
            .filter(r => new Date((r as any).created_at).getFullYear() === currentYear)
            .reduce((sum, r) => sum + (r.total_price || 0), 0);
        
        const previousYtdRevenue = allActive
            .filter(r => new Date((r as any).created_at).getFullYear() === currentYear - 1)
            .reduce((sum, r) => sum + (r.total_price || 0), 0);

        // Monthly Revenue by Category for Stacked Bar Chart (Last 12 months)
        const monthlyData = Array.from({ length: 12 }, (_, i) => {
            const date = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
            const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const label = date.toLocaleDateString('pt-PT', { month: 'short' });

            const gear = allActive
                .filter(r => 'item_type' in r && r.item_type === 'gear' && (r as any).created_at.startsWith(monthStr))
                .reduce((sum, r) => sum + (r.total_price || 0), 0);
            const studio = allActive
                .filter(r => 'item_type' in r && r.item_type === 'studio' && (r as any).created_at.startsWith(monthStr))
                .reduce((sum, r) => sum + (r.total_price || 0), 0);
            const cowork = allActive
                .filter(r => !('item_type' in r) && (r as any).created_at.startsWith(monthStr))
                .reduce((sum, r) => sum + (r.total_price || 0), 0);

            return { month: label, Equipamento: gear, Estúdios: studio, Cowork: cowork };
        });

        // Performance by Day of Week
        const dayCounts = Array(7).fill(0);
        const dayStudioCounts = Array(7).fill(0);
        allActive.forEach(r => {
            const dateStr = 'start_date' in r ? r.start_date : (r as any).created_at;
            const day = new Date(dateStr).getDay();
            // check validity of day
            if (!isNaN(day)) {
                dayCounts[day]++;
                if ('item_type' in r && r.item_type === 'studio') {
                    dayStudioCounts[day]++;
                }
            }
        });
        const dnwData = DAYS_OF_WEEK.map((day, i) => ({
            day,
            Reservas: dayCounts[i]
        }));

        // Top Items (Expanded)
        const itemStats: Record<string, { name: string; count: number; revenue: number; type: string }> = {};
        allActive.forEach(r => {
            if ('item_type' in r) { // Gear or Studio
                if (!itemStats[r.item_id]) {
                    itemStats[r.item_id] = { name: r.item_name, count: 0, revenue: 0, type: r.item_type };
                }
                itemStats[r.item_id].count++;
                itemStats[r.item_id].revenue += r.total_price || 0;
            } else { // Cowork
                const name = `Cowork ${r.plan_id.replace(/-/g, ' ')}`;
                if (!itemStats[r.plan_id]) {
                    itemStats[r.plan_id] = { name, count: 0, revenue: 0, type: 'cowork' };
                }
                itemStats[r.plan_id].count++;
                itemStats[r.plan_id].revenue += r.total_price || 0;
            }
        });
        const topItems = Object.values(itemStats)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10)
            .map(item => ({
                ...item,
                aov: item.count > 0 ? item.revenue / item.count : 0
            }));

        // Generate AI-like Insights
        const insights = [];
        
        // Insight: Best day for studios
        const maxStudioDayIdx = dayStudioCounts.indexOf(Math.max(...dayStudioCounts));
        if (maxStudioDayIdx >= 0 && dayStudioCounts[maxStudioDayIdx] > 0) {
            insights.push({
                type: 'success',
                text: `🔥 ${DAYS_OF_WEEK[maxStudioDayIdx]} costuma ser o dia com mais estúdios reservados.`
            });
        }

        // Insight: Top item
        if (topItems.length > 0) {
            insights.push({
                type: 'info',
                text: `⭐ O "${topItems[0].name}" é o seu bem mais rentável atualmente.`
            });
        }

        // Insight: Cancellation alert
        if (cancellationRate > 15) {
            insights.push({
                type: 'warning',
                text: `⚠️ Atenção: A sua taxa de cancelamento está em ${cancellationRate.toFixed(1)}%, acima do recomendável.`
            });
        }

        // Insight: Retention
        if (retentionRate > 40) {
            insights.push({
                type: 'success',
                text: `💎 A sua retenção de clientes é excecional (${retentionRate.toFixed(1)}% voltam a alugar).`
            });
        }
        
        // Insight: Fallback neutral/good insight if very few
        if (insights.length < 2 && totalRevenue > 0) {
             insights.push({
                type: 'success',
                text: `📈 A gerarem uma receita acumulada viva de ${formatCurrency(totalRevenue)}.`
            });
        }

        return {
            totalRevenue,
            ytdRevenue,
            previousYtdRevenue,
            aov,
            retentionRate,
            cancelledCount,
            cancellationRate,
            monthlyData,
            dnwData,
            topItems,
            insights
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

    const ytdGrowth = analytics.previousYtdRevenue > 0
        ? ((analytics.ytdRevenue - analytics.previousYtdRevenue) / analytics.previousYtdRevenue * 100).toFixed(1)
        : '—';

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Analytics Avançado</h1>
                <p className="text-sm text-white/40 mt-1">Métricas aprofundadas, de ticket médio a padrões semanais.</p>
            </div>

            {/* AI Insights Panel */}
            {analytics.insights.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/[0.02] border border-cyan-500/20 rounded-xl p-5 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                        <Lightbulb size={120} />
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                        <Lightbulb size={18} className="text-cyan-400" />
                        <h2 className="text-sm font-semibold text-white/90">Insights Inteligentes</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                        {analytics.insights.map((insight, i) => (
                            <div 
                                key={i} 
                                className={`p-4 rounded-lg border text-sm flex items-start leading-relaxed ${
                                    insight.type === 'warning' ? 'bg-red-500/10 border-red-500/20 text-red-100' :
                                    insight.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-100' :
                                    'bg-cyan-500/10 border-cyan-500/20 text-cyan-100'
                                }`}
                            >
                                {insight.text}
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* KPI Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                    {
                        label: 'Ticket Médio (AOV)',
                        value: formatCurrency(analytics.aov),
                        subtitle: 'Gasto médio por reserva',
                        icon: Target,
                        color: 'cyan',
                    },
                    {
                        label: 'Taxa de Retenção',
                        value: `${analytics.retentionRate.toFixed(1)}%`,
                        subtitle: 'Clientes repetidos vs totais',
                        icon: Users,
                        color: 'violet',
                    },
                    {
                        label: 'Cancelamentos',
                        value: `${analytics.cancelledCount}`,
                        subtitle: `${analytics.cancellationRate.toFixed(1)}% do acumulado`,
                        icon: AlertCircle,
                        color: 'red',
                    },
                    {
                        label: 'Receita YTD',
                        value: formatCurrency(analytics.ytdRevenue),
                        subtitle: ytdGrowth !== '—' ? `${Number(ytdGrowth) >= 0 ? '+' : ''}${ytdGrowth}% vs ano anterior` : 'Ano corrente',
                        icon: DollarSign,
                        color: 'emerald',
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

            {/* Charts Row */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Monthly Stacked Bar Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden p-5"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp size={16} className="text-emerald-400/60" />
                        <h2 className="text-sm font-semibold text-white/80">Receita Mensal Detalhada</h2>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analytics.monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `€${val}`} />
                                <Tooltip 
                                    cursor={{fill: 'rgba(255,255,255,0.02)'}}
                                    contentStyle={{ backgroundColor: '#12121a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                                    itemStyle={{ fontSize: '12px' }}
                                    formatter={(value: any) => formatCurrency(Number(value))}
                                />
                                <Legend wrapperStyle={{ fontSize: '11px', opacity: 0.7 }} />
                                <Bar dataKey="Equipamento" stackId="a" fill="#22d3ee" radius={[0, 0, 4, 4]} />
                                <Bar dataKey="Estúdios" stackId="a" fill="#a78bfa" />
                                <Bar dataKey="Cowork" stackId="a" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Day of Week Radar Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden p-5"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <Activity size={16} className="text-violet-400/60" />
                        <h2 className="text-sm font-semibold text-white/80">Check-ins e Afluência (Dias da Semana)</h2>
                    </div>
                    <div className="h-[300px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={analytics.dnwData}>
                                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                <PolarAngleAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} />
                                <Radar 
                                    name="Reservas Totais" 
                                    dataKey="Reservas" 
                                    stroke="#8b5cf6" 
                                    fill="#8b5cf6" 
                                    fillOpacity={0.4} 
                                />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#12121a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Top Items Table */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden"
            >
                <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2">
                    <Star size={16} className="text-amber-400/60" />
                    <h2 className="text-sm font-semibold text-white/80">Itens com Maior Rentabilidade</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead>
                            <tr className="border-b border-white/[0.06] bg-black/40">
                                <th className="text-[10px] tracking-[0.15em] uppercase text-white/30 font-medium px-5 py-4">Ranking</th>
                                <th className="text-[10px] tracking-[0.15em] uppercase text-white/30 font-medium px-5 py-4">Item (Referência)</th>
                                <th className="text-[10px] tracking-[0.15em] uppercase text-white/30 font-medium px-5 py-4 text-right">Qtd. Alugueres</th>
                                <th className="text-[10px] tracking-[0.15em] uppercase text-white/30 font-medium px-5 py-4 text-right">Ticket Médio</th>
                                <th className="text-[10px] tracking-[0.15em] uppercase text-white/30 font-medium px-5 py-4 text-right">Receita Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analytics.topItems.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-12 text-white/20 text-sm">
                                        Sem dados de aluguer suficientes
                                    </td>
                                </tr>
                            ) : (
                                analytics.topItems.map((item, i) => (
                                    <tr key={item.name} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition">
                                        <td className="px-5 py-4 text-xs font-mono text-white/40">
                                            #{i + 1}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                {item.type === 'gear' ? <Package size={14} className="text-cyan-400/60" /> :
                                                 item.type === 'studio' ? <Video size={14} className="text-violet-400/60" /> :
                                                 <Briefcase size={14} className="text-amber-400/60" />}
                                                <span className="text-sm font-medium text-white/80">{item.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-sm text-white/60 text-right">
                                            {item.count}x
                                        </td>
                                        <td className="px-5 py-4 text-sm text-white/60 text-right">
                                            {formatCurrency(item.aov)}
                                        </td>
                                        <td className="px-5 py-4 text-sm font-semibold text-emerald-400/90 text-right">
                                            {formatCurrency(item.revenue)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}

