import { useState } from "react";
import { Activity, ArrowUpRight, CheckCircle2, Cog, LogOut, Sparkles, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../app/AuthProvider";

const milestones = [
  { label: "Operations protected", detail: "Your admin access remains secure.", complete: true },
  { label: "Console upgrade", detail: "We are polishing the next release.", complete: false },
  { label: "Workspace returns", detail: "The admin console will be back soon.", complete: false },
];

export function UnderDevelopmentPage() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);

  async function handleSignOut() {
    setSigningOut(true);
    setSignOutError(null);
    try {
      await signOut();
      navigate("/login", { replace: true });
    } catch {
      setSignOutError("We could not sign you out. Please try again.");
      setSigningOut(false);
    }
  }

  return (
    <main className="admin-underdev-page">
      <div className="admin-underdev-orb admin-underdev-orb-one" aria-hidden="true" />
      <div className="admin-underdev-orb admin-underdev-orb-two" aria-hidden="true" />
      <div className="admin-underdev-shell">
        <header className="admin-underdev-header">
          <div className="admin-underdev-brand">
            <img src="/giglify.svg" alt="Giglify logo" />
            <div><p>GIGLIFY</p><span>Admin console</span></div>
          </div>
          <span className="admin-underdev-status"><span /> Private build mode</span>
        </header>

        <section className="admin-underdev-hero">
          <div>
            <div className="admin-underdev-eyebrow"><Wrench size={15} aria-hidden="true" /> Operations are being upgraded</div>
            <h1>The console is getting sharper.</h1>
            <p className="admin-underdev-lead">We are making a few important changes behind the scenes. Your admin workspace and operational data remain safe while we prepare the next release.</p>
            <div className="admin-underdev-actions">
              <button className="primary-button" type="button" onClick={handleSignOut} disabled={signingOut}><LogOut size={17} aria-hidden="true" /> {signingOut ? "Signing out…" : "Sign out"}</button>
              <span><Sparkles size={15} aria-hidden="true" /> Thank you for your patience.</span>
            </div>
            <p className="admin-underdev-owner-note"><strong>Site owner?</strong> If restoration is urgent, contact the developer directly to discuss expedited logistics. Under the agreed service terms, restoration timelines may depend on resolving outstanding payment or unanswered project communication.</p>
            {signOutError && <p className="admin-underdev-error" role="alert">{signOutError}</p>}
          </div>
          <div className="admin-underdev-visual" aria-label="Admin console upgrade status">
            <div className="admin-underdev-glow" aria-hidden="true" />
            <div className="admin-underdev-gear-system" aria-hidden="true">
              <Cog className="admin-underdev-gear admin-underdev-gear-large" size={190} strokeWidth={1} />
              <Cog className="admin-underdev-gear admin-underdev-gear-mid" size={125} strokeWidth={1.2} />
              <Cog className="admin-underdev-gear admin-underdev-gear-small" size={78} strokeWidth={1.4} />
              <span className="admin-underdev-gear-core" />
            </div>
            <div className="admin-underdev-console">
              <div className="admin-underdev-console-top"><span>GIGLIFY / OPERATIONS</span><Activity size={15} aria-hidden="true" /></div>
              <strong>Console upgrade</strong>
              <div className="admin-underdev-console-bars"><span /><span /><span /></div>
              <div className="admin-underdev-console-grid"><div><small>MODE</small><b>UPGRADING</b></div><div><small>ACCESS</small><b>SECURE</b></div></div>
              <div className="admin-underdev-console-foot"><span /> System status is being refreshed</div>
            </div>
            <div className="admin-underdev-tag"><ArrowUpRight size={17} aria-hidden="true" /> Building what’s next</div>
          </div>
        </section>

        <section className="admin-underdev-milestones" aria-labelledby="admin-underdev-heading">
          <div className="admin-underdev-section-heading"><div><p>YOUR WORKSPACE</p><h2 id="admin-underdev-heading">Everything is in hand.</h2></div><span>We’ll keep the experience focused while the upgrade is underway.</span></div>
          <div className="admin-underdev-cards">{milestones.map((milestone) => <article key={milestone.label}><div className={milestone.complete ? "is-complete" : ""}><CheckCircle2 size={18} aria-hidden="true" /></div><div><h3>{milestone.label}</h3><p>{milestone.detail}</p></div></article>)}</div>
        </section>
        <footer className="admin-underdev-footer"><span>© {new Date().getFullYear()} Giglify</span><span>Operations, with care.</span></footer>
      </div>
    </main>
  );
}
