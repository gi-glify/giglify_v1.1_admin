import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { getEnvError } from "../lib/env";
import { supabase } from "../lib/supabase";

interface AuthContextValue {
  session: Session | null;
  isAdmin: boolean | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function loadAdminCapability(session: Session): Promise<boolean> {
  if (!supabase) throw new Error(getEnvError() ?? "Supabase is unavailable.");
  const { data, error } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", session.user.id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data?.is_admin === true;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      const configurationError = getEnvError();
      if (configurationError) {
        if (mounted) {
          setError(configurationError);
          setLoading(false);
        }
        return;
      }
      if (!supabase) return;
      const { data, error: sessionError } = await supabase.auth.getSession();
      if (!mounted) return;
      if (sessionError) {
        setError(sessionError.message);
        setLoading(false);
        return;
      }
      setSession(data.session);
      if (!data.session) {
        setLoading(false);
        return;
      }
      try {
        setIsAdmin(await loadAdminCapability(data.session));
      } catch (capabilityError) {
        setError(capabilityError instanceof Error ? capabilityError.message : "Unable to verify admin access.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void initialize();
    if (!supabase) return () => { mounted = false; };

    const { data: listener } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      setError(null);
      setIsAdmin(null);
      setLoading(Boolean(nextSession));
      if (event === "SIGNED_OUT" || !nextSession) {
        setLoading(false);
        return;
      }
      void loadAdminCapability(nextSession)
        .then((admin) => mounted && setIsAdmin(admin))
        .catch((capabilityError) => mounted && setError(capabilityError instanceof Error ? capabilityError.message : "Unable to verify admin access."))
        .finally(() => mounted && setLoading(false));
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    session,
    isAdmin,
    loading,
    error,
    async signIn(email, password) {
      if (!supabase) return getEnvError() ?? "Supabase is unavailable.";
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      return signInError?.message ?? null;
    },
    async signOut() {
      if (supabase) await supabase.auth.signOut();
    },
  }), [error, isAdmin, loading, session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
