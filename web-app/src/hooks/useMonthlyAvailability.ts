'use client';

import { useState, useEffect, useRef } from 'react';

interface MonthlyAvailabilityResult {
  unavailableDates: Set<string>; // Set of "YYYY-MM-DD" strings for O(1) lookup
  loading: boolean;
  error: string | null;
}

export function useMonthlyAvailability(
  id: string | null,        // item_id or plan_id
  type: 'item' | 'plan',    // determines which query param to use
  month: string             // "YYYY-MM" format
): MonthlyAvailabilityResult {
  const [unavailableDates, setUnavailableDates] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // If no ID provided, skip fetch and return empty set
    if (!id) {
      setUnavailableDates(new Set());
      setLoading(false);
      setError(null);
      return;
    }

    // Debounce 300ms to avoid rapid API calls when user navigates months fast
    const timer = setTimeout(() => {
      // Abort any in-flight request
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);

      // Build query params based on type
      const paramName = type === 'item' ? 'item_id' : 'plan_id';
      const url = `/api/rental/availability/monthly?${paramName}=${id}&month=${month}`;

      fetch(url, { signal: controller.signal })
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch monthly availability');
          return res.json() as Promise<{ unavailableDates: string[] }>;
        })
        .then(json => {
          // Convert array to Set for O(1) lookup
          setUnavailableDates(new Set(json.unavailableDates));
        })
        .catch(err => {
          if (err instanceof DOMException && err.name === 'AbortError') return;
          console.error('Monthly availability fetch error:', err);
          setError('Erro ao verificar disponibilidade mensal');
          // Graceful fallback: return empty set (everything available)
          setUnavailableDates(new Set());
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
  }, [id, type, month]);

  return {
    unavailableDates,
    loading,
    error,
  };
}
