import { NextRequest, NextResponse } from 'next/server';
import { getAvailabilityForDate } from '@/lib/database';

// Legacy single-date availability endpoint
// Maintained for backward compatibility with existing calendar components
export const revalidate = 300; // Cache for 5 minutes

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const date = searchParams.get('date');

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: 'Parameter "date" is required in YYYY-MM-DD format' },
      { status: 400 },
    );
  }

  try {
    const availability = await getAvailabilityForDate(date);
    return NextResponse.json(availability, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error('Failed to fetch availability:', error);
    // Fallback: return empty (everything available) so the site doesn't break
    return NextResponse.json(
      { items: {}, cowork: {} },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60',
        },
      },
    );
  }
}
