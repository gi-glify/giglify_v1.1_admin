import { ArrowUpRight } from "lucide-react";

export function MetricCard({ label, value, detail, href, onClick }: { label: string; value: string; detail: string; href: string; onClick: (href: string) => void }) {
  return (
    <button className="metric-card" onClick={() => onClick(href)}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail} <ArrowUpRight size={13} aria-hidden="true" /></small>
    </button>
  );
}
