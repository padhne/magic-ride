import type { VehicleType } from '../types';

// ─── Fare calculation (Nepal NPR) ─────────────────────────────────────────────
// Bike: base Rs 50, Rs 20/km
// Car/Taxi: base Rs 120, Rs 45/km
// Premium/EV: base Rs 250, Rs 75/km

const FARE_CONFIG: Record<VehicleType, { base: number; perKm: number }> = {
  bike:    { base: 50,  perKm: 20 },
  car:     { base: 120, perKm: 45 },
  premium: { base: 250, perKm: 75 },
};

// Average speed in km/min (bike maneuvers faster through KTM traffic)
const SPEED_CONFIG: Record<VehicleType, number> = {
  bike:    0.5,   // ~30 km/h
  car:     0.35,  // ~21 km/h
  premium: 0.4,   // ~24 km/h
};

/** Returns fare in NPR, rounded to nearest whole rupee. */
export function calculateFare(type: VehicleType, distanceKm: number): number {
  const { base, perKm } = FARE_CONFIG[type];
  return Math.round(base + perKm * distanceKm);
}

/** Returns ETA in minutes, rounded to nearest integer. */
export function calculateEta(type: VehicleType, distanceKm: number): number {
  return Math.max(1, Math.round(distanceKm / SPEED_CONFIG[type]));
}
