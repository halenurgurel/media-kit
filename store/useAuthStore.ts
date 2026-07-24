import { create } from "zustand";
import type { User as FirebaseUser } from "firebase/auth";

interface AuthState {
  user: FirebaseUser | null;
  loading: boolean;
  setUser: (user: FirebaseUser | null) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user, loading: false }),
  clearUser: () => set({ user: null, loading: false }),
}));
