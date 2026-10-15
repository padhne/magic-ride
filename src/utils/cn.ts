// ─── cn() helper ──────────────────────────────────────────────────────────────
// Combines clsx (conditional classes) + tailwind-merge (deduplication)
// Usage: cn('base-class', condition && 'extra-class', props.className)

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
