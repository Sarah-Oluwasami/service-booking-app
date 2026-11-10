import { create } from 'zustand';

import { User } from '../types';

interface AuthState {
  user: User | null;
  isSubmitting: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Turns "jane.doe@mail.com" into "Jane Doe" for the greeting. */
function nameFromEmail(email: string): string {
  const local = email.split('@')[0] ?? '';
  return (
    local
      .split(/[._-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ') || 'there'
  );
}

/**
 * Mock authentication: any valid email and password is accepted after a short
 * delay that simulates a network request. Input validation happens in the
 * Login screen with Zod before this is called.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isSubmitting: false,

  login: async (email) => {
    set({ isSubmitting: true });
    await wait(800);
    set({
      user: { email: email.trim().toLowerCase(), name: nameFromEmail(email.trim()) },
      isSubmitting: false,
    });
  },

  logout: () => set({ user: null }),
}));
