import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

function getAuth() {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!clientEmail || !privateKey) {
    throw new Error('Missing Google Sheets credentials');
  }

  return new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: SCOPES,
  });
}

function getSheets() {
  return google.sheets({ version: 'v4', auth: getAuth() });
}

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

export interface Reservation {
  itemId: string;
  itemName: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  client: string;
  contact: string;
  notes: string;
}

export interface CoworkReservation {
  planId: string;
  type: string;
  startDate: string;
  endDate: string;
  client: string;
  contact: string;
  spots: number;
  notes: string;
}

/**
 * Fetch all reservations from the "Reservas" sheet
 */
export async function getReservations(): Promise<Reservation[]> {
  const sheets = getSheets();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Reservas!A2:G',
  });

  const rows = response.data.values || [];

  return rows
    .filter((row) => row[0] && row[2] && row[3]) // must have ID, startDate, endDate
    .map((row) => ({
      itemId: (row[0] || '').toString().trim(),
      itemName: (row[1] || '').toString().trim(),
      startDate: (row[2] || '').toString().trim(),
      endDate: (row[3] || '').toString().trim(),
      client: (row[4] || '').toString().trim(),
      contact: (row[5] || '').toString().trim(),
      notes: (row[6] || '').toString().trim(),
    }));
}

/**
 * Fetch all cowork reservations from the "Cowork" sheet
 */
export async function getCoworkReservations(): Promise<CoworkReservation[]> {
  const sheets = getSheets();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Cowork!A2:H',
  });

  const rows = response.data.values || [];

  return rows
    .filter((row) => row[0] && row[2] && row[3])
    .map((row) => ({
      planId: (row[0] || '').toString().trim(),
      type: (row[1] || '').toString().trim(),
      startDate: (row[2] || '').toString().trim(),
      endDate: (row[3] || '').toString().trim(),
      client: (row[4] || '').toString().trim(),
      contact: (row[5] || '').toString().trim(),
      spots: parseInt((row[6] || '1').toString().trim(), 10) || 1,
      notes: (row[7] || '').toString().trim(),
    }));
}

/**
 * Fetch cowork capacity config from the "Capacidade" sheet.
 * Expected columns: A = planId, B = totalSpots
 * Falls back to empty map if sheet doesn't exist.
 */
export async function getCoworkCapacity(): Promise<Record<string, number>> {
  try {
    const sheets = getSheets();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Capacidade!A2:B',
    });

    const rows = response.data.values || [];
    const capacity: Record<string, number> = {};

    for (const row of rows) {
      const planId = (row[0] || '').toString().trim();
      const spots = parseInt((row[1] || '0').toString().trim(), 10);
      if (planId && spots > 0) {
        capacity[planId] = spots;
      }
    }

    return capacity;
  } catch (error) {
    console.error('Failed to fetch cowork capacity (sheet may not exist):', error);
    return {};
  }
}

/**
 * Check if a date falls within a reservation range
 */
function isDateInRange(date: string, startDate: string, endDate: string): boolean {
  const d = new Date(date);
  const start = new Date(startDate);
  const end = new Date(endDate);
  return d >= start && d <= end;
}

/**
 * Find the next available date for an item after a given date
 */
function findNextAvailableDate(
  itemId: string,
  fromDate: string,
  reservations: Reservation[],
): string | null {
  const itemReservations = reservations
    .filter((r) => r.itemId === itemId)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  // Find the reservation that covers the fromDate
  const coveringReservation = itemReservations.find((r) =>
    isDateInRange(fromDate, r.startDate, r.endDate),
  );

  if (!coveringReservation) return null;

  // Next available is day after endDate
  const nextDate = new Date(coveringReservation.endDate);
  nextDate.setDate(nextDate.getDate() + 1);
  return nextDate.toISOString().split('T')[0];
}

export interface AvailabilityMap {
  [itemId: string]: {
    available: boolean;
    nextAvailable?: string; // YYYY-MM-DD
  };
}

export interface CoworkAvailabilityMap {
  [planId: string]: {
    spotsOccupied: number;
    totalSpots?: number;
  };
}

/**
 * Get availability for all items on a specific date
 */
export async function getAvailabilityForDate(date: string): Promise<{
  items: AvailabilityMap;
  cowork: CoworkAvailabilityMap;
}> {
  const [reservations, coworkReservations, capacity] = await Promise.all([
    getReservations(),
    getCoworkReservations(),
    getCoworkCapacity(),
  ]);

  // Build item availability map
  const items: AvailabilityMap = {};
  for (const reservation of reservations) {
    if (isDateInRange(date, reservation.startDate, reservation.endDate)) {
      items[reservation.itemId] = {
        available: false,
        nextAvailable: findNextAvailableDate(reservation.itemId, date, reservations) || undefined,
      };
    }
  }

  // Build cowork availability map
  const cowork: CoworkAvailabilityMap = {};

  // Initialize with capacity data (so plans with 0 reservations still show totalSpots)
  for (const [planId, totalSpots] of Object.entries(capacity)) {
    cowork[planId] = { spotsOccupied: 0, totalSpots };
  }

  // Aggregate occupied spots from reservations
  for (const reservation of coworkReservations) {
    if (isDateInRange(date, reservation.startDate, reservation.endDate)) {
      if (!cowork[reservation.planId]) {
        cowork[reservation.planId] = { spotsOccupied: 0 };
      }
      cowork[reservation.planId].spotsOccupied += reservation.spots;
      // Preserve totalSpots from capacity if it was already set
      if (capacity[reservation.planId]) {
        cowork[reservation.planId].totalSpots = capacity[reservation.planId];
      }
    }
  }

  return { items, cowork };
}
