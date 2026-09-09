import { useState } from "react";
import { ExternalLink, Loader2 } from "lucide-react";
import { fetchKycDocument } from "./requesterApi";

export function KycDocumentPreview({ applicationId }: { applicationId: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function openDocument() {
    setLoading(true); setError(null);
    try { setUrl((await fetchKycDocument(applicationId)).signedUrl); }
    catch (nextError) { setError(nextError instanceof Error ? nextError.message : "Unable to open document."); }
    finally { setLoading(false); }
  }

  return <div className="document-preview">
    <button className="secondary-button" onClick={() => void openDocument()} disabled={loading}>{loading ? <><Loader2 size={15} className="spin" /> Loading…</> : <><ExternalLink size={15} /> Open private document</>}</button>
    {error && <p className="field-error">{error}</p>}
    {url && <a className="signed-document-link" href={url} target="_blank" rel="noreferrer">Open signed preview (expires shortly)</a>}
  </div>;
}
