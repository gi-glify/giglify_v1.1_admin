export type AccessRoute = "login" | "checking-admin" | "forbidden" | "overview" | "error";

export interface AccessInput {
  session: { user: { id: string } } | null;
  isAdmin: boolean | null;
  error: string | null;
}

export interface AccessState {
  route: AccessRoute;
  message?: string;
}

export function resolveAccessState({ session, isAdmin, error }: AccessInput): AccessState {
  if (!session) return { route: "login" };
  if (error) return { route: "error", message: error };
  if (isAdmin === null) return { route: "checking-admin" };
  return isAdmin ? { route: "overview" } : { route: "forbidden" };
}
