'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Lock } from 'lucide-react';
import { useHourlyAvailability } from '@/hooks/useHourlyAvailability';
import { MobileBottomSheet } from '@/components/ui/MobileBottomSheet';

interface StudioHourlyCalendarProps {
  studioId: string;
  studioName: string;
  onSlotSelect: (date: string, hour: string) => void;
  onClose: () => void;
}

const MONTHS_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

function formatDatePT(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return `${d.getDate()} de ${MONTHS_PT[d.getMonth()]} de ${d.getFullYear()}`;
}

function getTodayString(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr || !timeStr.includes(':')) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function isPastTime(dateStr: string, timeStr: string): boolean {
  const today = getTodayString();
  if (dateStr < today) return true; // past day
  if (dateStr > today) return false; // future day

  const now = new Date();
  const currentMins = now.getHours() * 60 + now.getMinutes();
  const slotMins = parseTimeToMinutes(timeStr);

  return slotMins < currentMins;
}

export function StudioHourlyCalendar({
  studioId,
  studioName,
  onSlotSelect,
  onClose,
}: StudioHourlyCalendarProps) {
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [isDesktop, setIsDesktop] = useState(false);
  const { blocks, loading, error } = useHourlyAvailability(studioId, selectedDate);
  const panelRef = useRef<HTMLDivElement>(null);

  const today = getTodayString();
  const maxDate = addDays(today, 90);

  const canGoPrev = selectedDate > today;
  const canGoNext = selectedDate < maxDate;

  const handlePrev = () => {
    if (canGoPrev) {
      setSelectedDate(addDays(selectedDate, -1));
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      setSelectedDate(addDays(selectedDate, 1));
    }
  };

  const handleToday = () => {
    setSelectedDate(today);
  };

  // Detect desktop breakpoint (md: 768px)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Close on outside click (desktop only — vaul handles mobile)
  useEffect(() => {
    if (!isDesktop) return; // Skip on mobile — vaul handles dismissible

    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDesktop, onClose]);

  // Close on Escape key
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Generate grouped slots
  const generateSlots = (startH: number, endH: number) => {
    const slots = [];
    for (let h = startH; h < endH; h++) {
      slots.push(`${String(h).padStart(2, '0')}:00`);
      slots.push(`${String(h).padStart(2, '0')}:30`);
    }
    return slots;
  };

  const periodSlots = {
    'Manhã': generateSlots(8, 12),
    'Tarde': generateSlots(12, 18),
    'Noite': generateSlots(18, 23),
  };

  // Calendar panel content (shared between mobile/desktop)
  const calendarPanel = (
    <motion.div
      ref={panelRef}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={`
        relative w-full flex flex-col overflow-hidden bg-black/95 border border-white/10 backdrop-blur-xl rounded-2xl
        ${isDesktop ? 'max-w-4xl max-h-[85vh] shadow-2xl shadow-black/50' : ''}
      `}
    >
      {/* Header (desktop only — MobileBottomSheet provides header on mobile) */}
      {isDesktop && (
        <div className="flex items-center justify-between p-4 md:p-6 bg-white/[0.02] border-b border-white/5 z-20 shrink-0">
          <div>
            <h3 className="text-xl md:text-3xl font-bold text-white mb-1 flex items-center gap-3">
              {studioName}
            </h3>
            <p className="text-sm md:text-base text-white/50">Selecione o dia e horário para a sua reserva</p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-white/20 text-white/70 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50"
            aria-label="Fechar calendário"
          >
            <X size={20} />
          </button>
        </div>
      )}

      <div className="p-4 md:p-6 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {/* Date navigation */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white/[0.02] p-2 md:p-3 rounded-2xl border border-white/5">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={handlePrev}
              disabled={!canGoPrev}
              className={`p-3 rounded-xl border transition-all flex-shrink-0 ${
                canGoPrev
                  ? 'bg-white/[0.05] hover:bg-white/[0.1] border-white/10 hover:border-white/20 text-white active:scale-95'
                  : 'bg-transparent border-transparent text-white/20 cursor-not-allowed'
              }`}
              aria-label="Dia anterior"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex-1 text-center min-w-[200px]">
              <p className="text-base md:text-xl font-semibold text-white tracking-wide">{formatDatePT(selectedDate)}</p>
              {selectedDate === today && (
                <p className="text-xs font-medium text-[var(--color-accent)] mt-0.5 uppercase tracking-widest">Hoje</p>
              )}
            </div>
            <button
              onClick={handleNext}
              disabled={!canGoNext}
              className={`p-3 rounded-xl border transition-all flex-shrink-0 ${
                canGoNext
                  ? 'bg-white/[0.05] hover:bg-white/[0.1] border-white/10 hover:border-white/20 text-white active:scale-95'
                  : 'bg-transparent border-transparent text-white/20 cursor-not-allowed'
              }`}
              aria-label="Próximo dia"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Shortcut to today & Legend */}
          <div className="flex items-center justify-between w-full md:w-auto gap-4 px-2">
            {selectedDate !== today && (
              <button
                onClick={handleToday}
                className="px-4 py-2 text-xs md:text-sm font-medium rounded-lg bg-[var(--color-accent)]/10 hover:bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/20 hover:border-[var(--color-accent)]/40 text-[var(--color-accent)] transition-all active:scale-95"
              >
                Ir para Hoje
              </button>
            )}

            {/* Desktop Legend inline */}
            <div className="hidden md:flex flex-wrap items-center gap-4 text-xs font-medium text-white/50 ml-auto bg-black/40 px-4 py-2 rounded-lg border border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm bg-white/10 border border-white/20" />
                <span>Livre</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm bg-red-500/10 border border-red-500/30" />
                <span>Ocupado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Time Slots Grid By Period */}
        {loading ? (
          <div className="h-[300px] md:h-[400px] flex items-center justify-center">
            <div className="flex gap-2 items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-accent)] animate-bounce" />
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-accent)] animate-bounce [animation-delay:-.15s]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-accent)] animate-bounce [animation-delay:-.3s]" />
            </div>
          </div>
        ) : (
          <div className="space-y-8 md:space-y-10">
            {Object.entries(periodSlots).map(([period, slots]) => (
              <div key={period} className="relative">
                <div className="flex items-center gap-4 mb-4 md:mb-6">
                  <h4 className="text-sm md:text-base font-bold text-white/80 uppercase tracking-widest">{period}</h4>
                  <div className="flex-1 h-px bg-white/5" />
                </div>

                <motion.div
                  className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 md:gap-3"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.02 } }
                  }}
                >
                  {slots.map((timeStr) => {
                    const startM = parseTimeToMinutes(timeStr);
                    // A booking is 1 hour (60 mins)
                    const bookingEndM = startM + 60;

                    const isOccupied = blocks.some(b => {
                      const bStart = parseTimeToMinutes(b.start);
                      const bEnd = parseTimeToMinutes(b.end);
                      return bStart < bookingEndM && bEnd > startM;
                    });

                    const isPast = isPastTime(selectedDate, timeStr);
                    const exceedsClosing = bookingEndM > 1380; // 23:00
                    const isClickable = !isOccupied && !isPast && !exceedsClosing;

                    return (
                      <motion.button
                        key={timeStr}
                        disabled={!isClickable}
                        onClick={() => isClickable && onSlotSelect(selectedDate, timeStr)}
                        variants={{
                          hidden: { opacity: 0, scale: 0.9, y: 10 },
                          visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
                        }}
                        whileHover={isClickable ? { scale: 1.05, y: -2 } : {}}
                        whileTap={isClickable ? { scale: 0.95 } : {}}
                        // IMPORTANT: use group/slot instead of group to prevent global hover bugs
                        className={`
                          relative flex border flex-col items-center justify-center py-3 md:py-4 rounded-xl transition-all duration-300 overflow-hidden group/slot focus:outline-none select-none
                          ${isClickable
                            ? 'bg-gradient-to-br from-white/[0.04] to-white/[0.01] border-white/10 hover:border-[var(--color-accent)] hover:shadow-[0_4px_25px_rgba(255,255,255,0.06)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]'
                            : isOccupied
                              ? 'bg-red-500/[0.03] border-red-500/10 cursor-not-allowed'
                              : 'bg-white/[0.01] border-transparent cursor-not-allowed'}
                        `}
                      >
                        <span className={`text-base md:text-xl font-bold tracking-tight transition-colors duration-300 ${isClickable ? 'text-white group-hover/slot:text-[var(--color-accent)]' : isOccupied ? 'text-red-400/40 line-through decoration-red-500/30' : 'text-white/20'}`}>
                          {timeStr}
                        </span>

                        {isClickable && (
                          <>
                            <span className="text-[9px] md:text-[10px] text-white/50 mt-1 uppercase tracking-widest font-semibold opacity-80">1 hora</span>
                            {/* Glow effect on hover */}
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[var(--color-accent)]/20 to-transparent opacity-0 group-hover/slot:opacity-100 transition-opacity duration-300 pointer-events-none" />
                            {/* Inner ring on hover */}
                            <div className="absolute inset-0 ring-1 ring-inset ring-[var(--color-accent)]/0 group-hover/slot:ring-[var(--color-accent)]/40 rounded-xl transition-all duration-300 pointer-events-none" />
                          </>
                        )}

                        {!isClickable && isOccupied && (
                          <div className="absolute top-1 right-1.5 opacity-50">
                            <Lock size={10} strokeWidth={2.5} className="text-red-400" />
                          </div>
                        )}

                        {/* Diagonal striped pattern for disabled/passed states */}
                        {!isClickable && (isPast || exceedsClosing) && !isOccupied && (
                          <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '6px 6px' }} />
                        )}
                      </motion.button>
                    );
                  })}
                </motion.div>
              </div>
            ))}
          </div>
        )}

        {/* Mobile Legend */}
        <div className="mt-8 pt-4 border-t border-white/5 flex md:hidden flex-wrap items-center justify-center gap-4 text-xs font-medium text-white/40">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm bg-white/5 border border-white/20" />
            <span>Livre</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm bg-red-500/10 border border-red-500/30" />
            <span>Ocupado</span>
          </div>
        </div>

      </div>
    </motion.div>
  );

  // Desktop: Portal to body (escapes overflow-hidden + transform parents)
  if (isDesktop) {
    return createPortal(
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-6"
        >
          {calendarPanel}
        </motion.div>
      </AnimatePresence>,
      document.body
    );
  }

  // Mobile: Bottom sheet with snap points and swipe dismiss
  return (
    <MobileBottomSheet
      open={true}
      onOpenChange={(open) => !open && onClose()}
      title={studioName}
    >
      {calendarPanel}
    </MobileBottomSheet>
  );
}
