import { useState } from "react";
import { X } from "lucide-react";
import { applyRequesterAction, type RequesterApplication } from "./requesterApi";
import { KycDocumentPreview } from "./KycDocumentPreview";

export function RequesterDetailDrawer({ application, onClose, onChanged }: { application: RequesterApplication; onClose: () => void; onChanged: () => void }) {
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function act(action: "approve" | "reject" | "request_info") {
    if ((action === "reject" || action === "request_info") && !note.trim()) { setError("Add a note before requesting a change or rejecting the application."); return; }
    setSaving(true); setError(null);
    try { await applyRequesterAction({ entityType: "requester_application", entityId: application.id, action, note: note.trim() }); onChanged(); }
    catch (nextError) { setError(nextError instanceof Error ? nextError.message : "Unable to apply action."); }
    finally { setSaving(false); }
  }

  return <div className="drawer-backdrop" role="presentation" onClick={onClose}><aside className="detail-drawer" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
    <div className="drawer-header"><div><p className="eyebrow">Requester application</p><h3>{application.legal_name}</h3></div><button className="icon-button" onClick={onClose} aria-label="Close details"><X size={18} /></button></div>
    <div className="detail-list"><div><span>Organization</span><strong>{application.organization_name || "—"}</strong></div><div><span>Phone</span><strong>{application.phone}</strong></div><div><span>Country</span><strong>{application.country}</strong></div><div><span>Status</span><strong className="capitalize">{application.status.replace("-", " ")}</strong></div><div><span>Task brief</span><p>{application.task_brief}</p></div></div>
    <KycDocumentPreview applicationId={application.id} />
    <label className="drawer-note">Admin note<textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Required for rejection or more information" /></label>
    {error && <p className="alert alert-error">{error}</p>}
    <div className="action-row"><button className="primary-button" disabled={saving} onClick={() => void act("approve")}>Approve</button><button className="secondary-button" disabled={saving} onClick={() => void act("request_info")}>Request info</button><button className="danger-button" disabled={saving} onClick={() => void act("reject")}>Reject</button></div>
  </aside></div>;
}
