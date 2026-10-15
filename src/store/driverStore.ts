// ─── driverStore.ts ───────────────────────────────────────────────────────────
import { create } from 'zustand';
import type { RideRequest } from '../types';

interface DriverState {
  isOnline: boolean;
  pendingRequest: RideRequest | null;
  activeRide: RideRequest | null;
  todayEarnings: number;
  todayTrips: number;

  // Actions
  setOnline: (online: boolean) => void;
  setPendingRequest: (ride: RideRequest | null) => void;
  setActiveRide: (ride: RideRequest | null) => void;
  addEarnings: (amount: number) => void;
  reset: () => void;
}

export const useDriverStore = create<DriverState>((set) => ({
  isOnline: false,
  pendingRequest: null,
  activeRide: null,
  todayEarnings: 87.50, // pre-seeded from mock earnings
  todayTrips: 6,

  setOnline: (online) => set({ isOnline: online }),
  setPendingRequest: (ride) => set({ pendingRequest: ride }),
  setActiveRide: (ride) => set({ activeRide: ride }),
  addEarnings: (amount) =>
    set((s) => ({
      todayEarnings: s.todayEarnings + amount,
      todayTrips: s.todayTrips + 1,
    })),
  reset: () =>
    set({ pendingRequest: null, activeRide: null }),
}));
