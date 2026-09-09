export interface DateRange {
  from: string;
  to: string;
}

const DAY_MS = 24 * 60 * 60 * 1000;

function formatUtcDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function getDefaultDateRange(now = new Date()): DateRange {
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
  const start = new Date(end.getTime() - 7 * DAY_MS);
  return { from: formatUtcDate(start), to: formatUtcDate(end) };
}

export function validateDateRange(range: DateRange): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(range.from) || !/^\d{4}-\d{2}-\d{2}$/.test(range.to)) return "Enter valid start and end dates.";
  const from = Date.parse(`${range.from}T00:00:00Z`);
  const to = Date.parse(`${range.to}T00:00:00Z`);
  if (!Number.isFinite(from) || !Number.isFinite(to)) return "Enter valid start and end dates.";
  if (to <= from) return "Choose an end date after the start date.";
  if ((to - from) / DAY_MS > 31) return "Choose a date range of 31 days or less.";
  return null;
}
