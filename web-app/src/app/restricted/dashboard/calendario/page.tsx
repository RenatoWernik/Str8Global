'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Package, Video, Users } from 'lucide-react';
import type { Reservation, CoworkReservation } from '@/types/database';

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

export default function CalendarioPage() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [coworkReservations, setCoworkReservations] = useState<CoworkReservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<string | null>(null);

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

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const today = new Date().toISOString().split('T')[0];

    const selectedDayData = selectedDay ? dayMap[selectedDay] : null;

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
                                                <div key={r.id} className={`text-[9px] px-1.5 py-0.5 rounded truncate ${r.item_type === 'gear' ? 'bg-cyan-500/10 text-cyan-400/70' : 'bg-violet-500/10 text-violet-400/70'
                                                    }`}>
                                                    {r.item_name}
                                                </div>
                                            ))}
                                            {data.cowork.slice(0, 1).map(r => (
                                                <div key={r.id} className="text-[9px] px-1.5 py-0.5 rounded truncate bg-amber-500/10 text-amber-400/70">
                                                    CW: {r.plan_id}
                                                </div>
                                            ))}
                                            {totalEvents > 3 && (
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
                            <div className="space-y-3">
                                {selectedDayData.reservations.map(r => (
                                    <div key={r.id} className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.04]">
                                        <div className="flex items-center gap-2 mb-1">
                                            {r.item_type === 'gear' ? (
                                                <Package size={14} className="text-cyan-400/60" />
                                            ) : (
                                                <Video size={14} className="text-violet-400/60" />
                                            )}
                                            <span className="text-sm text-white/80 font-medium">{r.item_name}</span>
                                        </div>
                                        <p className="text-xs text-white/40">{r.client}</p>
                                        {r.total_price && <p className="text-xs text-emerald-400/60 mt-1">{r.total_price}€</p>}
                                    </div>
                                ))}
                                {selectedDayData.cowork.map(r => (
                                    <div key={r.id} className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.04]">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Users size={14} className="text-amber-400/60" />
                                            <span className="text-sm text-white/80 font-medium capitalize">Cowork — {r.plan_id}</span>
                                        </div>
                                        <p className="text-xs text-white/40">{r.client} · {r.spots} lugar{r.spots > 1 ? 'es' : ''}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
