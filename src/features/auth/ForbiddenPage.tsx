import { useAuth } from "../../app/AuthProvider";

export function ForbiddenPage() {
  const { signOut, session } = useAuth();
  return (
    <main className="auth-page">
      <section className="auth-card">
        <img src="/giglify.svg" alt="Giglify logo" className="auth-logo" />
        <p className="eyebrow">Access restricted</p>
        <h1>This account is not an admin</h1>
        <p className="auth-copy">{session?.user.email} is authenticated, but it does not have the Giglify admin capability.</p>
        <button className="secondary-button" onClick={() => void signOut()}>Sign out</button>
      </section>
    </main>
  );
}
