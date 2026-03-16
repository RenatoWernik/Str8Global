'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Package, Video, Users } from 'lucide-react';
import type { Reservation, CoworkReservation } from '@/types/database';
import { ReservationDetailsModal } from '@/components/ui/ReservationDetailsModal';
import { coworkPlans, coworkStudioPlans } from '@/data/rentalData';

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Monday=0, Sunday=6
}

const MONTHS_PT = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];
const DAYS_PT = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

// Build capacity map from rentalData
const COWORK_CAPACITY: Record<string, { label: string; total: number }> = {};
for (const plan of coworkPlans) {
    const planId = `cowork-${plan.name.toLowerCase()}`;
    COWORK_CAPACITY[planId] = { label: plan.name, total: plan.totalSpots };
}
for (const plan of coworkStudioPlans) {
    const planId = `coworkstudio-${plan.name.toLowerCase()}`;
    COWORK_CAPACITY[planId] = { label: `${plan.name} (C+E)`, total: plan.totalSpots };
}

function getOccupancyColor(occupied: number, total: number): string {
    if (total === 0) return 'bg-white/10';
    const ratio = occupied / total;
    if (ratio >= 1) return 'bg-red-500/30';
    if (ratio >= 0.75) return 'bg-amber-500/30';
    return 'bg-emerald-500/30';
}

function getOccupancyBarColor(occupied: number, total: number): string {
    if (total === 0) return 'bg-white/20';
    const ratio = occupied / total;
    if (ratio >= 1) return 'bg-red-400';
    if (ratio >= 0.75) return 'bg-amber-400';
    return 'bg-emerald-400';
}

export default function CalendarioPage() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [coworkReservations, setCoworkReservations] = useState<CoworkReservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [selectedReservation, setSelectedReservation] = useState<Reservation | CoworkReservation | null>(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

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

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    // Build reservation map per day
    const dayMap = useMemo(() => {
        const map: Record<string, { reservations: Reservation[]; cowork: CoworkReservation[] }> = {};

        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            map[dateStr] = { reservations: [], cowork: [] };

            for (const r of reservations) {
                if (r.status === 'cancelled') continue;
                if (r.start_date <= dateStr && r.end_date >= dateStr) {
                    map[dateStr].reservations.push(r);
                }
            }
            for (const r of coworkReservations) {
                if (r.status === 'cancelled') continue;
                if (r.start_date <= dateStr && r.end_date >= dateStr) {
                    map[dateStr].cowork.push(r);
                }
            }
        }
        return map;
    }, [reservations, coworkReservations, year, month, daysInMonth]);

    // Compute cowork occupancy for a given day's cowork reservations
    const getCoworkOccupancy = (coworkRes: CoworkReservation[]) => {
        const occupancy: Record<string, number> = {};
        for (const r of coworkRes) {
            occupancy[r.plan_id] = (occupancy[r.plan_id] || 0) + r.spots;
        }
        return occupancy;
    };

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const today = new Date().toISOString().split('T')[0];

    const selectedDayData = selectedDay ? dayMap[selectedDay] : null;
    const selectedOccupancy = selectedDayData ? getCoworkOccupancy(selectedDayData.cowork) : {};

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-12 bg-white/[0.02] rounded-xl animate-pulse" />
                <div className="h-[600px] bg-white/[0.02] rounded-xl animate-pulse" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Calendário</h1>
                <p className="text-sm text-white/40 mt-1">Visualização mensal de todas as reservas</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Calendar */}
                <div className="xl:col-span-2 bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden">
                    {/* Month navigation */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                        <button onClick={prevMonth} className="p-2 text-white/40 hover:text-white hover:bg-white/[0.04] rounded-lg transition">
                            <ChevronLeft size={18} />
                        </button>
                        <h2 className="text-sm font-semibold text-white/80">
                            {MONTHS_PT[month]} {year}
                        </h2>
                        <button onClick={nextMonth} className="p-2 text-white/40 hover:text-white hover:bg-white/[0.04] rounded-lg transition">
                            <ChevronRight size={18} />
                        </button>
                    </div>

                    {/* Day headers */}
                    <div className="grid grid-cols-7 border-b border-white/[0.04]">
                        {DAYS_PT.map(day => (
                            <div key={day} className="text-center py-2 text-[10px] tracking-[0.15em] uppercase text-white/25 font-medium">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar grid */}
                    <div className="grid grid-cols-7">
                        {/* Empty cells for days before month starts */}
                        {Array.from({ length: firstDay }).map((_, i) => (
                            <div key={`empty-${i}`} className="h-24 border-b border-r border-white/[0.03] bg-white/[0.01]" />
                        ))}

                        {/* Day cells */}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            const data = dayMap[dateStr];
                            const totalEvents = (data?.reservations.length || 0) + (data?.cowork.length || 0);
                            const isToday = dateStr === today;
                            const isSelected = dateStr === selectedDay;

                            // Compute cowork occupancy for cell badge
                            const dayOccupancy = data ? getCoworkOccupancy(data.cowork) : {};
                            const totalCoworkSpots = Object.entries(dayOccupancy).reduce((sum, [planId, occupied]) => {
                                const cap = COWORK_CAPACITY[planId];
                                return sum + (cap ? occupied : 0);
                            }, 0);
                            const totalCoworkCapacity = Object.entries(dayOccupancy).reduce((sum, [planId]) => {
                                const cap = COWORK_CAPACITY[planId];
                                return sum + (cap ? cap.total : 0);
                            }, 0);

                            return (
                                <motion.button
                                    key={day}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedDay(dateStr === selectedDay ? null : dateStr)}
                                    className={`h-24 border-b border-r border-white/[0.03] p-2 text-left transition-all duration-200 hover:bg-white/[0.03] relative ${isSelected ? 'bg-cyan-500/5 ring-1 ring-cyan-500/20' : ''
                                        }`}
                                >
                                    <span className={`text-xs font-medium ${isToday ? 'bg-cyan-500 text-black w-6 h-6 rounded-full flex items-center justify-center' :
                                            'text-white/40'
                                        }`}>
                                        {day}
                                    </span>

                                    {totalEvents > 0 && (
                                        <div className="mt-1 space-y-0.5">
                                            {data.reservations.slice(0, 2).map(r => (
                                                <div key={r.id} className={`flex items-center justify-between text-[9px] px-1.5 py-0.5 rounded truncate ${r.item_type === 'gear' ? 'bg-cyan-500/10 text-cyan-400/70' : 'bg-violet-500/10 text-violet-400/70'
                                                    }`}>
                                                    <span className="truncate">{r.item_name}</span>
                                                    {r.item_type === 'studio' && r.start_time && (
                                                        <span className="flex-shrink-0 ml-1 opacity-70 font-mono tracking-tighter">{r.start_time}</span>
                                                    )}
                                                </div>
                                            ))}
                                            {totalCoworkSpots > 0 && (
                                                <div className={`text-[9px] px-1.5 py-0.5 rounded truncate ${getOccupancyColor(totalCoworkSpots, totalCoworkCapacity)} text-amber-400/70 flex items-center gap-1`}>
                                                    <Users size={8} />
                                                    <span>CW {totalCoworkSpots}/{totalCoworkCapacity}</span>
                                                </div>
                                            )}
                                            {totalEvents > 3 && totalCoworkSpots === 0 && (
                                                <div className="text-[9px] text-white/25 px-1">+{totalEvents - 3} mais</div>
                                            )}
                                        </div>
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                {/* Day Detail Panel */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-white/[0.06]">
                        <h2 className="text-sm font-semibold text-white/80">
                            {selectedDay
                                ? new Date(selectedDay).toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })
                                : 'Selecione um dia'
                            }
                        </h2>
                    </div>

                    <div className="p-4">
                        {!selectedDay ? (
                            <div className="flex flex-col items-center justify-center py-12 text-white/15">
                                <p className="text-sm">Clique num dia para ver detalhes</p>
                            </div>
                        ) : !selectedDayData || (selectedDayData.reservations.length === 0 && selectedDayData.cowork.length === 0) ? (
                            <div className="flex flex-col items-center justify-center py-12 text-white/15">
                                <p className="text-sm">Sem reservas neste dia</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Cowork Occupancy Summary */}
                                {selectedDayData.cowork.length > 0 && (
                                    <div className="space-y-2 pb-3 border-b border-white/[0.06]">
                                        <p className="text-[10px] tracking-[0.15em] uppercase text-white/30 font-medium">Ocupação Cowork</p>
                                        {Object.entries(COWORK_CAPACITY).map(([planId, cap]) => {
                                            const occupied = selectedOccupancy[planId] || 0;
                                            if (occupied === 0) return null;
                                            const pct = Math.min((occupied / cap.total) * 100, 100);
                                            return (
                                                <div key={planId} className="space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-white/60">{cap.label}</span>
                                                        <span className="text-xs text-white/40 font-mono">{occupied}/{cap.total}</span>
                                                    </div>
                                                    <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full transition-all duration-300 ${getOccupancyBarColor(occupied, cap.total)}`}
                                                            style={{ width: `${pct}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Reservations list */}
                                <div className="space-y-3">
                                    {selectedDayData.reservations.map(r => (
                                        <div
                                            key={r.id}
                                            onClick={() => setSelectedReservation(r)}
                                            className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.04] cursor-pointer hover:bg-white/[0.05] transition"
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-2">
                                                    {r.item_type === 'gear' ? (
                                                        <Package size={14} className="text-cyan-400/60" />
                                                    ) : (
                                                        <Video size={14} className="text-violet-400/60" />
                                                    )}
                                                    <span className="text-sm text-white/80 font-medium">{r.item_name}</span>
                                                </div>
                                                {r.item_type === 'studio' && r.start_time && r.end_time && (
                                                    <span className="text-[10px] font-mono text-white/50 bg-white/[0.05] border border-white/5 px-1.5 py-0.5 rounded">
                                                        {r.start_time} - {r.end_time}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <p className="text-xs text-white/40">{r.client}</p>
                                                {r.total_price && <p className="text-xs text-emerald-400/60">{r.total_price.toFixed(2)}€</p>}
                                            </div>
                                        </div>
                                    ))}
                                    {selectedDayData.cowork.map(r => (
                                        <div
                                            key={r.id}
                                            onClick={() => setSelectedReservation(r)}
                                            className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.04] cursor-pointer hover:bg-white/[0.05] transition"
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <Users size={14} className="text-amber-400/60" />
                                                <span className="text-sm text-white/80 font-medium capitalize">Cowork — {r.plan_id.replace('-', ' ')}</span>
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <p className="text-xs text-white/40">{r.client} · {r.spots} lugar{r.spots > 1 ? 'es' : ''}</p>
                                                {r.total_price && <p className="text-xs text-emerald-400/60">{r.total_price.toFixed(2)}€</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ReservationDetailsModal
                open={!!selectedReservation}
                onClose={() => setSelectedReservation(null)}
                reservation={selectedReservation}
            />
        </div>
    );
}
