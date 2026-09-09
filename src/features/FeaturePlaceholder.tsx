export function FeaturePlaceholder({ title }: { title: string }) {
  return (
    <section className="empty-state">
      <p className="eyebrow">Feature scaffold</p>
      <h3>{title}</h3>
      <p>This queue is protected by the admin gate and ready for its typed Supabase queries, permission checks, audited actions, and loading/error states.</p>
    </section>
  );
}
