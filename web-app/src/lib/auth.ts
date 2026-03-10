import { NextRequest, NextResponse } from 'next/server';

/**
 * Verify the admin session cookie.
 * Returns null if valid, or a 401 Response if invalid.
 */
export async function verifySession(request: NextRequest): Promise<NextResponse | null> {
    const token = request.cookies.get('str8_session')?.value;

    if (!token) {
        return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    try {
        const authSecret = process.env.AUTH_SECRET;
        if (!authSecret) {
            return NextResponse.json({ error: 'Configuração em falta' }, { status: 500 });
        }

        const [payloadB64, signatureB64] = token.split('.');
        if (!payloadB64 || !signatureB64) {
            return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
        }

        const payload = JSON.parse(Buffer.from(payloadB64, 'base64').toString());

        if (payload.exp && payload.exp < Date.now()) {
            return NextResponse.json({ error: 'Sessão expirada' }, { status: 401 });
        }

        const expectedSignature = Buffer.from(
            await crypto.subtle.digest(
                'SHA-256',
                new TextEncoder().encode(JSON.stringify(payload) + authSecret),
            ).then(buf => Buffer.from(buf).toString('hex')),
        ).toString('base64');

        if (signatureB64 !== expectedSignature) {
            return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
        }

        return null; // Valid
    } catch {
        return NextResponse.json({ error: 'Erro de autenticação' }, { status: 401 });
    }
}
