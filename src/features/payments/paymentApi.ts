import { invokeAdminFunction } from "../../lib/adminApi";

export type Deposit = { id: string; user_id: string; payout_account_id: string | null; method: string; amount_usd: number; amount_kes: number; provider_reference: string | null; status: string; created_at: string; verified_at: string | null };
export type Payout = { id: string; user_id: string; payout_account_id: string; amount: number; status: string; admin_note: string | null; provider_event_id: string | null; reconciled_at: string | null; created_at: string; paid_at: string | null };
export function fetchPaymentQueue<T extends Deposit | Payout>(queue: "deposits" | "payouts", status = "") { return invokeAdminFunction<{ items: T[]; count: number }>("admin-payment-queue", { queue, status }); }
export function applyPaymentAction(input: { entityType: "verification_deposit" | "payout_request"; entityId: string; action: "approve" | "reject" | "mark_paid"; note?: string; providerEventId?: string }) { return invokeAdminFunction<{ entityId: string; status: string }>("admin-payment-action", input); }
