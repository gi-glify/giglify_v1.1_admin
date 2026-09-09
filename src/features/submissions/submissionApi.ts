import { invokeAdminFunction } from "../../lib/adminApi";

export type Submission = { id: string; user_id: string; task_id: string; status: string; grading_status: string; grading_percentage: number | null; grading_decision: string | null; grading_confidence: number | null; grading_feedback: Record<string, unknown> | null; graded_at: string | null; reward_approved: number | null; reward_paid: number | null; started_at: string; completed_at: string | null };
export type SubmissionQueueResponse = { submissions: Submission[]; count: number; limit: number; offset: number };

export function fetchSubmissions(input: { status?: string; gradingStatus?: string; search?: string } = {}) {
  return invokeAdminFunction<SubmissionQueueResponse>("admin-submission-queue", { action: "list", ...input });
}
export function applySubmissionAction(input: { submissionId: string; action: "retry" | "manual_review" | "approve" | "reject"; note?: string; rewardApproved?: number }) {
  return invokeAdminFunction<{ submission: Submission }>("admin-submission-queue", input);
}
