const metrics = [
  ["Pending requesters", "—", "Requesters queue"],
  ["Drafts awaiting review", "—", "Task queue"],
  ["Payouts awaiting action", "—", "Finance queue"],
  ["Grading failures", "—", "Retry queue"],
];

export function OverviewPage() {
  return (
    <>
      <section className="hero-card" data-aos="fade-up">
        <div>
          <p className="eyebrow">Today’s command centre</p>
          <h3>Keep the work moving.</h3>
          <p>Admin authentication is connected. Operational metrics will populate after the audited reporting functions are added in Chunk 3.</p>
        </div>
        <div className="date-chip">Date range · Coming with metrics</div>
      </section>
      <section className="metric-grid" aria-label="Operational metrics" data-aos="fade-up" data-aos-delay="60">
        {metrics.map(([label, value, link]) => (
          <div className="metric-card" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <small>{link} →</small>
          </div>
        ))}
      </section>
    </>
  );
}
