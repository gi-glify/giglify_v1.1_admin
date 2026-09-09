import { useState } from "react";
import { X } from "lucide-react";

export function ReviewActionDialog({ action, onClose, onConfirm, busy }: { action: "manual_review" | "approve" | "reject"; onClose: () => void; onConfirm: (note: string, reward?: number) => void; busy: boolean }) {
  const [note, setNote] = useState("");
  const [reward, setReward] = useState("");
  const needsNote = action !== "approve";
  return <div className="dialog-backdrop"><div className="action-dialog"><div className="drawer-header"><div><p className="eyebrow">Submission action</p><h3>{action === "manual_review" ? "Send to manual review" : action === "approve" ? "Approve submission" : "Reject submission"}</h3></div><button className="icon-button" onClick={onClose}><X size={18} /></button></div><p>{action === "approve" ? "This applies the trusted manual decision and reward amount." : "Record the reason so the grading trail remains reviewable."}</p>{action === "approve" && <label>Approved reward<input type="number" min="0" step="0.01" value={reward} onChange={(event) => setReward(event.target.value)} /></label>}<label>{needsNote ? "Note (required)" : "Note"}<textarea value={note} onChange={(event) => setNote(event.target.value)} /></label><div className="action-row"><button className="secondary-button" onClick={onClose}>Cancel</button><button className={action === "reject" ? "danger-button" : "primary-button"} disabled={busy || (needsNote && !note.trim())} onClick={() => onConfirm(note.trim(), reward ? Number(reward) : undefined)}>Confirm</button></div></div></div>;
}
