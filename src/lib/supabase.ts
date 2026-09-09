import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getEnvError, readPublicEnv } from "./env";

export function createBrowserSupabaseClient(): SupabaseClient | null {
  const env = readPublicEnv();
  if (getEnvError(env)) return null;
  return createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
}

export const supabase = createBrowserSupabaseClient();
