import { NextRequest, NextResponse } from 'next/server';
import { getHourlyAvailability } from '@/lib/database';

export const revalidate = 300; // Cache for 5 minutes

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const studio_id = searchParams.get('studio_id');
  const date = searchParams.get('date');

  // Validate required parameters
  if (!studio_id) {
    return NextResponse.json(
      { error: 'Parameter "studio_id" is required' },
      { status: 400 },
    );
  }

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: 'Parameter "date" is required in YYYY-MM-DD format' },
      { status: 400 },
    );
  }

  try {
    const slots = await getHourlyAvailability(studio_id, date);

    return NextResponse.json(
      { date, studio_id, slots },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
        },
      },
    );
  } catch (error) {
    console.error('Failed to fetch hourly availability:', error);
    // Graceful fallback: return all slots as available
    const fallbackSlots = [
      '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
      '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
    ].map(hour => ({ hour, available: true }));

    return NextResponse.json(
      { date, studio_id, slots: fallbackSlots },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60',
        },
      },
    );
  }
}
