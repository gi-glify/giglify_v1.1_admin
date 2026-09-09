import { Loader2, RefreshCw } from "lucide-react";

export function LoadingState({ label = "Loading…" }: { label?: string }) { return <div className="loading-card overview-loading"><Loader2 className="spin" size={18} /> {label}</div>; }
export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) { return <div className="alert alert-error" role="alert"><span>{message}</span><button className="text-button" onClick={onRetry}><RefreshCw size={14} /> Retry</button></div>; }
export function EmptyState({ title, detail }: { title: string; detail: string }) { return <div className="empty-state"><h3>{title}</h3><p>{detail}</p></div>; }
export function Pagination({ page, hasNext, onChange }: { page: number; hasNext: boolean; onChange: (page: number) => void }) { return <div className="pagination"><button className="secondary-button" disabled={page === 0} onClick={() => onChange(page - 1)}>Previous</button><span>Page {page + 1}</span><button className="secondary-button" disabled={!hasNext} onClick={() => onChange(page + 1)}>Next</button></div>; }
