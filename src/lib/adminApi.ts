import { supabase } from "./supabase";
import { AdminApiError, normalizeAdminError } from "./errors";

export const ADMIN_FUNCTIONS = [
  "admin-payment-action",
  "admin-requester-action",
  "admin-overview-metrics",
  "admin-task-funnel",
  "admin-payment-metrics",
  "admin-requester-funnel",
  "admin-requester-queue",
  "admin-requester-document",
  "publish-requester-task",
  "admin-submission-queue",
  "admin-payment-queue",
  "admin-support-queue",
  "admin-audit-explorer",
  "admin-ai-analysis",
  "admin-profile",
] as const;

export type AdminFunctionName = (typeof ADMIN_FUNCTIONS)[number];

type FunctionError = { message?: string; context?: Response; status?: number; code?: string };

async function responseMessage(error: FunctionError): Promise<string> {
  if (error.context) {
    try {
      const payload = await error.context.clone().json() as { error?: string | { message?: string } };
      if (typeof payload.error === "string") return payload.error;
      if (payload.error?.message) return payload.error.message;
    } catch {
      // Fall through to the SDK error message when the response is not JSON.
    }
  }
  return error.message || "The admin request failed.";
}

export async function invokeAdminFunction<TResponse, TBody extends Record<string, unknown> = Record<string, unknown>>(
  name: AdminFunctionName,
  body?: TBody,
): Promise<TResponse> {
  if (!supabase) throw new AdminApiError("The admin app is not configured.", "network", 0, "configuration_error");
  const { data, error } = await supabase.functions.invoke<TResponse>(name, { body });
  if (error) {
    const candidate = error as unknown as FunctionError;
    const status = typeof candidate.status === "number" ? candidate.status : candidate.context?.status ?? 500;
    const normalized = normalizeAdminError({ ...candidate, status });
    throw new AdminApiError(
      await responseMessage(candidate),
      normalized.kind,
      status,
      candidate.code,
    );
  }
  if (data === null || data === undefined) throw new AdminApiError("The admin service returned no data.", "network", 502, "empty_response");
  return data;
}
