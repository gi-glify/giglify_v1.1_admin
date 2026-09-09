import { useCallback, useEffect, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { AdminApiError } from "../../lib/errors";
import { RequesterFilters } from "./RequesterFilters";
import { RequesterDetailDrawer } from "./RequesterDetailDrawer";
import { fetchRequesterQueue, type RequesterApplication, type RequesterQueueResponse } from "./requesterApi";
import { readQueryValue, writeQueryValues } from "../../lib/queryState";

export function RequesterQueuePage() {
  const [search, setSearch] = useState(() => readQueryValue(new URLSearchParams(window.location.search), "search", ""));
  const [status, setStatus] = useState(() => readQueryValue(new URLSearchParams(window.location.search), "status", "review-ready"));
  const [queue, setQueue] = useState<RequesterQueueResponse | null>(null);
  const [selected, setSelected] = useState<RequesterApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true); setError(null);
    fetchRequesterQueue({ search, status })
      .then(setQueue)
      .catch((nextError: unknown) => setError(nextError instanceof AdminApiError ? nextError.message : "Unable to load requester queue."))
      .finally(() => setLoading(false));
  }, [search, status]);

  useEffect(() => { writeQueryValues({ search, status }); const timer = window.setTimeout(load, 250); return () => window.clearTimeout(timer); }, [load, search, status]);

  return <section className="queue-page" data-aos="fade-up">
    <div className="page-heading"><div><p className="eyebrow">Review queue</p><h3>Requester applications</h3><p>Inspect approved-safe identity fields and open private documents through expiring signed URLs.</p></div><button className="secondary-button" onClick={load}><RefreshCw size={15} /> Refresh</button></div>
    <RequesterFilters search={search} status={status} onSearch={setSearch} onStatus={setStatus} />
    {error && <div className="alert alert-error">{error}</div>}
    {loading && <div className="loading-card overview-loading"><Loader2 className="spin" size={18} /> Loading requester queue…</div>}
    {!loading && !error && queue?.applications.length === 0 && <div className="empty-state"><h3>No applications found</h3><p>Try another status or search term.</p></div>}
    <div className="queue-list">{queue?.applications.map((application) => <button className="queue-row" key={application.id} onClick={() => setSelected(application)}><div><strong>{application.legal_name}</strong><span>{application.organization_name || "Individual requester"} · {application.country}</span></div><div><span className="status-pill">{application.status.replace("-", " ")}</span><small>{new Date(application.submitted_at).toLocaleDateString()}</small></div></button>)}</div>
    {selected && <RequesterDetailDrawer application={selected} onClose={() => setSelected(null)} onChanged={() => { setSelected(null); load(); }} />}
  </section>;
}
