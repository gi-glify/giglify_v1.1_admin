import { invokeAdminFunction } from "../../lib/adminApi";

export type CampaignInput = { template: string; subject: string; message: string; testTo?: string; recipientName?: string; confirm?: boolean };
export type CampaignPreview = { audience: string; recipientCount: number; sample: Array<{ email: string | null; name: string }> };
export type CampaignHistoryItem = { id: string; subject: string; template: string; audience: string; status: string; recipient_count: number; sent_count: number; failed_count: number; last_error: string | null; created_at: string; completed_at: string | null };

export function previewCampaign() {
  return invokeAdminFunction<CampaignPreview>("admin-bulk-email", { action: "preview" });
}

export function sendCampaignTest(input: CampaignInput) {
  return invokeAdminFunction<{ sent: boolean; recipient: string }>("admin-bulk-email", { action: "test", ...input });
}

export function sendCampaign(input: CampaignInput) {
  return invokeAdminFunction<{ campaignId: string; status: string; recipientCount: number; sentCount: number; failedCount: number }>("admin-bulk-email", { action: "send", ...input });
}

export function listCampaignHistory() {
  return invokeAdminFunction<{ campaigns: CampaignHistoryItem[] }>("admin-bulk-email", { action: "history" });
}
