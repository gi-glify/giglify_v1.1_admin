import { useState, type FormEvent } from "react";
import { Mail, Send } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { AdminApiError } from "../../lib/errors";
import { useToast } from "../../app/ToastProvider";
import { sendAdminEmail } from "./emailApi";

type EmailTemplate = { id: string; label: string; description: string; subject: string; message: string };

const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: "general",
    label: "General follow-up",
    description: "A warm response to a question or support request.",
    subject: "A quick follow-up from Giglify",
    message: "Thanks for reaching out to Giglify. We have reviewed your question and wanted to follow up with you directly.\n\nPlease let us know if there is anything else we can clarify.",
  },
  {
    id: "payment",
    label: "Payment assistance",
    description: "Explain a payment, verification, or balance update.",
    subject: "An update about your Giglify payment",
    message: "Thanks for your patience while we reviewed your payment.\n\nWe have checked the account details and wanted to share an update with you. If anything still looks incorrect, reply to this email with your payment reference so we can investigate further.",
  },
  {
    id: "task",
    label: "Task follow-up",
    description: "Respond about task review, grading, or a submission.",
    subject: "An update about your Giglify task",
    message: "We have reviewed your task activity and wanted to follow up with you.\n\nPlease review the task feedback in your Giglify account and reply if you need help understanding the next step.",
  },
  { id: "custom", label: "Custom message", description: "Start with a blank, branded response.", subject: "", message: "" },
];

function selectedTemplate(id: string): EmailTemplate {
  return EMAIL_TEMPLATES.find((template) => template.id === id) ?? EMAIL_TEMPLATES[0];
}

export function EmailComposerPage() {
  const [params] = useSearchParams();
  const { notify } = useToast();
  const [template, setTemplate] = useState(params.get("subject") ? "custom" : "general");
  const [to, setTo] = useState(params.get("to") ?? "");
  const [recipientName, setRecipientName] = useState(params.get("name") ?? "");
  const [subject, setSubject] = useState(params.get("subject") ?? EMAIL_TEMPLATES[0].subject);
  const [message, setMessage] = useState(params.get("subject") ? "" : EMAIL_TEMPLATES[0].message);
  const [sending, setSending] = useState(false);

  function applyTemplate(nextTemplate: string) {
    const next = selectedTemplate(nextTemplate);
    setTemplate(next.id);
    setSubject(next.subject);
    setMessage(next.message);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    try {
      await sendAdminEmail({ to: to.trim(), recipientName: recipientName.trim(), template, subject: subject.trim(), message: message.trim() });
      notify({ kind: "success", title: "Email sent", detail: `The branded email was sent to ${to.trim()}.` });
    } catch (error: unknown) {
      notify({ kind: "danger", title: "Email could not be sent", detail: error instanceof AdminApiError ? error.message : "Please try again.", persistent: true });
    } finally {
      setSending(false);
    }
  }

  return <section className="queue-page email-composer-page" data-aos="fade-up">
    <div className="page-heading"><div><p className="eyebrow">Communication</p><h3>Email a user</h3><p>Send a personal, branded response to a user or contact query through Resend.</p></div><span className="status-pill email-admin-pill">Admin only</span></div>
    <div className="email-composer-grid">
      <form className="email-form" onSubmit={submit}>
        <label>Response template<select value={template} onChange={(event) => applyTemplate(event.target.value)}>{EMAIL_TEMPLATES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select><small>{selectedTemplate(template).description}</small></label>
        <div className="email-field-grid"><label>Recipient email<input type="email" required maxLength={320} placeholder="user@example.com" value={to} onChange={(event) => setTo(event.target.value)} /></label><label>Recipient name<input type="text" maxLength={100} placeholder="First name" value={recipientName} onChange={(event) => setRecipientName(event.target.value)} /></label></div>
        <label>Subject<input type="text" required maxLength={180} placeholder="Email subject" value={subject} onChange={(event) => setSubject(event.target.value)} /></label>
        <label>Message<textarea required maxLength={8000} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Write your response…" /><small className="email-character-count">{message.length}/8000</small></label>
        <button className="primary-button email-send-button" type="submit" disabled={sending}><Send size={16} />{sending ? "Sending email…" : "Send branded email"}</button>
      </form>
      <aside className="email-preview-wrap" aria-label="Email preview"><div className="email-preview-heading"><span className="eyebrow">Live preview</span><small>Inline-styled</small></div><div className="email-preview"><div className="email-preview-header"><div className="email-preview-brand"><img src="/giglify.svg" alt="" /><strong>GIGLIFY</strong></div><small>A MESSAGE FROM THE TEAM</small><h4>{subject || "Your email subject"}</h4></div><div className="email-preview-body"><p>Hi {recipientName || "there"},</p><div className="email-preview-message">{(message || "Your message will appear here.").split("\n").map((line, index) => <p key={`${line}-${index}`}>{line || " "}</p>)}</div><div className="email-preview-note">Need anything else? Reply to this email and our team will help.</div><p className="email-preview-signoff">Warmly,<br /><strong>The Giglify Team</strong></p></div><div className="email-preview-footer">Giglify · Microtasking, Done Right.</div></div></aside>
    </div>
  </section>;
}
