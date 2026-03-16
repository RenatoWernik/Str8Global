'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, User, Phone, Package, Video, Users, AlignLeft, Hash, CreditCard } from 'lucide-react';
import type { Reservation, CoworkReservation } from '@/types/database';

interface ReservationDetailsModalProps {
    open: boolean;
    onClose: () => void;
    reservation: Reservation | CoworkReservation | null;
}

const statusColors = {
    active: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    completed: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
    cancelled: 'text-red-400 bg-red-400/10 border-red-400/20',
};

const statusLabels = {
    active: 'Ativa',
    completed: 'Concluída',
    cancelled: 'Cancelada',
};

export function ReservationDetailsModal({ open, onClose, reservation }: ReservationDetailsModalProps) {
    if (!open || !reservation) return null;

    const isGearOrStudio = 'item_type' in reservation;
    const itemType = isGearOrStudio ? (reservation as Reservation).item_type : 'cowork';
    
    // Generate a short ID from the UUID for easy visual identification
    const shortId = reservation.id.split('-')[0].toUpperCase();
    
    // Status visual
    const statusColor = statusColors[reservation.status as keyof typeof statusColors] || statusColors.active;
    const statusLabel = statusLabels[reservation.status as keyof typeof statusLabels] || 'Ativa';

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="relative bg-[#12121a] border border-white/[0.08] rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="sticky top-0 z-10 bg-[#12121a]/95 backdrop-blur border-b border-white/[0.06] px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                                itemType === 'gear' ? 'bg-cyan-500/10 text-cyan-400' :
                                itemType === 'studio' ? 'bg-violet-500/10 text-violet-400' :
                                'bg-amber-500/10 text-amber-400'
                            }`}>
                                {itemType === 'gear' ? <Package size={18} /> :
                                 itemType === 'studio' ? <Video size={18} /> :
                                 <Users size={18} />}
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-white">Detalhes da Reserva</h3>
                                <div className="flex items-center gap-1.5 text-xs text-white/40 mt-0.5">
                                    <Hash size={12} />
                                    <span className="font-mono">{shortId}</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 text-white/40 hover:text-white rounded-lg hover:bg-white/5 transition">
                            <X size={18} />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Status row */}
                        <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                            <span className="text-xs text-white/40 uppercase tracking-widest font-medium">Estado</span>
                            <span className={`text-xs px-2 py-0.5 rounded border capitalize font-medium ${statusColor}`}>
                                {statusLabel}
                            </span>
                        </div>

                        {/* Informação do Item */}
                        <div>
                            <h4 className="flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-white/30 mb-3 font-medium">
                                {isGearOrStudio ? (itemType === 'gear' ? 'Equipamento' : 'Estúdio') : 'Plano de Coworking'}
                            </h4>
                            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
                                <p className="text-sm font-medium text-white/90">
                                    {isGearOrStudio ? (reservation as Reservation).item_name : `Cowork: ${(reservation as CoworkReservation).plan_id.replace('-', ' ')}`}
                                </p>
                                {!isGearOrStudio && (
                                    <p className="text-xs text-white/40 mt-1 capitalize">
                                        Período: {(reservation as CoworkReservation).period} · {(reservation as CoworkReservation).spots} lugar{(reservation as CoworkReservation).spots > 1 ? 'es' : ''}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Datas e Horários */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-white/30 mb-3 font-medium">
                                    <Calendar size={12} /> Datas
                                </h4>
                                <div className="space-y-1">
                                    <div className="text-sm text-white/80"><span className="text-white/30 mr-2">Início:</span> {reservation.start_date}</div>
                                    <div className="text-sm text-white/80"><span className="text-white/30 mr-2">Fim:</span> {reservation.end_date}</div>
                                </div>
                            </div>
                            {itemType === 'studio' && 'start_time' in reservation && reservation.start_time && (
                                <div>
                                    <h4 className="flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-white/30 mb-3 font-medium">
                                        <Clock size={12} /> Horário
                                    </h4>
                                    <div className="space-y-1">
                                        <div className="text-sm text-white/80 font-mono"><span className="text-white/30 mr-2 font-sans">Início:</span> {reservation.start_time}</div>
                                        <div className="text-sm text-white/80 font-mono"><span className="text-white/30 mr-2 font-sans">Fim:</span> {reservation.end_time}</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Cliente */}
                        <div>
                            <h4 className="flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-white/30 mb-3 font-medium">
                                <User size={12} /> Cliente
                            </h4>
                            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-medium text-white/60">
                                        {reservation.client.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white/90">{reservation.client}</p>
                                        {reservation.contact && (
                                            <p className="text-xs text-white/40 flex items-center gap-1.5 mt-0.5">
                                                <Phone size={10} /> {reservation.contact}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Preço */}
                        {reservation.total_price !== null && (
                            <div>
                                <h4 className="flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-white/30 mb-3 font-medium">
                                    <CreditCard size={12} /> Faturação
                                </h4>
                                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 flex items-center justify-between">
                                    <span className="text-sm text-white/60">Valor Total</span>
                                    <span className="text-lg font-semibold text-emerald-400">
                                        {reservation.total_price.toFixed(2)}€
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Notas */}
                        {reservation.notes && (
                            <div>
                                <h4 className="flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-white/30 mb-3 font-medium">
                                    <AlignLeft size={12} /> Notas da Reserva
                                </h4>
                                <div className="bg-white/[0.01] border border-white/[0.04] p-4 rounded-xl">
                                    <p className="text-sm text-white/70 whitespace-pre-wrap leading-relaxed">{reservation.notes}</p>
                                </div>
                            </div>
                        )}

                        {/* Meta */}
                        <div className="pt-4 border-t border-white/[0.06] text-center">
                            <span className="text-[10px] text-white/20">
                                Criada em {new Date(reservation.created_at).toLocaleString('pt-PT')}
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
