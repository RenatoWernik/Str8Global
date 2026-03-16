import { createServerClient as _createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Supabase client for Server Components and Server Actions.
 * Reads/writes auth cookies automatically via next/headers.
 */
export async function createClient() {
    const cookieStore = await cookies();

    return _createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
            getAll() {
                return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options),
                    );
                } catch {
                    // setAll can fail in Server Components (read-only).
                    // This is expected — the middleware or route handler will
                    // handle the cookie write instead.
                }
            },
        },
    });
}

/**
 * Supabase client for API Route Handlers.
 * Takes the NextRequest/NextResponse to read and write cookies.
 */
export function createRouteHandlerClient(
    request: NextRequest,
    response: NextResponse,
) {
    return _createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value, options }) => {
                    request.cookies.set(name, value);
                    response.cookies.set(name, value, options);
                });
            },
        },
    });
}
