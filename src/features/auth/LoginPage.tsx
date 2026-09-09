import { FormEvent, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../app/AuthProvider";

export function LoginPage() {
  const { session, isAdmin, loading, error: authError, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && session && isAdmin === true) return <Navigate to="/overview" replace />;
  if (!loading && session && isAdmin === false) return <Navigate to="/forbidden" replace />;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const signInError = await signIn(email.trim(), password);
    setSubmitting(false);
    if (signInError) {
      setError(signInError);
      return;
    }
    navigate((location.state as { from?: string } | null)?.from ?? "/overview", { replace: true });
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <img src="/giglify.svg" alt="Giglify logo" className="auth-logo" data-aos="zoom-in" />
        <p className="eyebrow">Internal operations</p>
        <h1>Sign in to Giglify Admin</h1>
        <p className="auth-copy">Use an approved Giglify administrator account. Access is checked against the admin profile before any operational data loads.</p>
        {(error || authError) && <div className="alert alert-error">{error ?? authError}</div>}
        <form onSubmit={submit} className="auth-form" data-aos="fade-up">
          <label>Email<input autoComplete="email" required type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
          <label>Password<input autoComplete="current-password" required type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          <button className="primary-button" disabled={submitting || loading}>{submitting ? "Signing in…" : "Sign in"}</button>
        </form>
      </section>
    </main>
  );
}
