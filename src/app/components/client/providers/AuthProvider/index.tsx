"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { resolveDataSourceMode } from "@/api/connection/http";
import { getAuthSession, logoutAuth } from "@/api/services/auth";
import type { AuthSessionDto, AuthUserDto } from "@/api/schemas/authSession";

type AuthStatus = "loading" | "guest" | "authenticated";

type AuthContextValue = {
  status: AuthStatus;
  isLoading: boolean;
  isGuest: boolean;
  isAuthenticated: boolean;
  isPremium: boolean;
  user: AuthUserDto | null;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const getInitialGuestState = (): AuthContextValue => ({
  status: "guest",
  isLoading: false,
  isGuest: true,
  isAuthenticated: false,
  isPremium: false,
  user: null,
  refresh: async () => {},
  signOut: async () => {},
});

const resolveIsPremium = (session: AuthSessionDto) => {
  const user = session.user;
  if (!session.authenticated || !user) return false;

  if (typeof user.isPremium === "boolean") return user.isPremium;

  const plan = `${user.plan || ""} ${user.role || ""}`.toLowerCase();
  return /premium|pro|subscriber/.test(plan);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dataSourceMode = resolveDataSourceMode();
  const [status, setStatus] = useState<AuthStatus>(
    dataSourceMode === "mock" ? "guest" : "loading",
  );
  const [user, setUser] = useState<AuthUserDto | null>(null);

  const hydrateSession = useCallback(async () => {
    if (dataSourceMode === "mock") {
      setStatus("guest");
      setUser(null);
      return;
    }

    setStatus("loading");

    try {
      const session = await getAuthSession();

      if (session.authenticated && session.user) {
        setUser(session.user);
        setStatus("authenticated");
        return;
      }

      setUser(null);
      setStatus("guest");
    } catch {
      setUser(null);
      setStatus("guest");
    }
  }, [dataSourceMode]);

  const signOut = useCallback(async () => {
    try {
      await logoutAuth();
    } finally {
      setUser(null);
      setStatus("guest");
    }
  }, []);

  useEffect(() => {
    void hydrateSession();
  }, [hydrateSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      isLoading: status === "loading",
      isGuest: status === "guest",
      isAuthenticated: status === "authenticated",
      isPremium: resolveIsPremium({ authenticated: status === "authenticated", user }),
      user,
      refresh: hydrateSession,
      signOut,
    }),
    [hydrateSession, signOut, status, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    return getInitialGuestState();
  }

  return context;
};
