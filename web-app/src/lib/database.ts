import { createServerClient } from './supabase';
import type {
    Reservation,
    CoworkReservation,
} from '@/types/database';

// ============================================================
// RESERVATIONS (gear + studios)
// ============================================================

/**
 * Check if a studio time slot conflicts with existing reservations
 * @param itemId - The studio ID
 * @param date - The date to check (YYYY-MM-DD)
 * @param startTime - Start time in HH:MM format (e.g. "10:00")
 * @param endTime - End time in HH:MM format (e.g. "14:00")
 * @param excludeReservationId - Optional reservation ID to exclude from conflict check (for updates)
 * @returns true if conflict exists, false if slot is available
 */
export async function checkTimeConflict(
    itemId: string,
    date: string,
    startTime: string,
    endTime: string,
    excludeReservationId?: string
): Promise<boolean> {
    const supabase = createServerClient();

    // Query for active reservations on the same item and date
    let query = supabase
        .from('reservations')
        .select('id, start_time, end_time')
        .eq('item_id', itemId)
        .eq('status', 'active')
        .lte('start_date', date)
        .gte('end_date', date)
        .not('start_time', 'is', null)
        .not('end_time', 'is', null);

    if (excludeReservationId) {
        query = query.neq('id', excludeReservationId);
    }

    const { data, error } = await query;

    if (error) throw new Error(`Failed to check time conflict: ${error.message}`);

    // Check for time overlap: existing.start_time < endTime AND existing.end_time > startTime
    const hasConflict = (data || []).some((reservation: { start_time: string | null; end_time: string | null }) => {
        if (!reservation.start_time || !reservation.end_time) return false;
        return reservation.start_time < endTime && reservation.end_time > startTime;
    });

    return hasConflict;
}

export async function getReservations(filters?: {
    status?: string;
    item_type?: string;
    from_date?: string;
    to_date?: string;
}): Promise<Reservation[]> {
    const supabase = createServerClient();
    let query = supabase
        .from('reservations')
        .select('*')
        .order('start_date', { ascending: false });

    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.item_type) query = query.eq('item_type', filters.item_type);
    if (filters?.from_date) query = query.gte('start_date', filters.from_date);
    if (filters?.to_date) query = query.lte('end_date', filters.to_date);

    const { data, error } = await query;
    if (error) throw new Error(`Failed to fetch reservations: ${error.message}`);
    return (data || []) as Reservation[];
}

export async function getReservationById(id: string): Promise<Reservation | null> {
    const supabase = createServerClient();
    const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null;
        throw new Error(`Failed to fetch reservation: ${error.message}`);
    }
    return data as Reservation;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createReservation(reservation: Record<string, any>): Promise<Reservation> {
    // Overlap validation for studio reservations with time slots
    if (
        reservation.item_type === 'studio' &&
        reservation.start_time &&
        reservation.end_time
    ) {
        const hasConflict = await checkTimeConflict(
            reservation.item_id,
            reservation.start_date,
            reservation.start_time,
            reservation.end_time
        );

        if (hasConflict) {
            throw new Error('CONFLICT: Time slot overlaps with existing reservation');
        }
    }

    const supabase = createServerClient();
    const { data, error } = await supabase
        .from('reservations')
        .insert(reservation)
        .select()
        .single();

    if (error) throw new Error(`Failed to create reservation: ${error.message}`);
    return data as Reservation;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateReservation(id: string, updates: Record<string, any>): Promise<Reservation> {
    // If updating time fields or dates on a studio reservation, validate overlap
    if (
        updates.start_time !== undefined ||
        updates.end_time !== undefined ||
        updates.start_date !== undefined ||
        updates.end_date !== undefined
    ) {
        // Fetch existing reservation to get full context
        const existing = await getReservationById(id);

        if (existing && existing.item_type === 'studio') {
            // Merge existing with updates to get complete picture
            const finalStartTime = updates.start_time !== undefined ? updates.start_time : existing.start_time;
            const finalEndTime = updates.end_time !== undefined ? updates.end_time : existing.end_time;
            const finalStartDate = updates.start_date !== undefined ? updates.start_date : existing.start_date;

            // Only check if we have time slots
            if (finalStartTime && finalEndTime) {
                const hasConflict = await checkTimeConflict(
                    existing.item_id,
                    finalStartDate,
                    finalStartTime,
                    finalEndTime,
                    id // Exclude current reservation from conflict check
                );

                if (hasConflict) {
                    throw new Error('CONFLICT: Time slot overlaps with existing reservation');
                }
            }
        }
    }

    const supabase = createServerClient();
    const { data, error } = await supabase
        .from('reservations')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(`Failed to update reservation: ${error.message}`);
    return data as Reservation;
}

export async function deleteReservation(id: string): Promise<void> {
    const supabase = createServerClient();
    const { error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', id);

    if (error) throw new Error(`Failed to delete reservation: ${error.message}`);
}

// ============================================================
// COWORK RESERVATIONS
// ============================================================

export async function getCoworkReservations(filters?: {
    status?: string;
    plan_type?: string;
    from_date?: string;
    to_date?: string;
}): Promise<CoworkReservation[]> {
    const supabase = createServerClient();
    let query = supabase
        .from('cowork_reservations')
        .select('*')
        .order('start_date', { ascending: false });

    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.plan_type) query = query.eq('plan_type', filters.plan_type);
    if (filters?.from_date) query = query.gte('start_date', filters.from_date);
    if (filters?.to_date) query = query.lte('end_date', filters.to_date);

    const { data, error } = await query;
    if (error) throw new Error(`Failed to fetch cowork reservations: ${error.message}`);
    return (data || []) as CoworkReservation[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createCoworkReservation(reservation: Record<string, any>): Promise<CoworkReservation> {
    const supabase = createServerClient();
    const { data, error } = await supabase
        .from('cowork_reservations')
        .insert(reservation)
        .select()
        .single();

    if (error) throw new Error(`Failed to create cowork reservation: ${error.message}`);
    return data as CoworkReservation;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateCoworkReservation(id: string, updates: Record<string, any>): Promise<CoworkReservation> {
    const supabase = createServerClient();
    const { data, error } = await supabase
        .from('cowork_reservations')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(`Failed to update cowork reservation: ${error.message}`);
    return data as CoworkReservation;
}

export async function deleteCoworkReservation(id: string): Promise<void> {
    const supabase = createServerClient();
    const { error } = await supabase
        .from('cowork_reservations')
        .delete()
        .eq('id', id);

    if (error) throw new Error(`Failed to delete cowork reservation: ${error.message}`);
}

// ============================================================
// CAPACITY
// ============================================================

interface CapacityRow {
    plan_id: string;
    total_spots: number;
}

export async function getCoworkCapacity(): Promise<Record<string, number>> {
    const supabase = createServerClient();
    const { data, error } = await supabase
        .from('capacity')
        .select('*');

    if (error) throw new Error(`Failed to fetch capacity: ${error.message}`);

    const capacity: Record<string, number> = {};
    for (const row of (data || []) as CapacityRow[]) {
        capacity[row.plan_id] = row.total_spots;
    }
    return capacity;
}

// ============================================================
// AVAILABILITY (used by public site + dashboard)
// ============================================================

export interface AvailabilityMap {
    [itemId: string]: {
        available: boolean;
        nextAvailable?: string;
    };
}

export interface CoworkAvailabilityMap {
    [planId: string]: {
        spotsOccupied: number;
        totalSpots?: number;
    };
}

interface ReservationRow {
    item_id: string;
    end_date: string;
}

interface CoworkResRow {
    plan_id: string;
    spots: number;
}

export async function getAvailabilityForDate(date: string): Promise<{
    items: AvailabilityMap;
    cowork: CoworkAvailabilityMap;
}> {
    const supabase = createServerClient();

    const [reservationsRes, coworkRes, capacity] = await Promise.all([
        supabase
            .from('reservations')
            .select('*')
            .eq('status', 'active')
            .lte('start_date', date)
            .gte('end_date', date),
        supabase
            .from('cowork_reservations')
            .select('*')
            .eq('status', 'active')
            .lte('start_date', date)
            .gte('end_date', date),
        getCoworkCapacity(),
    ]);

    if (reservationsRes.error) throw new Error(`Availability error: ${reservationsRes.error.message}`);
    if (coworkRes.error) throw new Error(`Cowork availability error: ${coworkRes.error.message}`);

    // Build item availability map
    const items: AvailabilityMap = {};
    for (const reservation of (reservationsRes.data || []) as ReservationRow[]) {
        items[reservation.item_id] = {
            available: false,
            nextAvailable: await findNextAvailableDate(reservation.item_id, date),
        };
    }

    // Build cowork availability map
    const cowork: CoworkAvailabilityMap = {};

    for (const [planId, totalSpots] of Object.entries(capacity)) {
        cowork[planId] = { spotsOccupied: 0, totalSpots };
    }

    for (const reservation of (coworkRes.data || []) as CoworkResRow[]) {
        if (!cowork[reservation.plan_id]) {
            cowork[reservation.plan_id] = { spotsOccupied: 0 };
        }
        cowork[reservation.plan_id].spotsOccupied += reservation.spots;
        if (capacity[reservation.plan_id]) {
            cowork[reservation.plan_id].totalSpots = capacity[reservation.plan_id];
        }
    }

    return { items, cowork };
}

async function findNextAvailableDate(itemId: string, fromDate: string): Promise<string | undefined> {
    const supabase = createServerClient();

    const { data } = await supabase
        .from('reservations')
        .select('end_date')
        .eq('item_id', itemId)
        .eq('status', 'active')
        .lte('start_date', fromDate)
        .gte('end_date', fromDate)
        .order('end_date', { ascending: true })
        .limit(1);

    const rows = (data || []) as { end_date: string }[];
    if (rows.length === 0) return undefined;

    const nextDate = new Date(rows[0].end_date);
    nextDate.setDate(nextDate.getDate() + 1);
    return nextDate.toISOString().split('T')[0];
}

// ============================================================
// MONTHLY AVAILABILITY
// ============================================================

/**
 * Get monthly availability - returns unavailable dates for a given item or cowork plan
 * @param params.item_id - Equipment or studio ID
 * @param params.plan_id - Cowork plan ID
 * @param params.month - Month in YYYY-MM format
 * @returns Array of unavailable date strings in YYYY-MM-DD format
 */
export async function getMonthlyAvailability(params: {
    item_id?: string;
    plan_id?: string;
    month: string;
}): Promise<string[]> {
    const { item_id, plan_id, month } = params;

    if (!item_id && !plan_id) {
        throw new Error('Either item_id or plan_id is required');
    }

    // Parse month to get first and last day
    const [year, monthNum] = month.split('-').map(Number);
    const firstDay = `${month}-01`;
    const lastDay = new Date(year, monthNum, 0).toISOString().split('T')[0]; // Last day of month

    const supabase = createServerClient();

    // Handle item availability (gear/studio)
    if (item_id) {
        const { data, error } = await supabase
            .from('reservations')
            .select('*')
            .eq('item_id', item_id)
            .eq('status', 'active')
            .lte('start_date', lastDay)
            .gte('end_date', firstDay);

        if (error) throw new Error(`Failed to fetch item availability: ${error.message}`);

        const unavailableDates = new Set<string>();

        for (const reservation of (data || []) as Reservation[]) {
            const resStart = new Date(reservation.start_date);
            const resEnd = new Date(reservation.end_date);
            const monthStart = new Date(firstDay);
            const monthEnd = new Date(lastDay);

            // Calculate actual overlap range within the month
            const rangeStart = resStart > monthStart ? resStart : monthStart;
            const rangeEnd = resEnd < monthEnd ? resEnd : monthEnd;

            // If this is a studio reservation with hourly slots
            if (reservation.item_type === 'studio' && reservation.start_time && reservation.end_time) {
                // For hourly reservations, we need to track hours per day
                // Only mark day as unavailable if ALL hours (8-23h = 15 slots) are booked
                // For now, we'll mark days with hourly bookings as partially available
                // (Full logic would require aggregating all reservations per day)
                continue; // Skip hourly reservations for monthly view
            } else {
                // For day-based reservations (gear or studio without times), mark entire range
                for (let d = new Date(rangeStart); d <= rangeEnd; d.setDate(d.getDate() + 1)) {
                    unavailableDates.add(d.toISOString().split('T')[0]);
                }
            }
        }

        return Array.from(unavailableDates).sort();
    }

    // Handle cowork plan availability
    if (plan_id) {
        const [reservationsRes, capacity] = await Promise.all([
            supabase
                .from('cowork_reservations')
                .select('*')
                .eq('plan_id', plan_id)
                .eq('status', 'active')
                .lte('start_date', lastDay)
                .gte('end_date', firstDay),
            getCoworkCapacity(),
        ]);

        if (reservationsRes.error) {
            throw new Error(`Failed to fetch cowork availability: ${reservationsRes.error.message}`);
        }

        const totalSpots = capacity[plan_id] || 0;
        const spotsByDate: Record<string, number> = {};

        // Calculate spots occupied per day
        for (const reservation of (reservationsRes.data || []) as CoworkReservation[]) {
            const resStart = new Date(reservation.start_date);
            const resEnd = new Date(reservation.end_date);
            const monthStart = new Date(firstDay);
            const monthEnd = new Date(lastDay);

            const rangeStart = resStart > monthStart ? resStart : monthStart;
            const rangeEnd = resEnd < monthEnd ? resEnd : monthEnd;

            for (let d = new Date(rangeStart); d <= rangeEnd; d.setDate(d.getDate() + 1)) {
                const dateStr = d.toISOString().split('T')[0];
                spotsByDate[dateStr] = (spotsByDate[dateStr] || 0) + reservation.spots;
            }
        }

        // Find dates where spots are full
        const unavailableDates = Object.entries(spotsByDate)
            .filter(([, spots]) => spots >= totalSpots)
            .map(([date]) => date)
            .sort();

        return unavailableDates;
    }

    return [];
}

// ============================================================
// ANALYTICS / METRICS
// ============================================================

export async function getAllReservationsForAnalytics(): Promise<{
    reservations: Reservation[];
    coworkReservations: CoworkReservation[];
}> {
    const supabase = createServerClient();

    const [resRes, coworkRes] = await Promise.all([
        supabase
            .from('reservations')
            .select('*')
            .order('start_date', { ascending: false }),
        supabase
            .from('cowork_reservations')
            .select('*')
            .order('start_date', { ascending: false }),
    ]);

    if (resRes.error) throw new Error(`Analytics error: ${resRes.error.message}`);
    if (coworkRes.error) throw new Error(`Analytics cowork error: ${coworkRes.error.message}`);

    return {
        reservations: (resRes.data || []) as Reservation[],
        coworkReservations: (coworkRes.data || []) as CoworkReservation[],
    };
}
