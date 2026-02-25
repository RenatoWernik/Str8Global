'use client';

import { useState, useEffect, useCallback } from 'react';

interface ItemAvailability {
  available: boolean;
  nextAvailable?: string;
}

interface CoworkAvailability {
  spotsOccupied: number;
}

interface AvailabilityData {
  items: Record<string, ItemAvailability>;
  cowork: Record<string, CoworkAvailability>;
}

export function useRentalAvailability(selectedDate: string | null) {
  const [data, setData] = useState<AvailabilityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailability = useCallback(async (date: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/rental/availability?date=${date}`);
      if (!res.ok) throw new Error('Failed to fetch availability');
      const json: AvailabilityData = await res.json();
      setData(json);
    } catch (err) {
      console.error('Availability fetch error:', err);
      setError('Erro ao verificar disponibilidade');
      // Fallback: everything available
      setData({ items: {}, cowork: {} });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailability(selectedDate);
    }
  }, [selectedDate, fetchAvailability]);

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
    (planId: string): number => {
      if (!data || !data.cowork[planId]) {
        return 0;
      }
      return data.cowork[planId].spotsOccupied;
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
