import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  onboardingComplete: boolean;
  intent: string | null;
  notificationPref: string | null;
}

interface Subscription {
  tier: 'free' | 'pro';
  status: string;
  currentPeriodEnd: string | null;
}

interface AuthState {
  token: string | null;
  user: User | null;
  subscription: Subscription | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  setUser: (user: User, subscription: Subscription | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      subscription: null,
      isAuthenticated: false,

      setToken: (token: string) =>
        set({ token, isAuthenticated: true }),

      setUser: (user: User, subscription: Subscription | null) =>
        set({ user, subscription }),

      logout: () =>
        set({ token: null, user: null, subscription: null, isAuthenticated: false }),
    }),
    {
      name: 'clearmind-auth',
      partialize: (state) => ({ token: state.token }),
    }
  )
);
