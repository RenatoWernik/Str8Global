'use client';

import { useState, useEffect, useRef } from 'react';

export interface HourlySlot {
  hour: string;        // "08:00", "09:00", ..., "22:00"
  available: boolean;
  reservation?: string; // Client name when occupied
}

interface UseHourlyAvailabilityReturn {
  slots: HourlySlot[];
  loading: boolean;
  error: string | null;
}

export function useHourlyAvailability(
  studioId: string | null,
  date: string | null       // "YYYY-MM-DD" format
): UseHourlyAvailabilityReturn {
  const [slots, setSlots] = useState<HourlySlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Skip fetch if studioId or date is null
    if (!studioId || !date) {
      setSlots([]);
      setLoading(false);
      setError(null);
      return;
    }

    // Debounce 300ms to avoid rapid API calls
    const timer = setTimeout(() => {
      // Abort any in-flight request
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);

      fetch(`/api/rental/availability/hourly?studio_id=${studioId}&date=${date}`, {
        signal: controller.signal,
      })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch hourly availability');
          return res.json() as Promise<{ date: string; studio_id: string; slots: HourlySlot[] }>;
        })
        .then((json) => {
          setSlots(json.slots);
        })
        .catch((err) => {
          if (err instanceof DOMException && err.name === 'AbortError') return;
          console.error('Hourly availability fetch error:', err);
          setError('Erro ao verificar disponibilidade horária');
          // Graceful fallback: return all 15 slots as available
          const fallbackSlots: HourlySlot[] = [
            '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
            '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00',
          ].map((hour) => ({ hour, available: true }));
          setSlots(fallbackSlots);
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setLoading(false);
          }
        });
    }, 300);

    return () => {
      clearTimeout(timer);
      abortRef.current?.abort();
    };
  }, [studioId, date]);

  return {
    slots,
    loading,
    error,
  };
}
