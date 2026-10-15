export type InboundEmailPayload = {
  email_id?: unknown;
  message_id?: unknown;
  from?: unknown;
  to?: unknown;
  subject?: unknown;
  text?: unknown;
  created_at?: unknown;
};

export type NormalizedInboundEmail = {
  provider_email_id: string;
  message_id: string | null;
  sender_name: string | null;
  sender_email: string;
  recipients: string[];
  subject: string;
  text_body: string;
  thread_key: string;
  received_at: string;
};

function stringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function parseSender(value: string): { name: string | null; email: string } {
  const match = value.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  const email = (match?.[2] || value).trim().toLowerCase();
  const name = match?.[1]?.replace(/^"|"$/g, "").trim() || null;
  return { name, email };
}

function normalizeSubject(value: string): string {
  return value.replace(/^(re|fwd?|回复):\s*/i, "").trim().toLowerCase() || "(no subject)";
}

export function normalizeInboundEmail(payload: InboundEmailPayload): NormalizedInboundEmail {
  const providerEmailId = stringValue(payload.email_id);
  const sender = parseSender(stringValue(payload.from));
  const subject = stringValue(payload.subject) || "(no subject)";
  const recipients = Array.isArray(payload.to) ? payload.to.filter((value): value is string => typeof value === "string").map((value) => value.trim().toLowerCase()).filter(Boolean) : [];
  const text = stringValue(payload.text) || "(No message content was provided.)";
  const receivedAt = stringValue(payload.created_at) || new Date().toISOString();

  return {
    provider_email_id: providerEmailId,
    message_id: stringValue(payload.message_id) || null,
    sender_name: sender.name,
    sender_email: sender.email,
    recipients,
    subject,
    text_body: text.slice(0, 20000),
    thread_key: `${sender.email}::${normalizeSubject(subject)}`,
    received_at: receivedAt,
  };
}
