'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface ItemAvailability {
  available: boolean;
  nextAvailable?: string;
}

interface CoworkAvailability {
  spotsOccupied: number;
  totalSpots?: number;
}

interface AvailabilityData {
  items: Record<string, ItemAvailability>;
  cowork: Record<string, CoworkAvailability>;
}

export function useRentalAvailability(selectedDate: string | null) {
  const [data, setData] = useState<AvailabilityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!selectedDate) return;

    // Debounce 300ms to avoid rapid API calls when user taps date picker fast
    const timer = setTimeout(() => {
      // Abort any in-flight request
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);

      fetch(`/api/rental/availability?date=${selectedDate}`, { signal: controller.signal })
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch availability');
          return res.json() as Promise<AvailabilityData>;
        })
        .then(json => {
          setData(json);
        })
        .catch(err => {
          if (err instanceof DOMException && err.name === 'AbortError') return;
          console.error('Availability fetch error:', err);
          setError('Erro ao verificar disponibilidade');
          setData({ items: {}, cowork: {} });
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
  }, [selectedDate]);

  const isItemAvailable = useCallback(
    (itemId: string): { available: boolean; nextAvailable?: string } => {
      if (!data || !data.items[itemId]) {
        return { available: true };
      }
      return data.items[itemId];
    },
    [data],
  );

  const getCoworkSpots = useCallback(
    (planId: string): { spotsOccupied: number; totalSpots?: number } => {
      if (!data || !data.cowork[planId]) {
        return { spotsOccupied: 0 };
      }
      return data.cowork[planId];
    },
    [data],
  );

  return {
    loading,
    error,
    isItemAvailable,
    getCoworkSpots,
    hasData: data !== null,
  };
}

