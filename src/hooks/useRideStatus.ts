import { useRideStore } from '../store/rideStore';
import type { RideStatus } from '../types';

/**
 * Convenience hook: returns current ride status and booleans for each state.
 * Prevents components from re-rendering on unrelated store changes.
 */
export function useRideStatus() {
  const status = useRideStore((s) => s.status);

  return {
    status,
    isIdle:          status === 'idle',
    isSearching:     status === 'searching',
    isRequested:     status === 'requested',
    isAccepted:      status === 'accepted',
    isDriverArriving:status === 'driver_arriving',
    isArrived:       status === 'arrived',
    isInProgress:    status === 'in_progress',
    isCompleted:     status === 'completed',
    isCancelled:     status === 'cancelled',
    isActive: (
      status !== 'idle' &&
      status !== 'completed' &&
      status !== 'cancelled'
    ),
  };
}
