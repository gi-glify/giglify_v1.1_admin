import { useAuth } from "../../app/AuthProvider";

export function AuthErrorPage() {
  const { error } = useAuth();
  return (
    <main className="auth-page">
      <section className="auth-card">
        <img src="/giglify.svg" alt="Giglify logo" className="auth-logo" />
        <p className="eyebrow">Configuration error</p>
        <h1>Admin access is unavailable</h1>
        <p className="auth-copy">{error ?? "The admin authentication service could not be reached."}</p>
      </section>
    </main>
  );
}
