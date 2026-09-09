import { useEffect, useState, type ReactNode } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { BottomNav } from "./BottomNav";
import { InstallPrompt } from "../../app/InstallPrompt";
import { AdminAiAssistant } from "../operations/AdminAiAssistant";

export function AdminLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 600, once: true, easing: "ease-out", offset: 40 });
  }, []);

  useEffect(() => {
    AOS.refreshHard();
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <div className="app-shell">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <Topbar onMenu={() => setMenuOpen(true)} />
      <main className="content">
        {children}
      </main>
      <BottomNav />
      <InstallPrompt />
      <AdminAiAssistant />
    </div>
  );
}
