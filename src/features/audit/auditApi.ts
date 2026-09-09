import { invokeAdminFunction } from "../../lib/adminApi";

export type AuditEntry = { id: string; actor_user_id: string; actor_email: string | null; actor_name: string | null; action: string; entity_type: string; entity_id: string | null; before_json: unknown; after_json: unknown; reason: string | null; request_id: string; created_at: string };
export function fetchAudit(input: Record<string, unknown> = {}) { return invokeAdminFunction<{ entries: AuditEntry[]; count: number }>("admin-audit-explorer", input); }
