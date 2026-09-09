import { invokeAdminFunction } from "../../lib/adminApi";

export type UserSummary = { id: string; first_name: string | null; last_name: string | null; email: string | null; country: string | null; subscription: string; profile_completion_pct: number; payment_verification_status: string; is_admin: boolean; created_at: string };
export type Appeal = { id: string; user_id: string; reason: string; status: string; admin_note: string | null; created_at: string };
export type ContactMessage = { id: string; user_id: string | null; name: string; email: string; message: string; status: string; created_at: string };
export function fetchSupport<T>(queue: "users" | "appeals" | "messages", input: Record<string, unknown> = {}) { return invokeAdminFunction<{ items: T[]; count: number }>("admin-support-queue", { action: "list", queue, ...input }); }
export function resolveAppeal(entityId: string, decision: "approve" | "reject", note: string) { return invokeAdminFunction("admin-support-queue", { action: "appeal", entityId, decision, note }); }
export function updateMessage(entityId: string, status: "received" | "sent" | "failed", note = "") { return invokeAdminFunction("admin-support-queue", { action: "message", entityId, status, note }); }
export function sendNotification(userId: string, title: string, detail: string) { return invokeAdminFunction("admin-support-queue", { action: "notify", entityId: userId, title, detail }); }
