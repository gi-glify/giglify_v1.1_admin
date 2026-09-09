import { invokeAdminFunction } from "../../lib/adminApi";

export interface RequesterApplication {
  id: string;
  user_id: string;
  legal_name: string;
  organization_name: string | null;
  phone: string;
  country: string;
  id_type: string;
  task_brief: string;
  status: string;
  submitted_at: string;
  review_available_at: string;
  reviewed_at: string | null;
  admin_note: string | null;
}

export interface DraftQuestion {
  question_number?: number;
  question_text?: string;
  question_type?: string;
  context?: string;
  options?: unknown[];
  model_answer?: string;
}

export interface RequesterDraft {
  id: string;
  requester_id: string;
  title: string;
  context: string;
  category: string;
  difficulty: string;
  reward: number;
  questions: DraftQuestion[];
  status: string;
  created_at: string;
  reviewed_at: string | null;
  admin_note: string | null;
}

export interface RequesterQueueResponse {
  applications: RequesterApplication[];
  drafts: RequesterDraft[];
  counts: { applications: number; drafts: number };
  limit: number;
  offset: number;
}

export function fetchRequesterQueue(input: { search?: string; status?: string; limit?: number; offset?: number } = {}) {
  return invokeAdminFunction<RequesterQueueResponse>("admin-requester-queue", input);
}

export function fetchKycDocument(applicationId: string) {
  return invokeAdminFunction<{ applicationId: string; signedUrl: string; expiresInSeconds: number }>("admin-requester-document", { applicationId });
}

export function applyRequesterAction(input: { entityType: "requester_application" | "requester_task"; entityId: string; action: "approve" | "reject" | "request_info"; note?: string }) {
  return invokeAdminFunction<{ entityId: string; status: string }>("admin-requester-action", input);
}

export function publishRequesterTask(input: { draftId: string; note?: string }) {
  return invokeAdminFunction<{ draftId: string; taskId: string; taskCode: string; status: string }>("publish-requester-task", input);
}
