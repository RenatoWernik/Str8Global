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
    const { blocks } = await getHourlyAvailability(studio_id, date);

    return NextResponse.json(
      { date, studio_id, blocks },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
        },
      },
    );
  } catch (error) {
    console.error('Failed to fetch hourly availability:', error);
    // Graceful fallback: return empty blocks (all available)
    return NextResponse.json(
      { date, studio_id, blocks: [] },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60',
        },
      },
    );
  }
}
