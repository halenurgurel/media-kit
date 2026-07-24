"use client";

import { useEffect, type ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/store/useAuthStore";

const SESSION_COOKIE = "__session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Middleware can only see cookies, not Firebase's client-side auth
        // state, so mirror sign-in status into a cookie it can check.
        const token = await user.getIdToken();
        document.cookie = `${SESSION_COOKIE}=${token}; path=/; max-age=3600; SameSite=Lax`;
        setUser(user);
      } else {
        document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
        clearUser();
      }
    });

    return unsubscribe;
  }, [setUser, clearUser]);

  return <>{children}</>;
}
