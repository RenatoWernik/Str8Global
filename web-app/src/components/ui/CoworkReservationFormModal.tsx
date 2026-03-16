'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, AlertTriangle, CalendarRange, Users, Loader2 } from 'lucide-react';
import type { CoworkReservationInsert, CoworkReservationRow } from '@/types/database';
import { coworkPlans, coworkStudioPlans } from '@/data/rentalData';

interface CoworkReservationFormModalProps {
    open: boolean;
    onClose: () => void;
    onSave: () => void;
    editingReservation?: CoworkReservationRow | null;
}

const coworkPlansList = [
    { id: 'cowork-starter', name: 'Starter', type: 'cowork' },
    { id: 'cowork-prime', name: 'Prime', type: 'cowork' },
    { id: 'cowork-premium', name: 'Premium', type: 'cowork' },
    { id: 'coworkstudio-starter', name: 'Starter (Cowork+Estúdio)', type: 'cowork-studio' },
    { id: 'coworkstudio-prime', name: 'Prime (Cowork+Estúdio)', type: 'cowork-studio' },
    { id: 'coworkstudio-premium', name: 'Premium (Cowork+Estúdio)', type: 'cowork-studio' },
];

// Build capacity map from rentalData
const PLAN_CAPACITY: Record<string, number> = {};
for (const plan of coworkPlans) {
    PLAN_CAPACITY[`cowork-${plan.name.toLowerCase()}`] = plan.totalSpots;
}
for (const plan of coworkStudioPlans) {
    PLAN_CAPACITY[`coworkstudio-${plan.name.toLowerCase()}`] = plan.totalSpots;
}

interface AvailabilityCheck {
    loading: boolean;
    available: number | null; // null = not checked, number = available spots
    total: number;
}

export function CoworkReservationFormModal({ open, onClose, onSave, editingReservation }: CoworkReservationFormModalProps) {
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [availability, setAvailability] = useState<AvailabilityCheck>({ loading: false, available: null, total: 0 });

    const [form, setForm] = useState<CoworkReservationInsert>({
        plan_id: '',
        plan_type: 'cowork',
        period: 'diaria',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
        client: '',
        contact: '',
        spots: 1,
        notes: '',
        status: 'active',
        total_price: 0,
    });

    useEffect(() => {
        if (editingReservation) {
            setForm({
                plan_id: editingReservation.plan_id,
                plan_type: editingReservation.plan_type,
                period: editingReservation.period,
                start_date: editingReservation.start_date,
                end_date: editingReservation.end_date,
                client: editingReservation.client,
                contact: editingReservation.contact || '',
                spots: editingReservation.spots,
                notes: editingReservation.notes || '',
                status: editingReservation.status,
                total_price: editingReservation.total_price || 0,
            });
        } else {
            setForm({
                plan_id: '',
                plan_type: 'cowork',
                period: 'diaria',
                start_date: new Date().toISOString().split('T')[0],
                end_date: new Date().toISOString().split('T')[0],
                client: '',
                contact: '',
                spots: 1,
                notes: '',
                status: 'active',
                total_price: 0,
            });
        }
        setError(null);
        setAvailability({ loading: false, available: null, total: 0 });
    }, [editingReservation, open]);

    // Check availability when plan + dates change
    const checkAvailability = useCallback(async () => {
        if (!form.plan_id || !form.start_date) {
            setAvailability({ loading: false, available: null, total: 0 });
            return;
        }

        const total = PLAN_CAPACITY[form.plan_id] || 0;
        if (total === 0) {
            setAvailability({ loading: false, available: null, total: 0 });
            return;
        }

        setAvailability(prev => ({ ...prev, loading: true }));

        try {
            const res = await fetch(`/api/rental/availability?date=${form.start_date}`);
            if (!res.ok) throw new Error('fetch failed');
            const data = await res.json();
            const coworkData = data.cowork?.[form.plan_id];
            const occupied = coworkData?.spotsOccupied || 0;
            setAvailability({ loading: false, available: total - occupied, total });
        } catch {
            setAvailability({ loading: false, available: null, total });
        }
    }, [form.plan_id, form.start_date]);

    useEffect(() => {
        const timer = setTimeout(checkAvailability, 400);
        return () => clearTimeout(timer);
    }, [checkAvailability]);

    const handlePlanSelect = (id: string) => {
        const plan = coworkPlansList.find(p => p.id === id);
        if (plan) {
            setForm(f => ({ ...f, plan_id: plan.id, plan_type: plan.type }));
        } else {
            setForm(f => ({ ...f, plan_id: '' }));
        }
    };

    const spotsExceedCapacity = availability.available !== null && (form.spots || 1) > availability.available;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (spotsExceedCapacity) {
            setError(`Apenas ${availability.available} lugar(es) disponíveis. Reduza o número de lugares.`);
            return;
        }

        setSaving(true);
        setError(null);

        try {
            const url = editingReservation
                ? `/api/restricted/cowork-reservations/${editingReservation.id}`
                : '/api/restricted/cowork-reservations';

            const method = editingReservation ? 'PATCH' : 'POST';

            // Convert empty contact/notes to null to match DB
            const payload = {
                ...form,
                contact: form.contact || null,
                notes: form.notes || null,
                total_price: form.total_price ? parseFloat(form.total_price.toString()) : null,
            };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Erro ao guardar');
            }

            onSave();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
        } finally {
            setSaving(false);
        }
    };

    if (!open) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="relative bg-[#12121a] border border-white/[0.08] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="sticky top-0 z-10 bg-[#12121a]/95 backdrop-blur border-b border-white/[0.06] px-6 py-4 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-white">
                            {editingReservation ? 'Editar Reserva de Cowork' : 'Nova Reserva de Cowork'}
                        </h3>
                        <button onClick={onClose} className="text-white/40 hover:text-white transition">
                            <X size={18} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {/* Plan & Period */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[11px] tracking-[0.15em] uppercase text-white/40 mb-2">Plano de Cowork</label>
                                <select
                                    value={form.plan_id}
                                    onChange={(e) => handlePlanSelect(e.target.value)}
                                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/40 transition appearance-none"
                                    required
                                >
                                    <option value="" className="bg-[#12121a]">Selecionar plano...</option>
                                    <optgroup label="Apenas Cowork" className="bg-[#12121a]">
                                        {coworkPlansList.filter(p => p.type === 'cowork').map(p => (
                                            <option key={p.id} value={p.id} className="bg-[#12121a]">{p.name}</option>
                                        ))}
                                    </optgroup>
                                    <optgroup label="Cowork + Estúdio" className="bg-[#12121a]">
                                        {coworkPlansList.filter(p => p.type === 'cowork-studio').map(p => (
                                            <option key={p.id} value={p.id} className="bg-[#12121a]">{p.name}</option>
                                        ))}
                                    </optgroup>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[11px] tracking-[0.15em] uppercase text-white/40 mb-2">Período</label>
                                <select
                                    value={form.period}
                                    onChange={(e) => setForm(f => ({ ...f, period: e.target.value as CoworkReservationInsert['period'] }))}
                                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/40 transition appearance-none"
                                    required
                                >
                                    <option value="diaria" className="bg-[#12121a]">Diária (1 dia)</option>
                                    <option value="semanal" className="bg-[#12121a]">Semanal</option>
                                    <option value="mensal" className="bg-[#12121a]">Mensal</option>
                                </select>
                            </div>
                        </div>

                        {/* Availability indicator */}
                        {form.plan_id && (
                            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
                                availability.loading
                                    ? 'bg-white/[0.03] border border-white/[0.06] text-white/40'
                                    : spotsExceedCapacity
                                        ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                                        : availability.available !== null
                                            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                                            : 'bg-white/[0.03] border border-white/[0.06] text-white/40'
                            }`}>
                                {availability.loading ? (
                                    <>
                                        <Loader2 size={14} className="animate-spin" />
                                        <span>A verificar disponibilidade...</span>
                                    </>
                                ) : availability.available !== null ? (
                                    <>
                                        <Users size={14} />
                                        <span>
                                            {spotsExceedCapacity
                                                ? `Sem vagas suficientes (${availability.available}/${availability.total} disponíveis)`
                                                : `${availability.available}/${availability.total} lugares disponíveis`
                                            }
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <Users size={14} />
                                        <span>Capacidade total: {PLAN_CAPACITY[form.plan_id] || '?'} lugares</span>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-4 border-t border-white/[0.04] pt-4">
                            <div>
                                <label className="block text-[10px] text-white/30 mb-1 flex items-center gap-1.5 uppercase tracking-widest">
                                    <CalendarRange size={12} /> Data Início
                                </label>
                                <input
                                    type="date"
                                    value={form.start_date}
                                    onChange={(e) => setForm(f => ({ ...f, start_date: e.target.value }))}
                                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/40 transition [color-scheme:dark]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] text-white/30 mb-1 flex items-center gap-1.5 uppercase tracking-widest">
                                    <CalendarRange size={12} /> Data Fim
                                </label>
                                <input
                                    type="date"
                                    value={form.end_date}
                                    onChange={(e) => setForm(f => ({ ...f, end_date: e.target.value }))}
                                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/40 transition [color-scheme:dark]"
                                    required
                                />
                            </div>
                        </div>

                        {/* Client details */}
                        <div className="grid grid-cols-2 gap-4 border-t border-white/[0.04] pt-4">
                            <div>
                                <label className="block text-[11px] tracking-[0.15em] uppercase text-white/40 mb-2">Cliente</label>
                                <input
                                    type="text"
                                    value={form.client}
                                    onChange={(e) => setForm(f => ({ ...f, client: e.target.value }))}
                                    placeholder="Nome do cliente"
                                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/40 transition"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] tracking-[0.15em] uppercase text-white/40 mb-2">Contacto</label>
                                <input
                                    type="text"
                                    value={form.contact || ''}
                                    onChange={(e) => setForm(f => ({ ...f, contact: e.target.value }))}
                                    placeholder="Telefone ou email"
                                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/40 transition"
                                />
                            </div>
                        </div>

                        {/* Financials & Capacity */}
                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-[11px] tracking-[0.15em] uppercase text-white/40 mb-2">Lugares</label>
                                <input
                                    type="number"
                                    min="1"
                                    max={availability.available !== null ? availability.available : undefined}
                                    value={form.spots}
                                    onChange={(e) => setForm(f => ({ ...f, spots: parseInt(e.target.value) || 1 }))}
                                    className={`w-full bg-white/[0.04] border rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none transition ${
                                        spotsExceedCapacity
                                            ? 'border-red-500/40 focus:border-red-500/60'
                                            : 'border-white/[0.08] focus:border-cyan-500/40'
                                    }`}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] tracking-[0.15em] uppercase text-white/40 mb-2">Preço Total (€)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={form.total_price == null || isNaN(Number(form.total_price)) ? '' : form.total_price}
                                    onChange={(e) => setForm(f => ({ ...f, total_price: parseFloat(e.target.value) }))}
                                    placeholder="0.00"
                                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/40 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] tracking-[0.15em] uppercase text-white/40 mb-2">Estado</label>
                                <select
                                    value={form.status}
                                    onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))}
                                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/40 transition appearance-none"
                                >
                                    <option value="active" className="bg-[#12121a]">Ativa</option>
                                    <option value="completed" className="bg-[#12121a]">Concluída</option>
                                    <option value="cancelled" className="bg-[#12121a]">Cancelada</option>
                                </select>
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-[11px] tracking-[0.15em] uppercase text-white/40 mb-2">Notas</label>
                            <textarea
                                value={form.notes || ''}
                                onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
                                placeholder="Requisitos especiais, horas do estúdio, faturação..."
                                rows={3}
                                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/40 transition resize-none"
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
                                <AlertTriangle size={16} />
                                {error}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 justify-end pt-2 border-t border-white/[0.04] mt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 text-sm text-white/50 hover:text-white/80 rounded-lg transition"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={saving || spotsExceedCapacity}
                                className="px-5 py-2.5 text-sm bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 rounded-lg transition disabled:opacity-50 flex items-center gap-2"
                            >
                                {saving ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                                        A guardar...
                                    </>
                                ) : (
                                    <>
                                        <Check size={16} />
                                        {editingReservation ? 'Atualizar' : 'Criar Reserva'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
