import type { DateRange } from "./dateRange";

export function DateRangePicker({ range, error, onChange }: { range: DateRange; error: string | null; onChange: (range: DateRange) => void }) {
  return (
    <div className="date-range-picker">
      <label>From<input type="date" value={range.from} onChange={(event) => onChange({ ...range, from: event.target.value })} /></label>
      <span className="date-range-arrow" aria-hidden="true">→</span>
      <label>To<input type="date" value={range.to} onChange={(event) => onChange({ ...range, to: event.target.value })} /></label>
      {error && <span className="field-error" role="alert">{error}</span>}
    </div>
  );
}
