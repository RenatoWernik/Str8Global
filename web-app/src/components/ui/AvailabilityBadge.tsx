'use client';

import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

const MONTHS_PT = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
];

function formatShortDatePT(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return `${d.getDate()} ${MONTHS_PT[d.getMonth()]}`;
}

interface AvailabilityBadgeProps {
  available: boolean;
  nextAvailable?: string;
  loading?: boolean;
  compact?: boolean;
}

export function AvailabilityBadge({ available, nextAvailable, loading, compact }: AvailabilityBadgeProps) {
  if (loading) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10">
        <Loader2 size={12} className="animate-spin text-white/40" />
        <span className="text-[11px] text-white/40">A verificar...</span>
      </div>
    );
  }

  if (available) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
        <CheckCircle2 size={12} className="text-emerald-400" />
        <span className="text-[11px] font-medium text-emerald-400">
          {compact ? 'Disponível' : 'Disponível'}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
      <XCircle size={12} className="text-red-400" />
      <span className="text-[11px] font-medium text-red-400">
        Reservado
        {nextAvailable && !compact && (
          <span className="text-red-400/60"> · Livre {formatShortDatePT(nextAvailable)}</span>
        )}
      </span>
    </div>
  );
}
