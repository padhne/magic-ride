// ─── authStore.ts ─────────────────────────────────────────────────────────────
// Persisted to AsyncStorage so the session survives app restarts.
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User, UserRole } from '../types';
import { useRideStore } from './rideStore';
import { useDriverStore } from './driverStore';

interface AuthState {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  demoMode: 'solo' | 'manual';

  // Actions
  setUser: (user: User) => void;
  setRole: (role: UserRole) => void;
  setDemoMode: (mode: 'solo' | 'manual') => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      role: 'rider',
      isAuthenticated: false,
      demoMode: 'solo', // default: auto-simulate the other side

      setUser: (user) => set({ user, isAuthenticated: true }),
      setRole: (role) => set({ role }),
      setDemoMode: (demoMode) => set({ demoMode }),
      logout: () => {
        // Don't leave a previous user's ride behind
        useRideStore.getState().reset();
        useDriverStore.getState().reset();
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'magicride-auth',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
