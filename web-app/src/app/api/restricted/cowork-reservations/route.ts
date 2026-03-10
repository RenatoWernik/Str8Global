import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import {
    getCoworkReservations,
    createCoworkReservation,
    updateCoworkReservation,
    deleteCoworkReservation,
} from '@/lib/database';

export async function GET(request: NextRequest) {
    const authError = await verifySession(request);
    if (authError) return authError;

    try {
        const { searchParams } = request.nextUrl;
        const filters = {
            status: searchParams.get('status') || undefined,
            plan_type: searchParams.get('plan_type') || undefined,
            from_date: searchParams.get('from_date') || undefined,
            to_date: searchParams.get('to_date') || undefined,
        };

        const reservations = await getCoworkReservations(filters);
        return NextResponse.json(reservations);
    } catch (error) {
        console.error('Error fetching cowork reservations:', error);
        return NextResponse.json({ error: 'Erro ao buscar reservas cowork' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const authError = await verifySession(request);
    if (authError) return authError;

    try {
        const body = await request.json();
        const reservation = await createCoworkReservation(body);
        return NextResponse.json(reservation, { status: 201 });
    } catch (error) {
        console.error('Error creating cowork reservation:', error);
        return NextResponse.json({ error: 'Erro ao criar reserva cowork' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    const authError = await verifySession(request);
    if (authError) return authError;

    try {
        const body = await request.json();
        const { id, ...updates } = body;
        if (!id) {
            return NextResponse.json({ error: 'ID da reserva é obrigatório' }, { status: 400 });
        }
        const reservation = await updateCoworkReservation(id, updates);
        return NextResponse.json(reservation);
    } catch (error) {
        console.error('Error updating cowork reservation:', error);
        return NextResponse.json({ error: 'Erro ao atualizar reserva cowork' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const authError = await verifySession(request);
    if (authError) return authError;

    try {
        const { searchParams } = request.nextUrl;
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ error: 'ID da reserva é obrigatório' }, { status: 400 });
        }
        await deleteCoworkReservation(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting cowork reservation:', error);
        return NextResponse.json({ error: 'Erro ao eliminar reserva cowork' }, { status: 500 });
    }
}
