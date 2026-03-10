import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Browser/client-side Supabase client (uses anon key).
 * Safe to use in client components — read-only public access.
 */
export function createBrowserClient() {
    return createClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Server-side Supabase client (uses service role key).
 * Has full read+write access — use ONLY in API routes and server components.
 */
export function createServerClient() {
    if (!supabaseServiceKey) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
    }
    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}
