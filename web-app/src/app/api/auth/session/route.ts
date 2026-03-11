import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-auth';

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        return NextResponse.json({
            authenticated: true,
            user: { email: user.email, role: 'admin' },
        });
    } catch {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }
}
