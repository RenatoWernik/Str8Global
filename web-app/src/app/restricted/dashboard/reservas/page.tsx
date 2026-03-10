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
} from 'lucide-react';
import type { Reservation, CoworkReservation } from '@/types/database';
import { gearItems, studios } from '@/data/rentalData';

type TabType = 'gear-studio' | 'cowork';

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
}: {
    open: boolean;
    onClose: () => void;
    onSave: () => void;
    editingReservation: Reservation | null;
}) {
    const [form, setForm] = useState({
        item_id: '',
        item_name: '',
        item_type: 'gear' as 'gear' | 'studio',
        start_date: '',
        end_date: '',
        client: '',
        contact: '',
        notes: '',
        status: 'active' as string,
        total_price: '',
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (editingReservation) {
            setForm({
                item_id: editingReservation.item_id,
                item_name: editingReservation.item_name,
                item_type: editingReservation.item_type as 'gear' | 'studio',
                start_date: editingReservation.start_date,
                end_date: editingReservation.end_date,
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
                item_type: 'gear',
                start_date: new Date().toISOString().split('T')[0],
                end_date: '',
                client: '',
                contact: '',
                notes: '',
                status: 'active',
                total_price: '',
            });
        }
        setError('');
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
                            <optgroup label="Equipamento" className="bg-[#12121a]">
                                {allItems.filter(i => i.type === 'gear').map(i => (
                                    <option key={i.id} value={i.id} className="bg-[#12121a]">{i.name} — {i.price}€/dia</option>
                                ))}
                            </optgroup>
                            <optgroup label="Estúdios" className="bg-[#12121a]">
                                {allItems.filter(i => i.type === 'studio').map(i => (
                                    <option key={i.id} value={i.id} className="bg-[#12121a]">{i.name} — {i.price}€/h</option>
                                ))}
                            </optgroup>
                        </select>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[11px] tracking-[0.15em] uppercase text-white/40 mb-2">Data Início</label>
                            <input
                                type="date"
                                value={form.start_date}
                                onChange={(e) => setForm(f => ({ ...f, start_date: e.target.value }))}
                                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/40 transition [color-scheme:dark]"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] tracking-[0.15em] uppercase text-white/40 mb-2">Data Fim</label>
                            <input
                                type="date"
                                value={form.end_date}
                                onChange={(e) => setForm(f => ({ ...f, end_date: e.target.value }))}
                                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/40 transition [color-scheme:dark]"
                                required
                            />
                        </div>
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
            </motion.div>
        </div>
    );
}

// ── Main Page ──
export default function ReservasPage() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [coworkReservations, setCoworkReservations] = useState<CoworkReservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>('gear-studio');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [showForm, setShowForm] = useState(false);
    const [editingRes, setEditingRes] = useState<Reservation | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string; type: TabType } | null>(null);
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

    const filteredReservations = reservations.filter(r => {
        if (statusFilter !== 'all' && r.status !== statusFilter) return false;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            return r.item_name.toLowerCase().includes(q) || r.client.toLowerCase().includes(q);
        }
        return true;
    });

    const filteredCowork = coworkReservations.filter(r => {
        if (statusFilter !== 'all' && r.status !== statusFilter) return false;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            return r.plan_id.toLowerCase().includes(q) || r.client.toLowerCase().includes(q);
        }
        return true;
    });

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
                <button
                    onClick={() => { setEditingRes(null); setShowForm(true); }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 rounded-lg text-sm font-medium transition-all duration-200 shrink-0"
                >
                    <Plus size={16} />
                    Nova Reserva
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-white/[0.02] border border-white/[0.06] rounded-lg p-1 w-fit">
                {([
                    { id: 'gear-studio' as TabType, label: 'Equipamento & Estúdios', icon: Package },
                    { id: 'cowork' as TabType, label: 'Cowork', icon: Users },
                ]).map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-all duration-200 ${activeTab === tab.id
                                ? 'bg-cyan-500/10 text-cyan-400'
                                : 'text-white/40 hover:text-white/60'
                            }`}
                    >
                        <tab.icon size={14} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Procurar por item ou cliente..."
                        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/30 transition"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter size={14} className="text-white/30" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/30 transition appearance-none"
                    >
                        <option value="all" className="bg-[#12121a]">Todos os estados</option>
                        <option value="active" className="bg-[#12121a]">Ativas</option>
                        <option value="completed" className="bg-[#12121a]">Concluídas</option>
                        <option value="cancelled" className="bg-[#12121a]">Canceladas</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    {activeTab === 'gear-studio' ? (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/[0.06]">
                                    <th className="text-left text-[10px] tracking-[0.15em] uppercase text-white/30 font-medium px-5 py-3">Item</th>
                                    <th className="text-left text-[10px] tracking-[0.15em] uppercase text-white/30 font-medium px-5 py-3">Tipo</th>
                                    <th className="text-left text-[10px] tracking-[0.15em] uppercase text-white/30 font-medium px-5 py-3">Cliente</th>
                                    <th className="text-left text-[10px] tracking-[0.15em] uppercase text-white/30 font-medium px-5 py-3">Período</th>
                                    <th className="text-left text-[10px] tracking-[0.15em] uppercase text-white/30 font-medium px-5 py-3">Valor</th>
                                    <th className="text-left text-[10px] tracking-[0.15em] uppercase text-white/30 font-medium px-5 py-3">Estado</th>
                                    <th className="text-right text-[10px] tracking-[0.15em] uppercase text-white/30 font-medium px-5 py-3">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReservations.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-12 text-white/20 text-sm">
                                            Nenhuma reserva encontrada
                                        </td>
                                    </tr>
                                ) : (
                                    filteredReservations.map((r, i) => (
                                        <motion.tr
                                            key={r.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: i * 0.03 }}
                                            className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                                        >
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-2">
                                                    {r.item_type === 'gear' ? (
                                                        <Package size={14} className="text-cyan-400/50" />
                                                    ) : (
                                                        <Video size={14} className="text-violet-400/50" />
                                                    )}
                                                    <span className="text-sm text-white/80 font-medium">{r.item_name}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className={`text-xs px-2 py-1 rounded-full ${r.item_type === 'gear' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-violet-500/10 text-violet-400'
                                                    }`}>
                                                    {r.item_type === 'gear' ? 'Equip.' : 'Estúdio'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-sm text-white/60">{r.client}</td>
                                            <td className="px-5 py-3 text-xs text-white/40">{formatDate(r.start_date)} → {formatDate(r.end_date)}</td>
                                            <td className="px-5 py-3 text-sm text-white/70 font-medium">
                                                {r.total_price ? `${r.total_price}€` : '—'}
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className={`text-[10px] font-medium uppercase tracking-wider px-2 py-1 rounded-full ${r.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                                                        r.status === 'completed' ? 'bg-white/5 text-white/30' :
                                                            'bg-red-500/10 text-red-400'
                                                    }`}>
                                                    {r.status === 'active' ? 'Ativa' : r.status === 'completed' ? 'Concluída' : 'Cancelada'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={() => { setEditingRes(r); setShowForm(true); }}
                                                        className="p-2 text-white/30 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition"
                                                    >
                                                        <Edit3 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteTarget({ id: r.id, name: r.item_name, type: 'gear-studio' })}
                                                        className="p-2 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/[0.06]">
                                    <th className="text-left text-[10px] tracking-[0.15em] uppercase text-white/30 font-medium px-5 py-3">Plano</th>
                                    <th className="text-left text-[10px] tracking-[0.15em] uppercase text-white/30 font-medium px-5 py-3">Tipo</th>
                                    <th className="text-left text-[10px] tracking-[0.15em] uppercase text-white/30 font-medium px-5 py-3">Cliente</th>
                                    <th className="text-left text-[10px] tracking-[0.15em] uppercase text-white/30 font-medium px-5 py-3">Período</th>
                                    <th className="text-left text-[10px] tracking-[0.15em] uppercase text-white/30 font-medium px-5 py-3">Lugares</th>
                                    <th className="text-left text-[10px] tracking-[0.15em] uppercase text-white/30 font-medium px-5 py-3">Estado</th>
                                    <th className="text-right text-[10px] tracking-[0.15em] uppercase text-white/30 font-medium px-5 py-3">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCowork.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-12 text-white/20 text-sm">
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
                                            className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                                        >
                                            <td className="px-5 py-3 text-sm text-white/80 font-medium capitalize">{r.plan_id}</td>
                                            <td className="px-5 py-3">
                                                <span className="text-xs px-2 py-1 rounded-full bg-amber-500/10 text-amber-400">
                                                    {r.plan_type === 'cowork' ? 'Cowork' : 'Cowork+Estúdio'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-sm text-white/60">{r.client}</td>
                                            <td className="px-5 py-3 text-xs text-white/40">{formatDate(r.start_date)} → {formatDate(r.end_date)}</td>
                                            <td className="px-5 py-3 text-sm text-white/60">{r.spots}</td>
                                            <td className="px-5 py-3">
                                                <span className={`text-[10px] font-medium uppercase tracking-wider px-2 py-1 rounded-full ${r.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                                                        r.status === 'completed' ? 'bg-white/5 text-white/30' :
                                                            'bg-red-500/10 text-red-400'
                                                    }`}>
                                                    {r.status === 'active' ? 'Ativa' : r.status === 'completed' ? 'Concluída' : 'Cancelada'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-right">
                                                <button
                                                    onClick={() => setDeleteTarget({ id: r.id, name: `Cowork ${r.plan_id}`, type: 'cowork' })}
                                                    className="p-2 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {showForm && (
                    <ReservationFormModal
                        open={showForm}
                        onClose={() => { setShowForm(false); setEditingRes(null); }}
                        onSave={fetchData}
                        editingReservation={editingRes}
                    />
                )}
            </AnimatePresence>

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
