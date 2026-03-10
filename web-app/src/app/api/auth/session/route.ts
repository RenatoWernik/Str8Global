import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const token = request.cookies.get('str8_session')?.value;

    if (!token) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    try {
        const authSecret = process.env.AUTH_SECRET;
        if (!authSecret) {
            return NextResponse.json({ authenticated: false }, { status: 500 });
        }

        const [payloadB64, signatureB64] = token.split('.');
        if (!payloadB64 || !signatureB64) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        const payload = JSON.parse(Buffer.from(payloadB64, 'base64').toString());

        // Check expiry
        if (payload.exp && payload.exp < Date.now()) {
            return NextResponse.json({ authenticated: false, reason: 'expired' }, { status: 401 });
        }

        // Verify signature
        const expectedSignature = Buffer.from(
            await crypto.subtle.digest(
                'SHA-256',
                new TextEncoder().encode(JSON.stringify(payload) + authSecret),
            ).then(buf => Buffer.from(buf).toString('hex')),
        ).toString('base64');

        if (signatureB64 !== expectedSignature) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        return NextResponse.json({
            authenticated: true,
            user: { email: payload.email, role: payload.role },
        });
    } catch {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }
}
