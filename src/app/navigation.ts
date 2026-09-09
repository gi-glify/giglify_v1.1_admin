import { Activity, ClipboardCheck, DollarSign, FileSearch, HandIcon, ListChecks, ShieldCheck, Users } from "lucide-react";
import type { LucideProps } from "lucide-react";
import { createElement } from "react";

const PaymentIcon = ({ size = 24, ...props }: LucideProps) => { const numericSize = typeof size === "number" ? size : 24; return createElement("span", { style: { position: "relative", display: "inline-flex", width: numericSize, height: numericSize } }, createElement(HandIcon, { size, ...props }), createElement(DollarSign, { size: numericSize * 0.55, style: { position: "absolute", right: -2, top: -4, background: "var(--bg-elevated)", borderRadius: "50%" } })); };

export const navigation = [
  { id: "overview", label: "Overview", path: "/overview", icon: Activity },
  { id: "requesters", label: "Requesters", path: "/requesters", icon: ShieldCheck },
  { id: "tasks", label: "Task drafts", path: "/tasks", icon: ListChecks },
  { id: "submissions", label: "Submissions & grading", path: "/submissions", icon: ClipboardCheck },
  { id: "payments", label: "Payments & payouts", path: "/payments", icon: PaymentIcon },
  { id: "users", label: "Users & support", path: "/users", icon: Users },
  { id: "audit", label: "Audit log", path: "/audit", icon: FileSearch },
] as const;
