import { invokeAdminFunction } from "../../lib/adminApi";

export type InboxMessage = {
  id: string;
  provider_email_id: string;
  message_id: string | null;
  sender_name: string | null;
  sender_email: string;
  recipients: string[];
  subject: string;
  text_body: string;
  thread_key: string;
  received_at: string;
  read_at: string | null;
};

export function fetchInbox(input: { unread?: boolean } = {}) {
  return invokeAdminFunction<{ items: InboxMessage[]; count: number }>("admin-email-inbox", { action: "list", ...input });
}

export function markInboxMessageRead(entityId: string) {
  return invokeAdminFunction<{ message: InboxMessage }>("admin-email-inbox", { action: "read", entityId });
}
