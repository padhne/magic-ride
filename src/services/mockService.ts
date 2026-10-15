// ─── mockService.ts ───────────────────────────────────────────────────────────
// The ONLY public interface to mock data. UI imports from here, never from
// /mocks/* directly. Swap these functions out with real API calls later.

import type {
  Place,
  Driver,
  VehicleOption,
  RideHistoryItem,
  Earnings,
  EarningsEntry,
  User,
} from '../types';
import { MOCK_PLACES, SAVED_PLACES, RECENT_SEARCHES } from '../mocks/places';
import { MOCK_RIDER, getDriverByType } from '../mocks/users';
import { MOCK_RIDE_HISTORY, MOCK_EARNINGS, MOCK_EARNINGS_HISTORY } from '../mocks/rides';

// ─── Simulated network delay helper ──────────────────────────────────────────
const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// ─── Auth ──────────────────────────────────────────────────────────────────────

/** Accepts any phone number – returns a session token (fake). */
export async function sendOtp(_phone: string): Promise<{ success: boolean }> {
  await delay(800);
  return { success: true };
}

/** Only "1234" is a valid OTP. */
export async function verifyOtp(
  _phone: string,
  code: string,
): Promise<{ success: boolean; user: User }> {
  await delay(600);
  if (code !== '1234') throw new Error('Invalid OTP. Use 1234.');
  return { success: true, user: MOCK_RIDER };
}

// ─── Places / Search ──────────────────────────────────────────────────────────

/** Returns saved places (Home, Work). */
export async function getSavedPlaces(): Promise<Place[]> {
  await delay(200);
  return SAVED_PLACES;
}

/** Returns recent searches. */
export async function getRecentSearches(): Promise<Place[]> {
  await delay(150);
  return RECENT_SEARCHES;
}

/**
 * Filters mock places list by query – simulates a 500ms API call so the
 * skeleton loader is visible. Case-insensitive name + address match.
 */
export async function searchPlaces(query: string): Promise<Place[]> {
  await delay(500); // intentional: shows loading state
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return MOCK_PLACES.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.address.toLowerCase().includes(q),
  );
}

// ─── Vehicle Options / Fare ────────────────────────────────────────────────────

/**
 * Returns the three ride options with fares calculated from the given distance.
 * Fare formula lives in utils/fare.ts; this wraps it in a service call.
 */
export async function getVehicleOptions(
  distanceKm: number,
): Promise<VehicleOption[]> {
  await delay(400);
  const { calculateFare, calculateEta } = await import('../utils/fare');
  return [
    {
      type: 'bike',
      label: 'Bike',
      icon: '🏍️',
      fare: calculateFare('bike', distanceKm),
      eta: calculateEta('bike', distanceKm),
      description: 'Fast & affordable',
    },
    {
      type: 'car',
      label: 'Car',
      icon: '🚗',
      fare: calculateFare('car', distanceKm),
      eta: calculateEta('car', distanceKm),
      description: 'Comfortable ride',
    },
    {
      type: 'premium',
      label: 'Premium',
      icon: '🚙',
      fare: calculateFare('premium', distanceKm),
      eta: calculateEta('premium', distanceKm),
      description: 'Luxury experience',
    },
  ];
}

// ─── Driver ───────────────────────────────────────────────────────────────────

/** Returns the driver that matches the selected vehicle type. */
export async function findDriver(vehicleType: string): Promise<Driver> {
  await delay(300);
  return getDriverByType(vehicleType);
}

// ─── Ride History ─────────────────────────────────────────────────────────────

export async function getRideHistory(): Promise<RideHistoryItem[]> {
  await delay(600);
  return MOCK_RIDE_HISTORY;
}

export async function getRideDetail(id: string): Promise<RideHistoryItem> {
  await delay(300);
  const ride = MOCK_RIDE_HISTORY.find((r) => r.id === id);
  if (!ride) throw new Error('Ride not found');
  return ride;
}

// ─── Driver Earnings ──────────────────────────────────────────────────────────

export async function getEarnings(): Promise<Earnings> {
  await delay(400);
  return MOCK_EARNINGS;
}

export async function getEarningsHistory(): Promise<EarningsEntry[]> {
  await delay(500);
  return MOCK_EARNINGS_HISTORY;
}
