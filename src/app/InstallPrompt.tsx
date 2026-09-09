import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };
export function InstallPrompt() {
  const [installEvent, setInstallEvent] = useState<InstallEvent | null>(null); const [visible, setVisible] = useState(false);
  useEffect(() => { const onBeforeInstall = (event: Event) => { event.preventDefault(); setInstallEvent(event as InstallEvent); setVisible(true); }; window.addEventListener("beforeinstallprompt", onBeforeInstall); return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall); }, []);
  if (!visible || !installEvent) return null;
  async function install() { await installEvent?.prompt(); const choice = await installEvent?.userChoice; if (choice?.outcome === "accepted") setVisible(false); }
  return <div className="install-prompt" role="status"><div><strong>Install Giglify Admin</strong><p>Keep the operations workspace one tap away.</p></div><div className="install-prompt-actions"><button className="primary-button" onClick={() => void install()}><Download size={15} /> Install</button><button className="icon-button" onClick={() => setVisible(false)} aria-label="Dismiss install prompt"><X size={17} /></button></div></div>;
}
