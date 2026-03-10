// Supabase Database types for Str8Global

export type ReservationStatus = 'active' | 'cancelled' | 'completed';
export type ItemType = 'gear' | 'studio';
export type PlanType = 'cowork' | 'cowork-studio';
export type CoworkPeriod = 'diaria' | 'semanal' | 'mensal';

export interface ReservationRow {
    id: string;
    item_id: string;
    item_name: string;
    item_type: string;
    start_date: string;
    end_date: string;
    client: string;
    contact: string | null;
    notes: string | null;
    status: string;
    total_price: number | null;
    created_at: string;
    updated_at: string;
}

export interface ReservationInsert {
    item_id: string;
    item_name: string;
    item_type: string;
    start_date: string;
    end_date: string;
    client: string;
    contact?: string | null;
    notes?: string | null;
    status?: string;
    total_price?: number | null;
}

export interface ReservationUpdate {
    item_id?: string;
    item_name?: string;
    item_type?: string;
    start_date?: string;
    end_date?: string;
    client?: string;
    contact?: string | null;
    notes?: string | null;
    status?: string;
    total_price?: number | null;
    updated_at?: string;
}

export interface CoworkReservationRow {
    id: string;
    plan_id: string;
    plan_type: string;
    period: string;
    start_date: string;
    end_date: string;
    client: string;
    contact: string | null;
    spots: number;
    notes: string | null;
    status: string;
    total_price: number | null;
    created_at: string;
    updated_at: string;
}

export interface CoworkReservationInsert {
    plan_id: string;
    plan_type: string;
    period: string;
    start_date: string;
    end_date: string;
    client: string;
    contact?: string | null;
    spots?: number;
    notes?: string | null;
    status?: string;
    total_price?: number | null;
}

export interface CoworkReservationUpdate {
    plan_id?: string;
    plan_type?: string;
    period?: string;
    start_date?: string;
    end_date?: string;
    client?: string;
    contact?: string | null;
    spots?: number;
    notes?: string | null;
    status?: string;
    total_price?: number | null;
    updated_at?: string;
}

export interface CapacityRow {
    plan_id: string;
    total_spots: number;
}

// Supabase Database type definition
export interface Database {
    public: {
        Tables: {
            reservations: {
                Row: ReservationRow;
                Insert: ReservationInsert;
                Update: ReservationUpdate;
            };
            cowork_reservations: {
                Row: CoworkReservationRow;
                Insert: CoworkReservationInsert;
                Update: CoworkReservationUpdate;
            };
            capacity: {
                Row: CapacityRow;
                Insert: CapacityRow;
                Update: Partial<CapacityRow>;
            };
        };
    };
}

// Convenience aliases
export type Reservation = ReservationRow;
export type CoworkReservation = CoworkReservationRow;
export type Capacity = CapacityRow;
