export function TrendChart({ values, labels }: { values: number[]; labels: string[] }) {
  const max = Math.max(...values, 1);
  return <div className="trend-chart" aria-label="Operational trend chart">{values.map((value, index) => <div className="trend-column" key={`${labels[index]}-${index}`}><div className="trend-bar" style={{ height: `${Math.max(4, (value / max) * 100)}%` }} title={`${labels[index]}: ${value}`} /><small>{labels[index]}</small></div>)}</div>;
}
