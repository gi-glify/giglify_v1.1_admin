import { useEffect, useState, type FormEvent } from "react";
import { Eye, History, Mail, Send, Users } from "lucide-react";
import { AdminApiError } from "../../lib/errors";
import { useToast } from "../../app/ToastProvider";
import { CAMPAIGN_TEMPLATES, getCampaignTemplate } from "./campaignTemplates";
import { listCampaignHistory, previewCampaign, sendCampaign, sendCampaignTest, type CampaignHistoryItem } from "./campaignApi";

export function CampaignPage() {
  const { notify } = useToast();
  const [template, setTemplate] = useState("launch-offer");
  const [subject, setSubject] = useState(getCampaignTemplate("launch-offer").subject);
  const [message, setMessage] = useState(getCampaignTemplate("launch-offer").message);
  const [testTo, setTestTo] = useState("");
  const [recipientCount, setRecipientCount] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState<"preview" | "test" | "send" | null>(null);
  const [history, setHistory] = useState<CampaignHistoryItem[]>([]);

  async function loadHistory() {
    try { setHistory((await listCampaignHistory()).campaigns); } catch { /* History is secondary to composing a campaign. */ }
  }

  useEffect(() => { void loadHistory(); }, []);

  function applyTemplate(next: string) {
    const selected = getCampaignTemplate(next);
    setTemplate(selected.id); setSubject(selected.subject); setMessage(selected.message); setConfirmed(false);
  }

  async function preview() {
    setLoading("preview");
    try { const result = await previewCampaign(); setRecipientCount(result.recipientCount); notify({ kind: "success", title: "Audience ready", detail: `${result.recipientCount.toLocaleString()} confirmed, opted-in users are eligible.` }); }
    catch (error) { notify({ kind: "danger", title: "Audience could not be loaded", detail: error instanceof AdminApiError ? error.message : "Please try again.", persistent: true }); }
    finally { setLoading(null); }
  }

  async function sendTest(event: FormEvent) {
    event.preventDefault();
    setLoading("test");
    try { await sendCampaignTest({ template, subject: subject.trim(), message: message.trim(), testTo: testTo.trim() }); notify({ kind: "success", title: "Test email sent", detail: `Check ${testTo.trim()} before sending the campaign.` }); }
    catch (error) { notify({ kind: "danger", title: "Test email could not be sent", detail: error instanceof AdminApiError ? error.message : "Please try again.", persistent: true }); }
    finally { setLoading(null); }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!confirmed) { notify({ kind: "info", title: "Confirm the audience first", detail: "Tick the confirmation box after reviewing the recipient count." }); return; }
    setLoading("send");
    try { const result = await sendCampaign({ template, subject: subject.trim(), message: message.trim(), confirm: true }); setRecipientCount(result.recipientCount); notify({ kind: result.failedCount ? "info" : "success", title: result.failedCount ? "Campaign partially sent" : "Campaign sent", detail: `${result.sentCount.toLocaleString()} sent, ${result.failedCount.toLocaleString()} failed.` }); setConfirmed(false); await loadHistory(); }
    catch (error) { notify({ kind: "danger", title: "Campaign could not be sent", detail: error instanceof AdminApiError ? error.message : "Please try again.", persistent: true }); }
    finally { setLoading(null); }
  }

  return <section className="queue-page campaign-page" data-aos="fade-up">
    <div className="page-heading"><div><p className="eyebrow">Communication</p><h3>Campaign email</h3><p>Send a reusable, branded announcement to confirmed users through Resend.</p></div><span className="status-pill email-admin-pill">Admin only</span></div>
    <div className="campaign-safety-banner"><Users size={18} /><div><strong>Audience guardrails are on</strong><p>Only confirmed, non-admin accounts with marketing emails enabled are included. Every campaign includes an unsubscribe link.</p></div></div>
    <div className="campaign-grid">
      <form className="campaign-form" onSubmit={submit}>
        <label>Campaign template<select value={template} onChange={(event) => applyTemplate(event.target.value)}>{CAMPAIGN_TEMPLATES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select><small>{getCampaignTemplate(template).description}</small></label>
        <label>Audience<input value="All confirmed, opted-in users" readOnly /><small>Admins, unconfirmed accounts, missing emails, and opted-out users are excluded.</small></label>
        <label>Subject<input required maxLength={180} value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Campaign subject" /></label>
        <label>Message<textarea required maxLength={8000} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Write your announcement…" /><small className="email-character-count">{message.length}/8000</small></label>
        <div className="campaign-actions"><button className="secondary-button" type="button" onClick={() => void preview()} disabled={loading !== null}><Eye size={16} />{loading === "preview" ? "Counting…" : "Preview audience"}</button><button className="primary-button" type="submit" disabled={loading !== null || !subject.trim() || !message.trim()}><Send size={16} />{loading === "send" ? "Sending campaign…" : "Send campaign"}</button></div>
        <label className="campaign-confirm"><input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} /> <span>I have reviewed the audience and understand this sends one email to every eligible user.</span></label>
      </form>
      <aside className="campaign-side"><div className="campaign-count-card"><p className="eyebrow">Ready to send</p><strong>{recipientCount === null ? "—" : recipientCount.toLocaleString()}</strong><span>eligible recipients</span><button className="secondary-button" type="button" onClick={() => void preview()} disabled={loading !== null}><Users size={15} /> Refresh count</button></div><form className="campaign-test-card" onSubmit={sendTest}><p className="eyebrow">Safe test send</p><h4>Send a preview to yourself</h4><p>Review the real branded email before confirming the full audience.</p><input required type="email" maxLength={320} placeholder="you@example.com" value={testTo} onChange={(event) => setTestTo(event.target.value)} /><button className="secondary-button" type="submit" disabled={loading !== null}><Mail size={15} />{loading === "test" ? "Sending test…" : "Send test email"}</button></form></aside>
    </div>
    <div className="campaign-history"><div className="section-heading"><div><p className="eyebrow"><History size={14} /> Campaign history</p><p>Recent sends and delivery outcomes.</p></div><button className="secondary-button" type="button" onClick={() => void loadHistory()}><History size={15} /> Refresh</button></div>{history.length === 0 ? <div className="empty-state"><h3>No campaigns yet</h3><p>Completed campaign sends will appear here.</p></div> : <div className="campaign-history-list">{history.map((item) => <div className="campaign-history-row" key={item.id}><div><strong>{item.subject}</strong><span>{new Date(item.created_at).toLocaleString()} · {item.audience === "all_confirmed" ? "All confirmed users" : item.audience}</span></div><div><span className={`status-pill campaign-status-${item.status}`}>{item.status}</span><small>{item.sent_count.toLocaleString()} sent · {item.failed_count.toLocaleString()} failed</small></div></div>)}</div>}</div>
  </section>;
}
