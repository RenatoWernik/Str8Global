import { NextRequest, NextResponse } from 'next/server';
import { getMonthlyAvailability } from '@/lib/database';

export const revalidate = 300; // Cache for 5 minutes

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const item_id = searchParams.get('item_id');
  const plan_id = searchParams.get('plan_id');
  const month = searchParams.get('month');

  // Validate: at least one of item_id/plan_id is required
  if (!item_id && !plan_id) {
    return NextResponse.json(
      { error: 'Either "item_id" or "plan_id" is required' },
      { status: 400 },
    );
  }

  // Validate month format (YYYY-MM)
  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json(
      { error: 'Parameter "month" is required in YYYY-MM format' },
      { status: 400 },
    );
  }

  try {
    const result = await getMonthlyAvailability({
      item_id: item_id || undefined,
      plan_id: plan_id || undefined,
      month,
    });

    return NextResponse.json(
      result,
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
        },
      },
    );
  } catch (error) {
    console.error('Failed to fetch monthly availability:', error);
    // Graceful fallback: return empty (everything available)
    return NextResponse.json(
      { unavailableDates: [] },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60',
        },
      },
    );
  }
}
