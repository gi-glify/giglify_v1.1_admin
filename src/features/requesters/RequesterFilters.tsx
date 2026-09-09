export function RequesterFilters({ search, status, onSearch, onStatus }: { search: string; status: string; onSearch: (value: string) => void; onStatus: (value: string) => void }) {
  return (
    <div className="queue-filters">
      <label>Search<input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Name or organization" /></label>
      <label>Status<select value={status} onChange={(event) => onStatus(event.target.value)}><option value="">All statuses</option><option value="review-ready">Review ready</option><option value="pending_review">Pending draft review</option><option value="approved">Approved</option><option value="rejected">Rejected</option></select></label>
    </div>
  );
}
