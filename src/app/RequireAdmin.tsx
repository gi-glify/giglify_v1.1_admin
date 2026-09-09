import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { AuthErrorPage } from "../features/auth/AuthErrorPage";

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { session, isAdmin, loading, error } = useAuth();
  const location = useLocation();

  if (loading || (session && isAdmin === null && !error)) {
    return <main className="auth-page"><div className="loading-card">Checking administrator access…</div></main>;
  }
  if (error) return <AuthErrorPage />;
  if (!session) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (!isAdmin) return <Navigate to="/forbidden" replace />;
  return <>{children}</>;
}
