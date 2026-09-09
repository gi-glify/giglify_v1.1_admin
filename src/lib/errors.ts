export type AdminErrorKind = "unauthorized" | "forbidden" | "validation" | "conflict" | "stale-data" | "network";

export class AdminApiError extends Error {
  readonly kind: AdminErrorKind;
  readonly status: number;
  readonly code?: string;

  constructor(message: string, kind: AdminErrorKind, status: number, code?: string) {
    super(message);
    this.name = "AdminApiError";
    this.kind = kind;
    this.status = status;
    this.code = code;
  }
}

export function classifyStatus(status: number): AdminErrorKind {
  if (status === 401) return "unauthorized";
  if (status === 403) return "forbidden";
  if (status === 400) return "validation";
  if (status === 409) return "conflict";
  if (status === 422) return "stale-data";
  return "network";
}

export function normalizeAdminError(error: unknown, fallbackStatus = 500): AdminApiError {
  if (error instanceof AdminApiError) return error;
  const candidate = error as { message?: unknown; status?: unknown; code?: unknown; context?: Response } | null;
  const status = typeof candidate?.status === "number" ? candidate.status : candidate?.context?.status ?? fallbackStatus;
  const message = typeof candidate?.message === "string" ? candidate.message : "The admin request failed.";
  const code = typeof candidate?.code === "string" ? candidate.code : undefined;
  return new AdminApiError(message, classifyStatus(status), status, code);
}
