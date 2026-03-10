import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        const validEmail = process.env.ADMIN_USER;
        const validPassword = process.env.ADMIN_PASSWORD;
        const authSecret = process.env.AUTH_SECRET;

        if (!validEmail || !validPassword || !authSecret) {
            return NextResponse.json(
                { error: 'Configuração de autenticação em falta' },
                { status: 500 },
            );
        }

        if (email !== validEmail || password !== validPassword) {
            return NextResponse.json(
                { error: 'Credenciais inválidas' },
                { status: 401 },
            );
        }

        // Create a simple signed token (base64 encoded payload + signature)
        const payload = {
            email,
            role: 'admin',
            iat: Date.now(),
            exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
        };

        const token = Buffer.from(JSON.stringify(payload)).toString('base64') +
            '.' +
            Buffer.from(
                await crypto.subtle.digest(
                    'SHA-256',
                    new TextEncoder().encode(JSON.stringify(payload) + authSecret),
                ).then(buf => Buffer.from(buf).toString('hex')),
            ).toString('base64');

        const response = NextResponse.json({ success: true });

        response.cookies.set('str8_session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60, // 7 days
        });

        return response;
    } catch {
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 },
        );
    }
}
