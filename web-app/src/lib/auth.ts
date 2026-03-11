import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase-auth';

/**
 * Verify the admin session via Supabase Auth.
 * Returns null if valid, or a 401 Response if invalid.
 */
export async function verifySession(request: NextRequest): Promise<NextResponse | null> {
    try {
        const response = NextResponse.next();
        const supabase = createRouteHandlerClient(request, response);
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        return null; // Valid
    } catch {
        return NextResponse.json({ error: 'Erro de autenticação' }, { status: 401 });
    }
}
