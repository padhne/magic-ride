// ─── rideStore.ts ─────────────────────────────────────────────────────────────
// Implements the ride state machine with guarded transitions.
// Valid: idle → searching → requested → accepted → driver_arriving
//        → arrived → in_progress → completed | cancelled

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RideStatus, RideRequest, Place, VehicleType, PaymentMethod, Coordinate, Driver } from '../types';

// All valid forward transitions
const ALLOWED_TRANSITIONS: Record<RideStatus, RideStatus[]> = {
  idle:            ['searching'],
  searching:       ['requested', 'cancelled'],
  requested:       ['accepted', 'cancelled'],
  accepted:        ['driver_arriving', 'cancelled'],
  driver_arriving: ['arrived', 'cancelled'],
  arrived:         ['in_progress', 'cancelled'],
  in_progress:     ['completed', 'cancelled'],
  completed:       ['idle'],
  cancelled:       ['idle'],
};

interface RideState {
  status: RideStatus;
  currentRide: RideRequest | null;
  assignedDriver: Driver | null;
  driverLocation: Coordinate | null;

  // Rider inputs (collected before requesting)
  pickupPlace: Place | null;
  destinationPlace: Place | null;
  selectedVehicleType: VehicleType;
  selectedPayment: PaymentMethod;

  // Actions
  setPickup: (place: Place) => void;
  setDestination: (place: Place) => void;
  setVehicleType: (type: VehicleType) => void;
  setPayment: (method: PaymentMethod) => void;
  transition: (to: RideStatus) => boolean;       // returns false if invalid
  setCurrentRide: (ride: RideRequest | null) => void;
  setAssignedDriver: (driver: Driver | null) => void;
  setDriverLocation: (coord: Coordinate) => void;
  reset: () => void;
}

const initialState = {
  status: 'idle' as RideStatus,
  currentRide: null,
  assignedDriver: null,
  driverLocation: null,
  pickupPlace: null,
  destinationPlace: null,
  selectedVehicleType: 'car' as VehicleType,
  selectedPayment: 'cash' as PaymentMethod,
};

export const useRideStore = create<RideState>()(persist((set, get) => ({
  ...initialState,

  setPickup: (place) => set({ pickupPlace: place }),
  setDestination: (place) => set({ destinationPlace: place }),
  setVehicleType: (type) => set({ selectedVehicleType: type }),
  setPayment: (method) => set({ selectedPayment: method }),

  /** Guards against invalid state machine transitions. */
  transition: (to) => {
    const current = get().status;
    const allowed = ALLOWED_TRANSITIONS[current];
    if (!allowed.includes(to)) {
      if (__DEV__) console.warn(`[RideStore] Invalid transition: ${current} → ${to}`);
      return false;
    }
    set({ status: to });
    return true;
  },

  setCurrentRide: (ride) => set({ currentRide: ride }),
  setAssignedDriver: (driver) => set({ assignedDriver: driver }),
  setDriverLocation: (coord) => set({ driverLocation: coord }),

  reset: () => set(initialState),
}), {
  // Persisted so an active ride survives the app being closed
  name: 'magicride-ride',
  storage: createJSONStorage(() => AsyncStorage),
  partialize: ({ driverLocation, ...rest }) => rest,
}));
