import { useState } from "react";

export function TaskActionDialog({ action, onCancel, onConfirm }: { action: "publish" | "reject" | "return"; onCancel: () => void; onConfirm: (note: string) => void }) {
  const [note, setNote] = useState("");
  const requiresNote = action !== "publish";
  return <div className="dialog-backdrop" role="presentation"><div className="action-dialog" role="dialog" aria-modal="true" aria-labelledby="task-action-title">
    <h3 id="task-action-title">{action === "publish" ? "Publish task" : action === "reject" ? "Reject task draft" : "Return for edits"}</h3>
    <p>{action === "publish" ? "This creates the canonical worker-facing task and question records." : "Give the requester clear feedback for the next revision."}</p>
    <label>Note{requiresNote && <span className="required-label"> required</span>}<textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder={requiresNote ? "Explain what needs attention" : "Optional publication note"} /></label>
    <div className="action-row"><button className="secondary-button" onClick={onCancel}>Cancel</button><button className={action === "reject" ? "danger-button" : "primary-button"} disabled={requiresNote && !note.trim()} onClick={() => onConfirm(note.trim())}>{action === "publish" ? "Publish task" : action === "reject" ? "Reject draft" : "Return for edits"}</button></div>
  </div></div>;
}
