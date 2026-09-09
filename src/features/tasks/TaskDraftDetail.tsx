import { useState } from "react";
import { TaskActionDialog } from "./TaskActionDialog";
import { TaskPreview } from "./TaskPreview";
import { applyRequesterAction, publishRequesterTask, type RequesterDraft } from "../requesters/requesterApi";

export function TaskDraftDetail({ draft, onChanged }: { draft: RequesterDraft; onChanged: () => void }) {
  const [action, setAction] = useState<"publish" | "reject" | "return" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function confirm(note: string) {
    if (!action) return;
    setSaving(true); setError(null);
    try {
      if (action === "publish") await publishRequesterTask({ draftId: draft.id, note });
      else await applyRequesterAction({ entityType: "requester_task", entityId: draft.id, action: action === "reject" ? "reject" : "request_info", note });
      setAction(null); onChanged();
    } catch (nextError) { setError(nextError instanceof Error ? nextError.message : "Unable to apply task action."); }
    finally { setSaving(false); }
  }

  return <article className="draft-card"><div className="page-heading"><div><p className="eyebrow">Task draft</p><h4>{draft.title}</h4><p className="draft-meta">{draft.category} · {draft.difficulty} · ${Number(draft.reward).toFixed(2)} · {new Date(draft.created_at).toLocaleDateString()}</p></div><span className="status-pill">{draft.status.replace("_", " ")}</span></div><TaskPreview draft={draft} />{error && <div className="alert alert-error">{error}</div>}<div className="action-row"><button className="primary-button" disabled={saving} onClick={() => setAction("publish")}>Approve & publish</button><button className="secondary-button" disabled={saving} onClick={() => setAction("return")}>Return for edits</button><button className="danger-button" disabled={saving} onClick={() => setAction("reject")}>Reject</button></div>{action && <TaskActionDialog action={action} onCancel={() => setAction(null)} onConfirm={(note) => void confirm(note)} />}</article>;
}
