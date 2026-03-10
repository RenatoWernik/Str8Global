'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Lock } from 'lucide-react';
import { useHourlyAvailability, type HourlySlot } from '@/hooks/useHourlyAvailability';

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

function getCurrentHour(): number {
  return new Date().getHours();
}

function isPastHour(dateStr: string, hour: string): boolean {
  const today = getTodayString();
  if (dateStr !== today) return false;
  const slotHour = parseInt(hour.split(':')[0], 10);
  return slotHour < getCurrentHour();
}

export function StudioHourlyCalendar({
  studioId,
  studioName,
  onSlotSelect,
  onClose,
}: StudioHourlyCalendarProps) {
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const { slots, loading, error } = useHourlyAvailability(studioId, selectedDate);
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

  const handleSlotClick = (slot: HourlySlot) => {
    if (!slot.available) return;
    if (isPastHour(selectedDate, slot.hour)) return;
    onSlotSelect(selectedDate, slot.hour);
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <motion.div
      ref={panelRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="relative w-full max-h-[70vh] overflow-y-auto bg-black/95 border border-white/10 backdrop-blur-xl rounded-2xl p-4 md:p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sticky top-0 bg-black/95 backdrop-blur-xl pb-4 border-b border-white/5">
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{studioName}</h3>
          <p className="text-sm text-white/50">Disponibilidade por hora</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-white/70 hover:text-white transition-all"
          aria-label="Fechar calendário"
        >
          <X size={20} />
        </button>
      </div>

      {/* Date navigation */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={handlePrev}
          disabled={!canGoPrev}
          className={`p-2 rounded-lg border transition-all ${
            canGoPrev
              ? 'bg-white/[0.03] hover:bg-white/[0.08] border-white/10 hover:border-white/20 text-white'
              : 'bg-white/[0.01] border-white/5 text-white/30 cursor-not-allowed'
          }`}
          aria-label="Dia anterior"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex-1 text-center">
          <p className="text-base md:text-lg font-medium text-white">{formatDatePT(selectedDate)}</p>
          {selectedDate === today && (
            <p className="text-xs text-[var(--color-accent)] mt-1">Hoje</p>
          )}
        </div>

        <button
          onClick={handleNext}
          disabled={!canGoNext}
          className={`p-2 rounded-lg border transition-all ${
            canGoNext
              ? 'bg-white/[0.03] hover:bg-white/[0.08] border-white/10 hover:border-white/20 text-white'
              : 'bg-white/[0.01] border-white/5 text-white/30 cursor-not-allowed'
          }`}
          aria-label="Próximo dia"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Shortcut to today */}
      {selectedDate !== today && (
        <div className="mb-4 flex justify-center">
          <button
            onClick={handleToday}
            className="px-4 py-1.5 text-xs rounded-lg bg-white/[0.03] hover:bg-[var(--color-accent)]/10 border border-white/10 hover:border-[var(--color-accent)]/30 text-white/70 hover:text-white transition-all"
          >
            Ir para Hoje
          </button>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Hourly slots grid */}
      <div className="space-y-2">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="bg-white/[0.04] animate-pulse rounded-xl h-12"
            />
          ))
        ) : (
          // Actual slots
          slots.map((slot, index) => {
            const isPast = isPastHour(selectedDate, slot.hour);
            const isClickable = slot.available && !isPast;
            const endHour = String(parseInt(slot.hour.split(':')[0], 10) + 1).padStart(2, '0');

            return (
              <motion.div
                key={slot.hour}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
              >
                <button
                  onClick={() => handleSlotClick(slot)}
                  disabled={!isClickable}
                  className={`
                    w-full p-4 rounded-xl border transition-all duration-300 flex items-center justify-between
                    ${
                      slot.available
                        ? isPast
                          ? 'bg-white/[0.02] border-white/5 opacity-40 cursor-not-allowed'
                          : 'bg-white/[0.03] border-white/10 hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-accent)]/5 cursor-pointer'
                        : 'bg-[var(--color-accent)]/10 border-[var(--color-accent)]/20 cursor-not-allowed'
                    }
                  `}
                >
                  {/* Time label */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`
                        text-sm md:text-base font-medium
                        ${slot.available ? 'text-white/70' : 'text-white/50'}
                      `}
                    >
                      {slot.hour} - {endHour}:00
                    </span>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2">
                    {slot.available ? (
                      <span className="text-xs md:text-sm text-white/50 group-hover:text-white/70 transition-colors">
                        {isPast ? 'Passado' : 'Disponível'}
                      </span>
                    ) : (
                      <>
                        <span className="text-xs md:text-sm text-[var(--color-accent)]/80 font-medium">
                          {slot.reservation || 'Reservado'}
                        </span>
                        <Lock size={14} className="text-[var(--color-accent)]/60" />
                      </>
                    )}
                  </div>
                </button>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Legend */}
      {!loading && slots.length > 0 && (
        <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap gap-4 text-xs text-white/40">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-white/[0.03] border border-white/10" />
            <span>Disponível</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20" />
            <span>Ocupado</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
