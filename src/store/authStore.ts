// ─── authStore.ts ─────────────────────────────────────────────────────────────
import { create } from 'zustand';
import type { User, UserRole } from '../types';

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

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: 'rider',
  isAuthenticated: false,
  demoMode: 'solo', // default: auto-simulate the other side

  setUser: (user) => set({ user, isAuthenticated: true }),
  setRole: (role) => set({ role }),
  setDemoMode: (demoMode) => set({ demoMode }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
