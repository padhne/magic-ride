import { useEffect, useRef, useState } from 'react';

interface CountdownOptions {
  from: number;       // starting seconds
  enabled?: boolean;  // start/stop externally
  onExpire?: () => void;
}

interface CountdownResult {
  remaining: number;
  isExpired: boolean;
  progress: number; // 0–1 (for animated rings)
  reset: () => void;
}

/**
 * Countdown timer used by the driver's incoming request modal (15s) and
 * the rider's search timeout (60s). Calls onExpire when it hits zero.
 */
export function useCountdown({ from, enabled = true, onExpire }: CountdownOptions): CountdownResult {
  const [remaining, setRemaining] = useState(from);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    if (!enabled) return;
    setRemaining(from); // reset when re-enabled

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onExpireRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [from, enabled]);

  return {
    remaining,
    isExpired: remaining === 0,
    progress: remaining / from, // 1 = full, 0 = expired
    reset: () => setRemaining(from),
  };
}
