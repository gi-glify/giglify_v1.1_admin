export interface PublicEnv {
  supabaseUrl: string;
  supabaseAnonKey: string;
  adminAppUrl: string;
}

export function readPublicEnv(): PublicEnv {
  return {
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL ?? "",
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ?? "",
    adminAppUrl: import.meta.env.VITE_ADMIN_APP_URL ?? window.location.origin,
  };
}

export function getEnvError(env = readPublicEnv()): string | null {
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    return "The admin app is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY before signing in.";
  }
  return null;
}
