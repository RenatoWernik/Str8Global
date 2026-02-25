'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const MONTHS_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const WEEKDAYS_PT = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

function formatDatePT(date: Date): string {
  return `${date.getDate()} de ${MONTHS_PT[date.getMonth()]} de ${date.getFullYear()}`;
}

function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

interface RentalDatePickerProps {
  selectedDate: string | null;
  onDateChange: (date: string) => void;
  loading?: boolean;
}

export function RentalDatePicker({ selectedDate, onDateChange, loading }: RentalDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => {
    if (selectedDate) return new Date(selectedDate + 'T00:00:00');
    return new Date();
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 90);

  const selected = selectedDate ? new Date(selectedDate + 'T00:00:00') : null;

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleSelect = (date: Date) => {
    onDateChange(toDateString(date));
    setIsOpen(false);
  };

  const prevMonth = () => {
    setViewMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setViewMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Build calendar grid
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Monday = 0
  let startWeekday = firstDay.getDay() - 1;
  if (startWeekday < 0) startWeekday = 6;

  const days: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }

  const canGoPrev = new Date(year, month, 1) > new Date(today.getFullYear(), today.getMonth(), 1);
  const canGoNext = new Date(year, month + 1, 1) <= maxDate;

  return (
    <div ref={containerRef} className="relative inline-block">
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-medium
          bg-white/[0.04] border border-white/10 hover:border-[var(--color-accent)]/50
          text-white transition-all duration-300"
      >
        <Calendar size={18} className="text-[var(--color-accent)]" />
        <span>
          {selected ? formatDatePT(selected) : 'Escolher data'}
        </span>
        {loading && <Loader2 size={16} className="animate-spin text-[var(--color-accent)]" />}
      </button>

      {/* Calendar dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 z-50 p-4 rounded-2xl
              bg-black/95 border border-white/10 backdrop-blur-xl
              shadow-[0_20px_60px_rgba(0,0,0,0.5)]
              w-[320px]"
          >
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={prevMonth}
                disabled={!canGoPrev}
                className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white
                  disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm font-medium text-white">
                {MONTHS_PT[month]} {year}
              </span>
              <button
                onClick={nextMonth}
                disabled={!canGoNext}
                className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white
                  disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {WEEKDAYS_PT.map((day) => (
                <div key={day} className="text-center text-[10px] uppercase tracking-wider text-white/30 py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, i) => {
                if (!day) {
                  return <div key={`empty-${i}`} />;
                }

                const isPast = day < today;
                const isTooFar = day > maxDate;
                const isDisabled = isPast || isTooFar;
                const isSelected = selected && isSameDay(day, selected);
                const isToday = isSameDay(day, today);

                return (
                  <button
                    key={day.toISOString()}
                    disabled={isDisabled}
                    onClick={() => handleSelect(day)}
                    className={`
                      relative w-full aspect-square flex items-center justify-center
                      text-sm rounded-lg transition-all duration-200
                      ${isDisabled
                        ? 'text-white/15 cursor-not-allowed'
                        : isSelected
                          ? 'bg-[var(--color-accent)] text-black font-bold'
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }
                    `}
                  >
                    {day.getDate()}
                    {isToday && !isSelected && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--color-accent)]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Today shortcut */}
            <button
              onClick={() => handleSelect(today)}
              className="w-full mt-3 py-2 text-xs uppercase tracking-wider text-[var(--color-accent)] hover:text-white
                bg-white/[0.03] rounded-lg border border-white/5 hover:border-[var(--color-accent)]/30
                transition-all duration-200"
            >
              Hoje
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
