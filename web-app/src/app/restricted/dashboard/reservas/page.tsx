'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Search,
    Filter,
    X,
    Edit3,
    Trash2,
    Package,
    Video,
    Users,
    Check,
    AlertTriangle,
    CalendarRange,
    Clock,
    Download
} from 'lucide-react';
import type { Reservation, CoworkReservation } from '@/types/database';
import { gearItems, studios } from '@/data/rentalData';
import { AvailabilityCalendar } from '@/components/ui/AvailabilityCalendar';
import { StudioHourlyCalendar } from '@/components/ui/StudioHourlyCalendar';
import { SearchInput } from '@/components/ui/SearchInput';
import { exportToCSV } from '@/lib/export';
import { ReservationDetailsModal } from '@/components/ui/ReservationDetailsModal';
import { CoworkReservationFormModal } from '@/components/ui/CoworkReservationFormModal';

type TabType = 'gear' | 'studio' | 'cowork';

const allItems = [
    ...gearItems.map(g => ({ id: g.id, name: g.name, type: 'gear' as const, price: g.dailyPrice })),
    ...studios.map(s => ({
        id: s.id,
        name: s.name,
        type: 'studio' as const,
        price: s.tiers[0]?.price || 0,
    })),
];

function formatDate(d: string) {
    return new Date(d).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' });
}

const coworkPlanDisplayNames: Record<string, string> = {
    'cowork-starter': 'Starter',
    'cowork-prime': 'Prime',
    'cowork-premium': 'Premium',
    'coworkstudio-starter': 'Starter (Cowork+Estúdio)',
    'coworkstudio-prime': 'Prime (Cowork+Estúdio)',
    'coworkstudio-premium': 'Premium (Cowork+Estúdio)',
};

function getCoworkPlanName(planId: string): string {
    return coworkPlanDisplayNames[planId] || planId.replace(/-/g, ' ');
}

// ── Delete Confirm Modal ──
function DeleteModal({
    open,
    onClose,
    onConfirm,
    loading,
    itemName,
}: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
    itemName: string;
}) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-[#12121a] border border-white/[0.08] rounded-xl p-6 max-w-md w-full"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                        <AlertTriangle size={20} className="text-red-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-white">Eliminar Reserva</h3>
                        <p className="text-xs text-white/40">Esta ação não pode ser revertida</p>
                    </div>
                </div>
                <p className="text-sm text-white/60 mb-6">
                    Tem a certeza que deseja eliminar a reserva de <span className="text-white font-medium">{itemName}</span>?
                </p>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-white/50 hover:text-white/80 rounded-lg transition"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="px-4 py-2 text-sm bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 rounded-lg transition disabled:opacity-50"
                    >
                        {loading ? 'A eliminar...' : 'Eliminar'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

// ── Reservation Form Modal ──
function ReservationFormModal({
    open,
    onClose,
    onSave,
    editingReservation,
    activeTab,
}: {
    open: boolean;
    onClose: () => void;
    onSave: () => void;
    editingReservation: Reservation | null;
    activeTab?: TabType;
}) {
    const [form, setForm] = useState({
        item_id: '',
        item_name: '',
        item_type: 'gear' as 'gear' | 'studio',
        start_date: '',
        end_date: '',
        start_time: '',
        end_time: '',
        client: '',
        contact: '',
        notes: '',
        status: 'active' as string,
        total_price: '',
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [showStudioCalendar, setShowStudioCalendar] = useState(false);
    const [showAvailabilityCalendar, setShowAvailabilityCalendar] = useState(false);

    useEffect(() => {
        if (editingReservation) {
            setForm({
                item_id: editingReservation.item_id,
                item_name: editingReservation.item_name,
                item_type: editingReservation.item_type as 'gear' | 'studio',
                start_date: editingReservation.start_date,
                end_date: editingReservation.end_date,
                start_time: editingReservation.start_time || '',
                end_time: editingReservation.end_time || '',
                client: editingReservation.client,
                contact: editingReservation.contact || '',
                notes: editingReservation.notes || '',
                status: editingReservation.status,
                total_price: editingReservation.total_price?.toString() || '',
            });
        } else {
            setForm({
                item_id: '',
                item_name: '',
                item_type: activeTab === 'studio' ? 'studio' : 'gear',
                start_date: new Date().toISOString().split('T')[0],
                end_date: '',
                start_time: '',
                end_time: '',
                client: '',
                contact: '',
                notes: '',
                status: 'active',
                total_price: '',
            });
        }
        setError('');
        setShowStudioCalendar(false);
        setShowAvailabilityCalendar(false);
    }, [editingReservation, open]);

    const handleItemSelect = (itemId: string) => {
        const item = allItems.find(i => i.id === itemId);
        if (item) {
            setForm(f => ({ ...f, item_id: item.id, item_name: item.name, item_type: item.type }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const payload = {
                ...(editingReservation ? { id: editingReservation.id } : {}),
                item_id: form.item_id,
                item_name: form.item_name,
                item_type: form.item_type,
                start_date: form.start_date,
                end_date: form.end_date,
                start_time: form.start_time || null,
                end_time: form.end_time || null,
                client: form.client,
                contact: form.contact || null,
                notes: form.notes || null,
                status: form.status,
                total_price: form.total_price ? parseFloat(form.total_price) : null,
            };

            const res = await fetch('/api/restricted/reservations', {
                method: editingReservation ? 'PUT' : 'POST',
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative bg-[#12121a] border border-white/[0.08] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="sticky top-0 z-10 bg-[#12121a] border-b border-white/[0.06] px-6 py-4 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white">
                        {editingReservation ? 'Editar Reserva' : 'Nova Reserva'}
                    </h3>
                    <button onClick={onClose} className="text-white/40 hover:text-white transition">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Item Selector */}
                    <div>
                        <label className="block text-[11px] tracking-[0.15em] uppercase text-white/40 mb-2">Item</label>
                        <select
                            value={form.item_id}
                            onChange={(e) => handleItemSelect(e.target.value)}
                            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/40 transition appearance-none"
                            required
                        >
                            <option value="" className="bg-[#12121a]">Selecionar item...</option>
                            {(!activeTab || activeTab === 'gear') && (
                                <optgroup label="Equipamento" className="bg-[#12121a]">
                                    {allItems.filter(i => i.type === 'gear').map(i => (
                                        <option key={i.id} value={i.id} className="bg-[#12121a]">{i.name} — {i.price}€/dia</option>
                                    ))}
                                </optgroup>
                            )}
                            {(!activeTab || activeTab === 'studio') && (
                                <optgroup label="Estúdios" className="bg-[#12121a]">
                                    {allItems.filter(i => i.type === 'studio').map(i => (
                                        <option key={i.id} value={i.id} className="bg-[#12121a]">{i.name} — {i.price}€/h</option>
                                    ))}
                                </optgroup>
                            )}
                        </select>
                    </div>

                    {/* Schedule */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="block text-[11px] tracking-[0.15em] uppercase text-white/40">Horário</label>
                            <button
                                type="button"
                                onClick={() => form.item_type === 'studio' ? setShowStudioCalendar(true) : setShowAvailabilityCalendar(true)}
                                disabled={!form.item_id}
                                className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 disabled:opacity-50 disabled:hover:text-cyan-400 transition"
                            >
                                {form.item_type === 'studio' ? <Clock size={14} /> : <CalendarRange size={14} />}
                                Ver Disponibilidade
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] text-white/30 mb-1">Data Início</label>
                                <input
                                    type="date"
                                    value={form.start_date}
                                    onChange={(e) => setForm(f => ({ ...f, start_date: e.target.value }))}
                                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/40 transition [color-scheme:dark]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] text-white/30 mb-1">Data Fim</label>
                                <input
                                    type="date"
                                    value={form.end_date}
                                    onChange={(e) => setForm(f => ({ ...f, end_date: e.target.value }))}
                                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/40 transition [color-scheme:dark]"
                                    required
                                />
                            </div>
                        </div>
                        {form.item_type === 'studio' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] text-white/30 mb-1">Hora Início</label>
                                    <input
                                        type="time"
                                        value={form.start_time}
                                        onChange={(e) => setForm(f => ({ ...f, start_time: e.target.value }))}
                                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/40 transition [color-scheme:dark]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-white/30 mb-1">Hora Fim</label>
                                    <input
                                        type="time"
                                        value={form.end_time}
                                        onChange={(e) => setForm(f => ({ ...f, end_time: e.target.value }))}
                                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/40 transition [color-scheme:dark]"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Client + Contact */}
                    <div className="grid grid-cols-2 gap-4">
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
                                value={form.contact}
                                onChange={(e) => setForm(f => ({ ...f, contact: e.target.value }))}
                                placeholder="Telefone ou email"
                                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/40 transition"
                            />
                        </div>
                    </div>

                    {/* Price + Status */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[11px] tracking-[0.15em] uppercase text-white/40 mb-2">Preço Total (€)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={form.total_price}
                                onChange={(e) => setForm(f => ({ ...f, total_price: e.target.value }))}
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
                            value={form.notes}
                            onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
                            placeholder="Observações adicionais..."
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
                    <div className="flex gap-3 justify-end pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm text-white/50 hover:text-white/80 rounded-lg transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
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

                {/* Modals for Calendars */}
                {showStudioCalendar && (
                    <div className="relative z-[60]">
                        <StudioHourlyCalendar
                            studioId={form.item_id}
                            studioName={form.item_name}
                            onSlotSelect={(date, hour) => {
                                // Parse hour to add 1 hour for end time
                                const startH = parseInt(hour.split(':')[0], 10);
                                const startM = hour.split(':')[1];
                                const endHStr = String(startH + 1).padStart(2, '0');
                                const endHour = `${endHStr}:${startM}`;
                                
                                setForm(f => ({ ...f, start_date: date, end_date: date, start_time: hour, end_time: endHour }));
                                setShowStudioCalendar(false);
                            }}
                            onClose={() => setShowStudioCalendar(false)}
                        />
                    </div>
                )}
                
                {showAvailabilityCalendar && (
                    <div className="relative z-[60]">
                        <AvailabilityCalendar
                            itemId={form.item_id}
                            itemType={form.item_type as 'item' | 'plan'}
                            selectedDate={form.start_date || null}
                            onSelect={(date) => {
                                setForm(f => ({ ...f, start_date: date, end_date: date }));
                                setShowAvailabilityCalendar(false);
                            }}
                            onClose={() => setShowAvailabilityCalendar(false)}
                        />
                    </div>
                )}
            </motion.div>
        </div>
    );
}

// ── Main Page ──
export default function ReservasPage() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [coworkReservations, setCoworkReservations] = useState<CoworkReservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>('gear');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    
    // Modals state
    const [showGearStudioForm, setShowGearStudioForm] = useState(false);
    const [editingGearStudioRes, setEditingGearStudioRes] = useState<Reservation | null>(null);
    
    const [showCoworkForm, setShowCoworkForm] = useState(false);
    const [editingCoworkRes, setEditingCoworkRes] = useState<CoworkReservation | null>(null);
    
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedRes, setSelectedRes] = useState<Reservation | CoworkReservation | null>(null);
    
    const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string; type: 'gear-studio' | 'cowork' } | null>(null);
    const [deleting, setDeleting] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const [resData, coworkData] = await Promise.all([
                fetch('/api/restricted/reservations').then(r => r.json()),
                fetch('/api/restricted/cowork-reservations').then(r => r.json()),
            ]);
            setReservations(Array.isArray(resData) ? resData : []);
            setCoworkReservations(Array.isArray(coworkData) ? coworkData : []);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            const endpoint = deleteTarget.type === 'gear-studio'
                ? `/api/restricted/reservations?id=${deleteTarget.id}`
                : `/api/restricted/cowork-reservations?id=${deleteTarget.id}`;
            await fetch(endpoint, { method: 'DELETE' });
            await fetchData();
            setDeleteTarget(null);
        } catch (err) {
            console.error('Delete error:', err);
        } finally {
            setDeleting(false);
        }
    };

    const filteredGear = reservations.filter(r => {
        if (r.item_type !== 'gear') return false;
        if (statusFilter !== 'all' && r.status !== statusFilter) return false;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            return r.item_name.toLowerCase().includes(q) || r.client.toLowerCase().includes(q) || r.id.toLowerCase().includes(q);
        }
        return true;
    });

    const filteredStudio = reservations.filter(r => {
        if (r.item_type !== 'studio') return false;
        if (statusFilter !== 'all' && r.status !== statusFilter) return false;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            return r.item_name.toLowerCase().includes(q) || r.client.toLowerCase().includes(q) || r.id.toLowerCase().includes(q);
        }
        return true;
    });

    const filteredCowork = coworkReservations.filter(r => {
        if (statusFilter !== 'all' && r.status !== statusFilter) return false;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            return r.plan_id.toLowerCase().includes(q) || r.client.toLowerCase().includes(q) || r.id.toLowerCase().includes(q);
        }
        return true;
    });

    const handleExportCSV = () => {
        const dataToExport = activeTab === 'gear' ? filteredGear : 
                             activeTab === 'studio' ? filteredStudio : 
                             filteredCowork;
        exportToCSV(dataToExport, `reservas_${activeTab}`);
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-12 bg-white/[0.02] rounded-xl animate-pulse" />
                <div className="h-[500px] bg-white/[0.02] rounded-xl animate-pulse" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Reservas</h1>
                    <p className="text-sm text-white/40 mt-1">
                        Gerir todos os alugueres de equipamento, estúdios e cowork
                    </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <button
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 px-4 py-2.5 text-white/50 hover:text-white border border-white/10 hover:bg-white/5 rounded-lg text-sm font-medium transition-all duration-200"
                    >
                        <Download size={16} />
                        Exportar CSV
                    </button>
                    <button
                        onClick={() => {
                            if (activeTab === 'cowork') {
                                setEditingCoworkRes(null);
                                setShowCoworkForm(true);
                            } else {
                                setEditingGearStudioRes(null);
                                setShowGearStudioForm(true);
                            }
                        }}
                        className="flex items-center gap-2 px-4 py-2.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 rounded-lg text-sm font-medium transition-all duration-200"
                    >
                        <Plus size={16} />
                        Nova Reserva
                    </button>
                </div>
            </div>

            {/* Tabs & Filters Line */}
            <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center bg-white/[0.02] border border-white/[0.06] rounded-xl p-3">
                {/* Tabs */}
                <div className="flex flex-wrap gap-1 bg-black/20 rounded-lg p-1 w-full xl:w-auto">
                    {([
                        { id: 'gear' as TabType, label: 'Equipamento', icon: Package },
                        { id: 'studio' as TabType, label: 'Estúdios', icon: Video },
                        { id: 'cowork' as TabType, label: 'Coworking', icon: Users },
                    ]).map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 xl:flex-none items-center justify-center gap-2 px-4 py-2 rounded-md text-sm transition-all duration-200 flex ${activeTab === tab.id
                                    ? 'bg-cyan-500/10 text-cyan-400 font-medium'
                                    : 'text-white/40 hover:text-white/60'
                                }`}
                        >
                            <tab.icon size={14} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
                    <div className="w-full sm:w-64">
                        <SearchInput 
                            value={searchQuery} 
                            onChange={setSearchQuery} 
                            placeholder="Buscar por nome, ref ou telemóvel..." 
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Filter size={14} className="text-white/30 hidden sm:block" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full sm:w-auto bg-[#1A1A24] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition appearance-none"
                        >
                            <option value="all" className="bg-[#12121a]">Todos os estados</option>
                            <option value="active" className="bg-[#12121a]">Ativas</option>
                            <option value="completed" className="bg-[#12121a]">Concluídas</option>
                            <option value="cancelled" className="bg-[#12121a]">Canceladas</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden">
                <div className="overflow-x-auto min-h-[400px]">
                    {activeTab === 'gear' || activeTab === 'studio' ? (
                        <>
                            {/* Mobile View */}
                            <div className="md:hidden flex flex-col gap-3 p-3">
                                {(activeTab === 'gear' ? filteredGear : filteredStudio).length === 0 ? (
                                    <div className="text-center py-8 text-white/20 text-sm">
                                        Nenhuma reserva de {activeTab === 'gear' ? 'equipamento' : 'estúdio'} encontrada
                                    </div>
                                ) : (
                                    (activeTab === 'gear' ? filteredGear : filteredStudio).map((r, i) => (
                                        <motion.div
                                            key={r.id}
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.03 }}
                                            onClick={() => { setSelectedRes(r); setShowDetailsModal(true); }}
                                            className="bg-[#12121a] border border-white/[0.06] rounded-xl p-4 flex flex-col gap-3 cursor-pointer active:scale-95 transition-all"
                                        >
                                            <div className="flex justify-between items-start gap-3">
                                                <div className="flex items-center gap-2">
                                                    {r.item_type === 'gear' ? (
                                                        <Package size={14} className="text-cyan-400/80 shrink-0" />
                                                    ) : (
                                                        <Video size={14} className="text-violet-400/80 shrink-0" />
                                                    )}
                                                    <span className="text-sm font-semibold text-white/90 leading-tight">{r.item_name}</span>
                                                </div>
                                                <span className={`shrink-0 text-[10px] font-medium uppercase tracking-wider px-2 py-1 rounded-full ${r.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                                                        r.status === 'completed' ? 'bg-cyan-500/10 text-cyan-400' :
                                                            'bg-red-500/10 text-red-400'
                                                    }`}>
                                                    {r.status === 'active' ? 'Ativa' : r.status === 'completed' ? 'Concluída' : 'Cancelada'}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-white/60">{r.client}</span>
                                                <span className="text-emerald-400/80 font-medium">
                                                    {r.total_price ? `${r.total_price.toFixed(2)}€` : '—'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-white/40 bg-white/5 rounded-lg px-3 py-2">
                                                <CalendarRange size={13} />
                                                <div className="flex flex-col">
                                                    <span>{formatDate(r.start_date)} {r.start_time && `- ${r.start_time}`}</span>
                                                    {r.start_date !== r.end_date && <span>{formatDate(r.end_date)} {r.end_time && `- ${r.end_time}`}</span>}
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center pt-2 border-t border-white/[0.04]">
                                                <span className="text-xs font-mono text-white/30">#{r.id.split('-')[0].toUpperCase()}</span>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setEditingGearStudioRes(r); setShowGearStudioForm(true); }}
                                                        className="p-1.5 text-white/30 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-md transition"
                                                    >
                                                        <Edit3 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setDeleteTarget({ id: r.id, name: r.item_name, type: 'gear-studio' }); }}
                                                        className="p-1.5 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-md transition"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>

                            {/* Desktop View */}
                            <table className="w-full text-left whitespace-nowrap hidden md:table">
                            <thead>
                                <tr className="border-b border-white/[0.06] bg-black/40">
                                    <th className="text-[10px] tracking-[0.15em] uppercase text-white/30 font-medium px-5 py-4">Ref</th>
                                    <th className="text-[10px] tracking-[0.15em] uppercase text-white/30 font-medium px-5 py-4">Item</th>
                                    <th className="text-[10px] tracking-[0.15em] uppercase text-white/30 font-medium px-5 py-4">Cliente</th>
                                    <th className="text-[10px] tracking-[0.15em] uppercase text-white/30 font-medium px-5 py-4">Datas</th>
                                    <th className="text-[10px] tracking-[0.15em] uppercase text-white/30 font-medium px-5 py-4">Valor</th>
                                    <th className="text-[10px] tracking-[0.15em] uppercase text-white/30 font-medium px-5 py-4">Estado</th>
                                    <th className="text-[10px] tracking-[0.15em] uppercase text-white/30 font-medium px-5 py-4 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(activeTab === 'gear' ? filteredGear : filteredStudio).length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-12 text-white/20 text-sm">
                                            Nenhuma reserva de {activeTab === 'gear' ? 'equipamento' : 'estúdio'} encontrada
                                        </td>
                                    </tr>
                                ) : (
                                    (activeTab === 'gear' ? filteredGear : filteredStudio).map((r, i) => (
                                        <motion.tr
                                            key={r.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: i * 0.03 }}
                                            className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group cursor-pointer"
                                            onClick={() => { setSelectedRes(r); setShowDetailsModal(true); }}
                                        >
                                            <td className="px-5 py-4 text-xs font-mono text-white/30">
                                                #{r.id.split('-')[0].toUpperCase()}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    {r.item_type === 'gear' ? (
                                                        <Package size={14} className="text-cyan-400/50" />
                                                    ) : (
                                                        <Video size={14} className="text-violet-400/50" />
                                                    )}
                                                    <span className="text-sm text-white/80 font-medium">{r.item_name}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-white/60">{r.client}</td>
                                            <td className="px-5 py-4 text-xs text-white/40">
                                                <div>{formatDate(r.start_date)} {r.start_time && `- ${r.start_time}`}</div>
                                                {r.start_date !== r.end_date && <div>{formatDate(r.end_date)} {r.end_time && `- ${r.end_time}`}</div>}
                                            </td>
                                            <td className="px-5 py-4 text-sm text-emerald-400/80 font-medium">
                                                {r.total_price ? `${r.total_price.toFixed(2)}€` : '—'}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`text-[10px] font-medium uppercase tracking-wider px-2 py-1 rounded-full ${r.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                                                        r.status === 'completed' ? 'bg-cyan-500/10 text-cyan-400' :
                                                            'bg-red-500/10 text-red-400'
                                                    }`}>
                                                    {r.status === 'active' ? 'Ativa' : r.status === 'completed' ? 'Concluída' : 'Cancelada'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setEditingGearStudioRes(r); setShowGearStudioForm(true); }}
                                                        className="p-2 text-white/30 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition"
                                                    >
                                                        <Edit3 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setDeleteTarget({ id: r.id, name: r.item_name, type: 'gear-studio' }); }}
                                                        className="p-2 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        </>
                    ) : (
                        <>
                            {/* Mobile View */}
                            <div className="md:hidden flex flex-col gap-3 p-3">
                                {filteredCowork.length === 0 ? (
                                    <div className="text-center py-8 text-white/20 text-sm">
                                        Nenhuma reserva cowork encontrada
                                    </div>
                                ) : (
                                    filteredCowork.map((r, i) => (
                                        <motion.div
                                            key={r.id}
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.03 }}
                                            onClick={() => { setSelectedRes(r); setShowDetailsModal(true); }}
                                            className="bg-[#12121a] border border-white/[0.06] rounded-xl p-4 flex flex-col gap-3 cursor-pointer active:scale-95 transition-all"
                                        >
                                            <div className="flex justify-between items-start gap-3">
                                                <div className="flex items-center gap-2">
                                                    <Users size={14} className="text-amber-400/60 shrink-0" />
                                                    <span className="text-sm font-semibold text-white/90 leading-tight">{getCoworkPlanName(r.plan_id)}</span>
                                                </div>
                                                <span className={`shrink-0 text-[10px] font-medium uppercase tracking-wider px-2 py-1 rounded-full ${r.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                                                        r.status === 'completed' ? 'bg-cyan-500/10 text-cyan-400' :
                                                            'bg-red-500/10 text-red-400'
                                                    }`}>
                                                    {r.status === 'active' ? 'Ativa' : r.status === 'completed' ? 'Concluída' : 'Cancelada'}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-white/60">{r.client}</span>
                                                <span className="text-emerald-400/80 font-medium">
                                                    {r.total_price ? `${r.total_price.toFixed(2)}€` : '—'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-white/40 bg-white/5 rounded-lg px-3 py-2">
                                                <div className="flex items-center gap-2">
                                                    <CalendarRange size={13} />
                                                    <div className="flex flex-col">
                                                        <span className="capitalize">{r.period}</span>
                                                        <span className="text-[10px] opacity-70">{formatDate(r.start_date)} → {formatDate(r.end_date)}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1.5 ml-auto">
                                                    <Users size={12} className="opacity-50" />
                                                    <span>{r.spots}</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center pt-2 border-t border-white/[0.04]">
                                                <span className="text-xs font-mono text-white/30">#{r.id.split('-')[0].toUpperCase()}</span>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setEditingCoworkRes(r); setShowCoworkForm(true); }}
                                                        className="p-1.5 text-white/30 hover:text-amber-400 hover:bg-amber-500/10 rounded-md transition"
                                                    >
                                                        <Edit3 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setDeleteTarget({ id: r.id, name: `Cowork ${getCoworkPlanName(r.plan_id)}`, type: 'cowork' }); }}
                                                        className="p-1.5 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-md transition"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>

                            {/* Desktop View */}
                            <table className="w-full text-left whitespace-nowrap hidden md:table">
                            <thead>
                                <tr className="border-b border-white/[0.06] bg-black/40">
                                    <th className="text-[10px] tracking-[0.15em] uppercase text-white/30 font-medium px-5 py-4">Ref</th>
                                    <th className="text-[10px] tracking-[0.15em] uppercase text-white/30 font-medium px-5 py-4">Plano</th>
                                    <th className="text-[10px] tracking-[0.15em] uppercase text-white/30 font-medium px-5 py-4">Cliente</th>
                                    <th className="text-[10px] tracking-[0.15em] uppercase text-white/30 font-medium px-5 py-4">Período</th>
                                    <th className="text-[10px] tracking-[0.15em] uppercase text-white/30 font-medium px-5 py-4">Lugares</th>
                                    <th className="text-[10px] tracking-[0.15em] uppercase text-white/30 font-medium px-5 py-4">Valor</th>
                                    <th className="text-[10px] tracking-[0.15em] uppercase text-white/30 font-medium px-5 py-4">Estado</th>
                                    <th className="text-[10px] tracking-[0.15em] uppercase text-white/30 font-medium px-5 py-4 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCowork.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="text-center py-12 text-white/20 text-sm">
                                            Nenhuma reserva cowork encontrada
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCowork.map((r, i) => (
                                        <motion.tr
                                            key={r.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: i * 0.03 }}
                                            className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group cursor-pointer"
                                            onClick={() => { setSelectedRes(r); setShowDetailsModal(true); }}
                                        >
                                            <td className="px-5 py-4 text-xs font-mono text-white/30">
                                                #{r.id.split('-')[0].toUpperCase()}
                                            </td>
                                            <td className="px-5 py-4 text-sm text-white/80 font-medium capitalize flex items-center gap-2">
                                                <Users size={14} className="text-amber-400/60" />
                                                {getCoworkPlanName(r.plan_id)}
                                            </td>
                                            <td className="px-5 py-4 text-sm text-white/60">{r.client}</td>
                                            <td className="px-5 py-4 text-xs text-white/40">
                                                <div><span className="capitalize">{r.period}</span></div>
                                                <div className="opacity-70 mt-0.5">{formatDate(r.start_date)} → {formatDate(r.end_date)}</div>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-white/60">{r.spots}</td>
                                            <td className="px-5 py-4 text-sm text-emerald-400/80 font-medium">
                                                {r.total_price ? `${r.total_price.toFixed(2)}€` : '—'}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`text-[10px] font-medium uppercase tracking-wider px-2 py-1 rounded-full ${r.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                                                        r.status === 'completed' ? 'bg-cyan-500/10 text-cyan-400' :
                                                            'bg-red-500/10 text-red-400'
                                                    }`}>
                                                    {r.status === 'active' ? 'Ativa' : r.status === 'completed' ? 'Concluída' : 'Cancelada'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setEditingCoworkRes(r); setShowCoworkForm(true); }}
                                                        className="p-2 text-white/30 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition"
                                                    >
                                                        <Edit3 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setDeleteTarget({ id: r.id, name: `Cowork ${getCoworkPlanName(r.plan_id)}`, type: 'cowork' }); }}
                                                        className="p-2 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        </>
                    )}
                </div>
            </div>

            {/* Modals */}
            <ReservationFormModal
                open={showGearStudioForm}
                onClose={() => { setShowGearStudioForm(false); setEditingGearStudioRes(null); }}
                onSave={fetchData}
                editingReservation={editingGearStudioRes}
                activeTab={activeTab}
            />

            <CoworkReservationFormModal
                open={showCoworkForm}
                onClose={() => { setShowCoworkForm(false); setEditingCoworkRes(null); }}
                onSave={fetchData}
                editingReservation={editingCoworkRes}
            />

            <ReservationDetailsModal
                open={showDetailsModal}
                onClose={() => setShowDetailsModal(false)}
                reservation={selectedRes}
            />

            <AnimatePresence>
                {deleteTarget && (
                    <DeleteModal
                        open={!!deleteTarget}
                        onClose={() => setDeleteTarget(null)}
                        onConfirm={handleDelete}
                        loading={deleting}
                        itemName={deleteTarget.name}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
