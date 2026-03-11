'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Lock } from 'lucide-react';
import { useHourlyAvailability } from '@/hooks/useHourlyAvailability';

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

  // Generate grid hours 08:00 to 22:00 (15 intervals, ending at 23:00)
  const HOURS = Array.from({ length: 15 }, (_, i) => i + 8);
  
  // 15-minute intervals for clickable slots (60 total)
  const INTERVALS = Array.from({ length: 60 }, (_, i) => i);

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
      <div className="flex items-center justify-between mb-6 sticky top-0 bg-black/95 backdrop-blur-xl pb-4 border-b border-white/5 z-50">
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
      )}      {/* Timeline view */}
      {loading ? (
        <div className="h-[600px] flex items-center justify-center border-l border-white/10 ml-12">
          <div className="animate-pulse text-white/30">Carregando...</div>
        </div>
      ) : (
        <div className="relative mt-8 mb-4">
          <div className="relative w-full h-[750px] md:h-[900px] border-l border-white/10 ml-10 lg:ml-12" id="timeline-container">
            
            {/* Grid lines */}
            {HOURS.map((hour, i) => (
              <div key={`grid-${i}`} className="absolute w-full border-t border-white/10 pointer-events-none z-0" style={{ top: `${(i / 15) * 100}%`, height: `${(1 / 15) * 100}%` }}>
                <span className="absolute -left-12 -top-2.5 text-xs text-white/50 w-10 text-right">
                  {String(hour).padStart(2, '0')}:00
                </span>
                {/* 15 min dashed lines */}
                <div className="absolute top-[25%] w-full border-t border-white/[0.03] border-dashed" />
                <div className="absolute top-[50%] w-full border-t border-white/[0.05] border-dashed" />
                <div className="absolute top-[75%] w-full border-t border-white/[0.03] border-dashed" />
              </div>
            ))}
            {/* Last bottom line for 23:00 */}
            <div className="absolute w-full border-t border-white/10 pointer-events-none z-0" style={{ top: '100%' }}>
              <span className="absolute -left-12 -top-2.5 text-xs text-white/50 w-10 text-right">
                23:00
              </span>
            </div>

            {/* Clickable 15-min intervals */}
            {INTERVALS.map((i) => {
              const mFrom8 = i * 15;
              const startM = 8 * 60 + mFrom8;
              const slotEndM = startM + 15;
              
              const hour = Math.floor(startM / 60);
              const min = startM % 60;
              const timeStr = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
              
              const isOccupied = blocks.some(b => {
                const bStart = parseTimeToMinutes(b.start);
                const bEnd = parseTimeToMinutes(b.end);
                return bStart < slotEndM && bEnd > startM;
              });
              
              const isPast = isPastTime(selectedDate, timeStr);
              const isClickable = !isOccupied && !isPast;

              return (
                <div
                  key={`interval-${i}`}
                  onClick={() => isClickable && onSlotSelect(selectedDate, timeStr)}
                  className={`absolute w-full group ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed hidden md:block'}`}
                  style={{ top: `${(i / 60) * 100}%`, height: `${(1 / 60) * 100}%`, zIndex: isClickable ? 10 : 0 }}
                >
                  {isClickable && (
                    <div className="absolute top-0 left-0 w-full h-[400%] bg-[var(--color-accent)]/[0.04] opacity-0 group-hover:opacity-100 pointer-events-none rounded-r-lg border-l-2 border-[var(--color-accent)]/30 transition-none hidden md:block mix-blend-screen shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]">
                      <span className="text-[10px] text-white/50 absolute top-1 left-2 bg-black/50 px-1 rounded">{timeStr} - duração 1h</span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Reservation Blocks */}
            {blocks.map((block, idx) => {
              const startM = parseTimeToMinutes(block.start);
              const endM = parseTimeToMinutes(block.end);
              // Clamp to 08:00 (480) and 23:00 (1380)
              const visualStartM = Math.max(480, startM);
              const visualEndM = Math.min(1380, endM);
              
              const startFrom8 = visualStartM - 480;
              const duration = visualEndM - visualStartM;
              
              if (duration <= 0) return null;
              
              const top = (startFrom8 / 900) * 100;
              const height = (duration / 900) * 100;
              
              return (
                <div
                  key={`block-${idx}`}
                  className="absolute right-2 left-0 bg-[var(--color-accent)]/15 border-l-4 border-[var(--color-accent)] rounded-r-lg pointer-events-none px-3 py-2 flex flex-col justify-start overflow-hidden z-20 backdrop-blur-sm shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
                  style={{ top: `${top}%`, height: `${height}%` }}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Lock size={12} className="text-[var(--color-accent)]" />
                    <span className="text-xs font-bold text-[var(--color-accent)] truncate">{block.label}</span>
                  </div>
                  <span className="text-[10px] text-white/70 truncate">{block.start} - {block.end}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-8 pt-4 border-t border-white/5 flex flex-wrap gap-4 text-xs text-white/40">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-black border border-white/10" />
          <span>Livre (Clique para reservar)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/50" />
          <span>Ocupado</span>
        </div>
      </div>
    </motion.div>
  );
}
