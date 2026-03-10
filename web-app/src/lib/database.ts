import { createServerClient } from './supabase';
import type {
    Reservation,
    CoworkReservation,
} from '@/types/database';

// ============================================================
// RESERVATIONS (gear + studios)
// ============================================================

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
