'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2, X } from 'lucide-react';
import { useMonthlyAvailability } from '@/hooks/useMonthlyAvailability';
import { MobileBottomSheet } from '@/components/ui/MobileBottomSheet';

const MONTHS_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const WEEKDAYS_PT = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

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

interface AvailabilityCalendarProps {
  itemId: string;                    // The item or plan ID
  itemType: 'item' | 'plan';        // Determines API param (item_id vs plan_id)
  selectedDate: string | null;       // Currently selected date "YYYY-MM-DD"
  onSelect: (date: string) => void;  // Callback when user picks a date
  onClose: () => void;               // Callback to close the calendar
}

export function AvailabilityCalendar({
  itemId,
  itemType,
  selectedDate,
  onSelect,
  onClose,
}: AvailabilityCalendarProps) {
  const [viewMonth, setViewMonth] = useState(() => {
    if (selectedDate) return new Date(selectedDate + 'T00:00:00');
    return new Date();
  });
  const [isDesktop, setIsDesktop] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 90);

  const selected = selectedDate ? new Date(selectedDate + 'T00:00:00') : null;

  // Get month string in YYYY-MM format for the hook
  const viewMonthStr = `${viewMonth.getFullYear()}-${String(viewMonth.getMonth() + 1).padStart(2, '0')}`;

  // Fetch unavailable dates for current view month
  const { unavailableDates, loading } = useMonthlyAvailability(itemId, itemType, viewMonthStr);

  // Detect desktop breakpoint (md: 768px)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Close on click outside (desktop only — vaul handles mobile)
  useEffect(() => {
    if (!isDesktop) return; // Skip on mobile — vaul handles dismissible

    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDesktop, onClose]);

  // Close on Escape key
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSelect = (date: Date) => {
    onSelect(toDateString(date));
    onClose();
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

  // Calendar panel content (shared between mobile/desktop)
  const calendarContent = (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: isDesktop ? 20 : -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: isDesktop ? 20 : -10, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={`
        p-4 rounded-2xl bg-black/95 border border-white/10 backdrop-blur-xl
        ${isDesktop
          ? 'w-[400px] p-6 shadow-2xl shadow-black/50'
          : 'w-full'
        }
      `}
    >
      {/* Header with close button (desktop only) */}
      {isDesktop && (
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
          <h3 className="text-lg font-semibold text-white">Selecione a Data</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-white/20 text-white/70 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50"
            aria-label="Fechar calendário"
          >
            <X size={18} />
          </button>
        </div>
      )}

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
        <div className="flex items-center gap-2">
          <span className={`${isDesktop ? 'text-base' : 'text-sm'} font-medium text-white`}>
            {MONTHS_PT[month]} {year}
          </span>
          {loading && <Loader2 size={14} className="animate-spin text-[var(--color-accent)]" />}
        </div>
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
      <div className={`grid grid-cols-7 ${isDesktop ? 'gap-1.5' : 'gap-1'} mb-2`}>
        {WEEKDAYS_PT.map((day) => (
          <div key={day} className={`text-center ${isDesktop ? 'text-xs' : 'text-[10px]'} uppercase tracking-wider text-white/30 py-1`}>
            {day}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className={`grid grid-cols-7 ${isDesktop ? 'gap-1.5' : 'gap-1'}`}>
        {days.map((day, i) => {
          if (!day) {
            return <div key={`empty-${i}`} />;
          }

          const dateStr = toDateString(day);
          const isPast = day < today;
          const isTooFar = day > maxDate;
          const isUnavailable = unavailableDates.has(dateStr);
          const isDisabled = isPast || isTooFar || isUnavailable;
          const isSelected = selected && isSameDay(day, selected);
          const isToday = isSameDay(day, today);

          return (
            <button
              key={day.toISOString()}
              disabled={isDisabled}
              onClick={() => handleSelect(day)}
              className={`
                relative w-full aspect-square flex items-center justify-center
                ${isDesktop ? 'text-base' : 'text-sm'} rounded-lg transition-all duration-200
                ${isPast
                  ? 'text-white/15 cursor-not-allowed'
                  : isUnavailable
                    ? 'text-white/30 line-through cursor-not-allowed'
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
        className={`w-full ${isDesktop ? 'mt-4 py-2.5' : 'mt-3 py-2'} text-xs uppercase tracking-wider text-[var(--color-accent)] hover:text-white
          bg-white/[0.03] rounded-lg border border-white/5 hover:border-[var(--color-accent)]/30
          transition-all duration-200`}
      >
        Hoje
      </button>
    </motion.div>
  );

  // Desktop: Portal to body with fixed overlay (escapes overflow-hidden + transform parents)
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
          {calendarContent}
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
      title="Selecione a Data"
    >
      {calendarContent}
    </MobileBottomSheet>
  );
}
