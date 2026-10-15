/** Format currency as "NPR 150" */
export function formatFare(amount: number): string {
  return `NPR ${Math.round(amount).toLocaleString('en-US')}`;
}

/** Format duration: "5 min" or "1 h 5 min" */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h} h ${m} min` : `${h} h`;
}

/** Format distance: "3.2 km" */
export function formatDistance(km: number): string {
  return `${km.toFixed(1)} km`;
}

/** Format date to "Oct 14" */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/** Format countdown seconds to "0:12" */
export function formatCountdown(seconds: number): string {
  const s = Math.max(0, seconds);
  return `0:${String(s).padStart(2, '0')}`;
}

/** Generate a random 4-digit OTP string */
export function generateOtp(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

/** Generate a unique ride ID */
export function generateRideId(): string {
  return `ride-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
