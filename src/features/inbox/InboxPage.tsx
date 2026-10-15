import { useCallback, useEffect, useState } from "react";
import { Check, Inbox, Loader2, MailOpen, RefreshCw, Reply } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AdminApiError } from "../../lib/errors";
import { useToast } from "../../app/ToastProvider";
import { fetchInbox, markInboxMessageRead, type InboxMessage } from "./inboxApi";

function displayName(item: InboxMessage): string {
  return item.sender_name || item.sender_email;
}

export function InboxPage() {
  const navigate = useNavigate();
  const { notify } = useToast();
  const [items, setItems] = useState<InboxMessage[]>([]);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchInbox({ unread: unreadOnly })
      .then((result) => setItems(result.items))
      .catch((next: unknown) => setError(next instanceof AdminApiError ? next.message : "Unable to load the inbox."))
      .finally(() => setLoading(false));
  }, [unreadOnly]);

  useEffect(() => { load(); }, [load]);

  async function openMessage(item: InboxMessage) {
    setSelected(selected === item.id ? null : item.id);
    if (item.read_at) return;
    try {
      await markInboxMessageRead(item.id);
      setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, read_at: new Date().toISOString() } : entry));
    } catch (next: unknown) {
      notify({ kind: "danger", title: "Could not mark message read", detail: next instanceof AdminApiError ? next.message : "Please try again." });
    }
  }

  function replyTo(item: InboxMessage) {
    navigate(`/email?to=${encodeURIComponent(item.sender_email)}&name=${encodeURIComponent(item.sender_name || "")}&subject=${encodeURIComponent(item.subject.toLowerCase().startsWith("re:") ? item.subject : `Re: ${item.subject}`)}`);
  }

  const unreadCount = items.filter((item) => !item.read_at).length;

  return <section className="queue-page inbox-page" data-aos="fade-up">
    <div className="page-heading"><div><p className="eyebrow">Communication</p><h3>Support inbox</h3><p>Replies forwarded from Team@giglify.co.ke, ready for admin follow-up.</p></div><button className="secondary-button" onClick={load} disabled={loading}><RefreshCw size={15} /> Refresh</button></div>
    <div className="inbox-toolbar"><div className="inbox-summary"><Inbox size={17} /><strong>{unreadCount} unread</strong><span>{items.length} visible messages</span></div><label className="inbox-toggle"><input type="checkbox" checked={unreadOnly} onChange={(event) => setUnreadOnly(event.target.checked)} /> Unread only</label></div>
    {error && <div className="alert alert-error">{error}</div>}
    {loading && <div className="loading-card overview-loading"><Loader2 className="spin" size={18} /> Loading inbox…</div>}
    {!loading && !error && items.length === 0 && <div className="empty-state"><MailOpen size={22} /><h3>{unreadOnly ? "No unread replies" : "Your inbox is empty"}</h3><p>Forward replies from the Team mailbox to the Resend inbound address to see them here.</p></div>}
    {!loading && !error && <div className="inbox-list">{items.map((item) => <article className={`inbox-message ${item.read_at ? "is-read" : "is-unread"} ${selected === item.id ? "is-selected" : ""}`} key={item.id}>
      <button className="inbox-message-button" onClick={() => openMessage(item)} aria-expanded={selected === item.id}>
        <span className="inbox-message-status" aria-hidden="true">{item.read_at ? <MailOpen size={17} /> : <Inbox size={17} />}</span>
        <span className="inbox-message-copy"><strong>{displayName(item)}</strong><small>{item.sender_email} · {new Date(item.received_at).toLocaleString()}</small><span>{item.subject}</span></span>
        {!item.read_at && <span className="status-pill">Unread</span>}
      </button>
      {selected === item.id && <div className="inbox-message-detail"><div className="inbox-message-body">{item.text_body.split("\n").map((line, index) => <p key={`${item.id}-${index}`}>{line || " "}</p>)}</div><div className="action-row"><button className="primary-button" onClick={() => replyTo(item)}><Reply size={15} /> Reply by email</button>{item.read_at && <span className="inbox-read-note"><Check size={14} /> Read</span>}</div></div>}
    </article>)}</div>}
  </section>;
}
