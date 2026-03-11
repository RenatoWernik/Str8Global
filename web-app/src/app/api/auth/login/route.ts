import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase-auth';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        const response = NextResponse.json({ success: true });
        const supabase = createRouteHandlerClient(request, response);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return NextResponse.json(
                { error: 'Credenciais inválidas' },
                { status: 401 },
            );
        }

        return response;
    } catch {
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 },
        );
    }
}
