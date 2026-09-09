import { Activity, ClipboardCheck, FileSearch, ListChecks, ShieldCheck, Users } from "lucide-react";

export const navigation = [
  { id: "overview", label: "Overview", path: "/overview", icon: Activity },
  { id: "requesters", label: "Requesters", path: "/requesters", icon: ShieldCheck },
  { id: "tasks", label: "Task drafts", path: "/tasks", icon: ListChecks },
  { id: "submissions", label: "Submissions & grading", path: "/submissions", icon: ClipboardCheck },
  { id: "payments", label: "Payments & payouts", path: "/payments", icon: Activity },
  { id: "users", label: "Users & support", path: "/users", icon: Users },
  { id: "audit", label: "Audit log", path: "/audit", icon: FileSearch },
] as const;
