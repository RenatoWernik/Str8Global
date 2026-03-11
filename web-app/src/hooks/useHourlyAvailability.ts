'use client';

import { useState, useEffect, useRef } from 'react';

export interface ReservationBlock {
  start: string; // HH:MM
  end: string;   // HH:MM
  label: string;
}

interface UseHourlyAvailabilityReturn {
  blocks: ReservationBlock[];
  loading: boolean;
  error: string | null;
}

export function useHourlyAvailability(
  studioId: string | null,
  date: string | null       // "YYYY-MM-DD" format
): UseHourlyAvailabilityReturn {
  const [blocks, setBlocks] = useState<ReservationBlock[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Skip fetch if studioId or date is null
    if (!studioId || !date) {
      setBlocks([]);
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
          return res.json() as Promise<{ date: string; studio_id: string; blocks: ReservationBlock[] }>;
        })
        .then((json) => {
          setBlocks(json.blocks);
        })
        .catch((err) => {
          if (err instanceof DOMException && err.name === 'AbortError') return;
          console.error('Hourly availability fetch error:', err);
          setError('Erro ao verificar disponibilidade horária');
          // Graceful fallback: return empty blocks (all available)
          setBlocks([]);
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
    blocks,
    loading,
    error,
  };
}
