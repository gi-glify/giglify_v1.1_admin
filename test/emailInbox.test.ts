import assert from "node:assert/strict";
import test from "node:test";
import { normalizeInboundEmail } from "../src/features/inbox/inboxModel.ts";

test("normalizes a received email into a safe inbox message", () => {
  assert.deepEqual(normalizeInboundEmail({
    email_id: "resend-email-1",
    message_id: "<message-1@example.com>",
    from: "Amos <amos@example.com>",
    to: ["inbound@resend.app"],
    subject: "Re: Welcome to Giglify",
    text: "Thanks for the update",
    created_at: "2026-10-15T18:00:00.000Z",
  }), {
    provider_email_id: "resend-email-1",
    message_id: "<message-1@example.com>",
    sender_name: "Amos",
    sender_email: "amos@example.com",
    recipients: ["inbound@resend.app"],
    subject: "Re: Welcome to Giglify",
    text_body: "Thanks for the update",
    thread_key: "amos@example.com::welcome to giglify",
    received_at: "2026-10-15T18:00:00.000Z",
  });
});

test("normalizes an address-only sender and bounds missing message content", () => {
  const message = normalizeInboundEmail({
    email_id: "resend-email-2",
    from: "user@example.com",
    to: ["inbound@resend.app"],
    subject: "",
  });

  assert.equal(message.sender_name, null);
  assert.equal(message.sender_email, "user@example.com");
  assert.equal(message.subject, "(no subject)");
  assert.equal(message.text_body, "(No message content was provided.)");
});
