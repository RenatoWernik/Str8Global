'use client';

import { useEffect, useState, useMemo } from 'react';
import { createBrowserClient } from '@/lib/supabase';
import { Reservation, CoworkReservation } from '@/types/database';
import { SearchInput } from '@/components/ui/SearchInput';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Mail, Phone, Calendar as CalendarIcon, Package, Video, CreditCard, ChevronRight, X, ClipboardList } from 'lucide-react';

interface ClientData {
    id: string; // a normalized string
    name: string;
    contacts: string[];
    ltv: number;
    reservationsCount: number;
    firstReservation: string;
    lastReservation: string;
    history: Array<{
        type: 'gear' | 'studio' | 'cowork';
        name: string;
        date: string;
        price: number;
        status: string;
        originalId: string;
    }>;
}

export default function ClientesPage() {
    const supabase = useMemo(() => createBrowserClient(), []);
    const [gearStudio, setGearStudio] = useState<Reservation[]>([]);
    const [cowork, setCowork] = useState<CoworkReservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);

    useEffect(() => {
        fetchData();
        
        // Subscription para atualizações em tempo real
        const gearStudioSub = supabase
            .channel('public:reservations')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, fetchData)
            .subscribe();

        const coworkSub = supabase
            .channel('public:cowork_reservations')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'cowork_reservations' }, fetchData)
            .subscribe();

        return () => {
            supabase.removeChannel(gearStudioSub);
            supabase.removeChannel(coworkSub);
        };
    }, []);

    const fetchData = async () => {
        try {
            const [resGearStudio, resCowork] = await Promise.all([
                supabase.from('reservations').select('*').order('created_at', { ascending: false }),
                supabase.from('cowork_reservations').select('*').order('created_at', { ascending: false })
            ]);

            if (resGearStudio.error) throw resGearStudio.error;
            if (resCowork.error) throw resCowork.error;

            setGearStudio(resGearStudio.data || []);
            setCowork(resCowork.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const clients: ClientData[] = useMemo(() => {
        const map = new Map<string, ClientData>();

        const processReservation = (
            clientName: string,
            contact: string | null,
            date: string,
            price: number | null,
            status: string,
            type: 'gear' | 'studio' | 'cowork',
            itemName: string,
            id: string
        ) => {
            if (!clientName) return;
            const key = clientName.trim().toLowerCase();
            
            const existing = map.get(key) || {
                id: key,
                name: clientName.trim(),
                contacts: [],
                ltv: 0,
                reservationsCount: 0,
                firstReservation: date,
                lastReservation: date,
                history: []
            };

            if (contact && !existing.contacts.includes(contact.trim())) {
                existing.contacts.push(contact.trim());
            }

            if (status === 'completed' || status === 'active') { // Only count LTV if not cancelled
                existing.ltv += (price || 0);
            }
            existing.reservationsCount += 1;

            if (new Date(date) < new Date(existing.firstReservation)) existing.firstReservation = date;
            if (new Date(date) > new Date(existing.lastReservation)) existing.lastReservation = date;

            existing.history.push({
                type,
                name: itemName,
                date,
                price: price || 0,
                status,
                originalId: id
            });

            map.set(key, existing);
        };

        gearStudio.forEach(r => processReservation(r.client, r.contact, r.start_date, r.total_price, r.status, r.item_type as 'gear'|'studio', r.item_name, r.id));
        cowork.forEach(r => processReservation(r.client, r.contact, r.start_date, r.total_price, r.status, 'cowork', `Cowork ${r.plan_id}`, r.id));

        return Array.from(map.values()).sort((a, b) => b.ltv - a.ltv || b.reservationsCount - a.reservationsCount);
    }, [gearStudio, cowork]);

    const filteredClients = useMemo(() => {
        if (!searchQuery) return clients;
        const q = searchQuery.toLowerCase();
        return clients.filter(c => 
            c.name.toLowerCase().includes(q) || 
            c.contacts.some(contact => contact.toLowerCase().includes(q))
        );
    }, [clients, searchQuery]);

    const formatCurrency = (val: number) => `${val.toFixed(2)}€`;

    const getContactIcon = (contact: string) => {
        if (contact.includes('@')) return <Mail size={12} className="text-white/40" />;
        return <Phone size={12} className="text-white/40" />;
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[500px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                    </div>
                    <span className="text-sm text-white/40 tracking-[0.2em] uppercase">A carregar clientes...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 lg:gap-8 max-w-[1400px] mx-auto w-full relative">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    Gestão de Clientes
                </h1>
                <p className="text-sm text-white/40">
                    Acompanhe o Life-Time Value (LTV), histórico e contactos da sua base de clientes.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center bg-white/[0.02] border border-white/[0.06] rounded-xl p-3">
                <div className="w-full md:w-80">
                    <SearchInput 
                        value={searchQuery} 
                        onChange={setSearchQuery} 
                        placeholder="Buscar por nome ou contacto..." 
                    />
                </div>
                <div className="text-sm text-white/40 px-3">
                    {filteredClients.length} cliente{filteredClients.length !== 1 ? 's' : ''} encontrado{filteredClients.length !== 1 ? 's' : ''}
                </div>
            </div>

            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden">
                <div className="overflow-x-auto min-h-[400px]">
                    {/* Mobile View */}
                    <div className="md:hidden flex flex-col gap-3 p-3">
                        {filteredClients.length === 0 ? (
                            <div className="text-center py-8 text-white/20 text-sm">Nenhum cliente encontrado.</div>
                        ) : (
                            filteredClients.map((client, i) => (
                                <motion.div
                                    key={client.id}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.03 }}
                                    onClick={() => setSelectedClient(client)}
                                    className="bg-[#12121a] border border-white/[0.06] rounded-xl p-4 flex flex-col gap-3 cursor-pointer active:scale-95 transition-all"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                                                <Users size={16} className="text-cyan-400" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-white/90">{client.name}</span>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    {client.contacts[0] ? (
                                                        <>
                                                            {getContactIcon(client.contacts[0])}
                                                            <span className="text-xs text-white/50">{client.contacts[0]}</span>
                                                        </>
                                                    ) : (
                                                        <span className="text-xs text-white/30 italic">Sem contacto</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-white/[0.04]">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-white/30 uppercase tracking-wider">LTV (Gasto)</span>
                                            <span className="text-sm font-medium text-emerald-400">{formatCurrency(client.ltv)}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-white/30 uppercase tracking-wider">Reservas</span>
                                            <span className="text-sm font-medium text-white/80">{client.reservationsCount}</span>
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
                                <th className="text-[10px] tracking-[0.15em] uppercase text-white/30 font-medium px-5 py-4">Cliente</th>
                                <th className="text-[10px] tracking-[0.15em] uppercase text-white/30 font-medium px-5 py-4">Contactos</th>
                                <th className="text-[10px] tracking-[0.15em] uppercase text-white/30 font-medium px-5 py-4">LTV (Total Gasto)</th>
                                <th className="text-[10px] tracking-[0.15em] uppercase text-white/30 font-medium px-5 py-4">Reservas</th>
                                <th className="text-[10px] tracking-[0.15em] uppercase text-white/30 font-medium px-5 py-4">Última Visita</th>
                                <th className="text-[10px] tracking-[0.15em] uppercase text-white/30 font-medium px-5 py-4 text-right"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClients.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-white/20 text-sm">
                                        Nenhum cliente encontrado
                                    </td>
                                </tr>
                            ) : (
                                filteredClients.map((client, i) => (
                                    <motion.tr
                                        key={client.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.03 }}
                                        onClick={() => setSelectedClient(client)}
                                        className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group cursor-pointer"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                                                    <span className="text-cyan-400 font-medium text-xs">
                                                        {client.name.substring(0, 2).toUpperCase()}
                                                    </span>
                                                </div>
                                                <span className="font-semibold text-white/90">{client.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex flex-col gap-1">
                                                {client.contacts.length > 0 ? client.contacts.slice(0, 2).map((contact, idx) => (
                                                    <div key={idx} className="flex items-center gap-1.5 text-xs text-white/60">
                                                        {getContactIcon(contact)}
                                                        <span>{contact}</span>
                                                    </div>
                                                )) : (
                                                    <span className="text-xs text-white/30 italic">Sem contacto</span>
                                                )}
                                                {client.contacts.length > 2 && (
                                                    <span className="text-[10px] text-cyan-400/60">+{client.contacts.length - 2} mais</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-sm font-medium text-emerald-400">
                                            {formatCurrency(client.ltv)}
                                        </td>
                                        <td className="px-5 py-4 text-sm text-white/70">
                                            {client.reservationsCount}
                                        </td>
                                        <td className="px-5 py-4 text-sm text-white/50">
                                            <div className="flex items-center gap-2">
                                                <CalendarIcon size={14} className="opacity-50" />
                                                {new Date(client.lastReservation).toLocaleDateString('pt-PT')}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <ChevronRight size={18} className="text-white/20 group-hover:text-cyan-400 transition ml-auto" />
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Client Profile Drawer */}
            <AnimatePresence>
                {selectedClient && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedClient(null)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-full md:w-[500px] z-50 bg-[#0c0c14] border-l border-white/[0.06] shadow-2xl flex flex-col"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-white/[0.06] bg-[#0c0c14]/50 backdrop-blur-xl sticky top-0 z-10">
                                <h2 className="text-lg font-bold text-white tracking-tight">Ficha de Cliente</h2>
                                <button
                                    onClick={() => setSelectedClient(null)}
                                    className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                                {/* Header / Identity */}
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center shrink-0">
                                        <span className="text-2xl text-cyan-400 font-bold">
                                            {selectedClient.name.substring(0, 2).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className="text-xl font-bold text-white leading-tight">{selectedClient.name}</h3>
                                        <span className="text-sm text-white/40 mt-1">Cliente desde {new Date(selectedClient.firstReservation).getFullYear()}</span>
                                    </div>
                                </div>

                                {/* KPIs */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4 flex flex-col gap-1">
                                        <div className="flex items-center gap-2 text-white/40 mb-1">
                                            <CreditCard size={14} />
                                            <span className="text-xs uppercase tracking-wider font-medium">LTV Total</span>
                                        </div>
                                        <span className="text-2xl font-bold text-emerald-400">{formatCurrency(selectedClient.ltv)}</span>
                                    </div>
                                    <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4 flex flex-col gap-1">
                                        <div className="flex items-center gap-2 text-white/40 mb-1">
                                            <ClipboardList size={14} />
                                            <span className="text-xs uppercase tracking-wider font-medium">Reservas</span>
                                        </div>
                                        <span className="text-2xl font-bold text-white">{selectedClient.reservationsCount}</span>
                                    </div>
                                </div>

                                {/* Contactos */}
                                {selectedClient.contacts.length > 0 && (
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Contactos Conhecidos</h4>
                                        <div className="flex flex-col gap-2">
                                            {selectedClient.contacts.map((contact, i) => (
                                                <div key={i} className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.04] p-3 rounded-lg text-sm text-white/80">
                                                    {getContactIcon(contact)}
                                                    {contact}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* History Timeline */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Histórico de Alugueres</h4>
                                    
                                    <div className="relative pl-3 space-y-4 border-l border-white/[0.06] ml-2">
                                        {selectedClient.history.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((h, i) => (
                                            <div key={i} className="relative pl-5">
                                                <div className="absolute w-2.5 h-2.5 rounded-full bg-[#0c0c14] border-2 border-cyan-500/50 -left-[5px] top-1.5" />
                                                <div className="flex flex-col gap-1 bg-white/[0.02] hover:bg-white/[0.04] transition border border-white/[0.04] rounded-lg p-3">
                                                    <div className="flex justify-between items-start gap-2">
                                                        <div className="flex items-center gap-2 text-white/90 font-medium text-sm">
                                                            {h.type === 'gear' ? <Package size={14} className="text-cyan-400" /> :
                                                             h.type === 'studio' ? <Video size={14} className="text-violet-400" /> :
                                                             <Users size={14} className="text-amber-400" />}
                                                            <span className="capitalize">{h.name.replace('-', ' ')}</span>
                                                        </div>
                                                        <span className="text-emerald-400 font-medium text-sm">{formatCurrency(h.price)}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center mt-2">
                                                        <span className="text-xs text-white/40">{new Date(h.date).toLocaleDateString('pt-PT')}</span>
                                                        <span className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${
                                                            h.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                                                            h.status === 'completed' ? 'bg-cyan-500/10 text-cyan-400' :
                                                            'bg-red-500/10 text-red-400'
                                                        }`}>
                                                            {h.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
