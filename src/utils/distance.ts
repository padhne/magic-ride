import type { Coordinate } from '../types';

// ─── Haversine distance formula ───────────────────────────────────────────────
const EARTH_RADIUS_KM = 6371;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Returns great-circle distance between two coords in km. */
export function haversineDistance(a: Coordinate, b: Coordinate): number {
  const dLat = toRad(b.latitude  - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const h =
    sinDLat * sinDLat +
    Math.cos(toRad(a.latitude)) *
      Math.cos(toRad(b.latitude)) *
      sinDLon * sinDLon;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

/** Dummy distance: returns a fixed 5 km if either coord is null (for UI preview). */
export function safeDistance(a: Coordinate | null, b: Coordinate | null): number {
  if (!a || !b) return 5;
  return Math.round(haversineDistance(a, b) * 10) / 10; // 1 decimal
}
