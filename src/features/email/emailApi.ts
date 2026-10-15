import { invokeAdminFunction } from "../../lib/adminApi";

export type AdminEmailInput = {
  to: string;
  recipientName: string;
  template: string;
  subject: string;
  message: string;
};

export function sendAdminEmail(input: AdminEmailInput) {
  return invokeAdminFunction<{ sent: boolean; recipient: string }>("admin-send-email", input);
}
