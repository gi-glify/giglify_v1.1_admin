import type { RequesterDraft } from "../requesters/requesterApi";

export function TaskPreview({ draft }: { draft: RequesterDraft }) {
  return <div className="task-preview"><div className="task-preview-meta"><span>{draft.category}</span><span>{draft.difficulty}</span><span>${Number(draft.reward).toFixed(2)}</span></div><h4>{draft.title}</h4><p>{draft.context}</p><ol>{draft.questions.map((question, index) => <li key={`${draft.id}-${index}`}>{question.question_text || "Untitled question"}</li>)}</ol></div>;
}
