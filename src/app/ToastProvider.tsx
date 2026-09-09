import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";

type ToastKind = "success" | "info" | "danger";
type Toast = { id: string; kind: ToastKind; title: string; detail?: string; persistent: boolean };
type ToastContextValue = { notify: (input: { kind?: ToastKind; title: string; detail?: string; persistent?: boolean }) => void };
const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]); const timers = useRef(new Map<string, number>());
  const dismiss = useCallback((id: string) => { const timer = timers.current.get(id); if (timer) window.clearTimeout(timer); timers.current.delete(id); setToasts((current) => current.filter((toast) => toast.id !== id)); }, []);
  const notify = useCallback((input: { kind?: ToastKind; title: string; detail?: string; persistent?: boolean }) => { const id = crypto.randomUUID(); const persistent = input.persistent ?? input.kind === "danger"; const toast = { id, kind: input.kind ?? "info", title: input.title, detail: input.detail, persistent }; setToasts((current) => [...current, toast]); if (!persistent) timers.current.set(id, window.setTimeout(() => dismiss(id), 5500)); }, [dismiss]);
  const value = useMemo(() => ({ notify }), [notify]);
  return <ToastContext.Provider value={value}>{children}<div className="toast-viewport" aria-live="polite">{toasts.map((toast) => <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />)}</div></ToastContext.Provider>;
}
function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) { const start = useRef<number | null>(null); const Icon = toast.kind === "success" ? CheckCircle2 : toast.kind === "danger" ? AlertTriangle : Info; return <article className={`toast toast-${toast.kind}`} onTouchStart={(event) => { start.current = event.changedTouches[0]?.clientX ?? null; }} onTouchEnd={(event) => { if (start.current !== null && Math.abs((event.changedTouches[0]?.clientX ?? 0) - start.current) > 60) onDismiss(toast.id); start.current = null; }}><Icon size={18} /><div className="toast-copy"><strong>{toast.title}</strong>{toast.detail && <p>{toast.detail}</p>}</div><button className="toast-dismiss" onClick={() => onDismiss(toast.id)} aria-label="Dismiss notification"><X size={16} /></button>{!toast.persistent && <span className="toast-timer" />}</article>; }
export function useToast(): ToastContextValue { const context = useContext(ToastContext); if (!context) throw new Error("useToast must be used inside ToastProvider"); return context; }
