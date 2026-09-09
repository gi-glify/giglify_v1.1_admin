import { useCallback, useEffect, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { AdminApiError } from "../../lib/errors";
import { fetchRequesterQueue, type RequesterDraft } from "../requesters/requesterApi";
import { TaskDraftDetail } from "./TaskDraftDetail";

export function TaskDraftQueuePage() {
  const [drafts, setDrafts] = useState<RequesterDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const load = useCallback(() => { setLoading(true); setError(null); fetchRequesterQueue({ status: "pending_review" }).then((result) => setDrafts(result.drafts)).catch((nextError: unknown) => setError(nextError instanceof AdminApiError ? nextError.message : "Unable to load task drafts.")).finally(() => setLoading(false)); }, []);
  useEffect(() => { load(); }, [load]);
  return <section className="queue-page" data-aos="fade-up"><div className="page-heading"><div><p className="eyebrow">Task catalog</p><h3>Drafts awaiting review</h3><p>Preview the worker-facing version and publish only through the audited server workflow.</p></div><button className="secondary-button" onClick={load}><RefreshCw size={15} /> Refresh</button></div>{error && <div className="alert alert-error">{error}</div>}{loading && <div className="loading-card overview-loading"><Loader2 className="spin" size={18} /> Loading task drafts…</div>}{!loading && !error && drafts.length === 0 && <div className="empty-state"><h3>No drafts awaiting review</h3><p>Approved and rejected drafts are available through future history filters.</p></div>}<div className="draft-list">{drafts.map((draft) => <TaskDraftDetail draft={draft} key={draft.id} onChanged={load} />)}</div></section>;
}
