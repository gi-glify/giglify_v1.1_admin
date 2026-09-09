import { useState } from "react";

type View = "overview" | "requesters" | "tasks" | "submissions" | "payments" | "users" | "audit";

const views: Array<{ id: View; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "requesters", label: "Requesters" },
  { id: "tasks", label: "Task drafts" },
  { id: "submissions", label: "Submissions & grading" },
  { id: "payments", label: "Payments & payouts" },
  { id: "users", label: "Users & support" },
  { id: "audit", label: "Audit log" },
];

const metrics = [
  ["Pending requesters", "—", "Review queue"],
  ["Drafts awaiting review", "—", "Task queue"],
  ["Payouts awaiting action", "—", "Finance queue"],
  ["Grading failures", "—", "Retry queue"],
];

export default function App() {
  const [view, setView] = useState<View>("overview");

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-mark">G</div>
        <div>
          <p className="eyebrow">Giglify</p>
          <h1>Admin console</h1>
        </div>
        <nav aria-label="Admin navigation">
          {views.map((item) => (
            <button
              className={view === item.id ? "nav-item active" : "nav-item"}
              key={item.id}
              onClick={() => setView(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <span className="status-dot" /> Backend connection pending
        </div>
      </aside>

      <main className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Operations</p>
            <h2>{views.find((item) => item.id === view)?.label}</h2>
          </div>
          <div className="admin-chip">Admin auth gate pending</div>
        </header>

        {view === "overview" ? (
          <>
            <section className="hero-card">
              <div>
                <p className="eyebrow">Today’s command centre</p>
                <h3>Keep the work moving.</h3>
                <p>Connect the Supabase auth gate and audited reporting functions to populate this dashboard.</p>
              </div>
              <div className="date-chip">Date range · Pending</div>
            </section>
            <section className="metric-grid" aria-label="Operational metrics">
              {metrics.map(([label, value, link]) => (
                <button className="metric-card" key={label} onClick={() => setView("requesters")}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                  <small>{link} →</small>
                </button>
              ))}
            </section>
          </>
        ) : (
          <section className="empty-state">
            <p className="eyebrow">Feature scaffold</p>
            <h3>{views.find((item) => item.id === view)?.label}</h3>
            <p>This queue is ready for its typed Supabase queries, permission checks, audited actions, and loading/error states.</p>
          </section>
        )}
      </main>
    </div>
  );
}
