import { useEffect, useState, type ReactNode } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { BottomNav } from "./BottomNav";

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

  return (
    <div className="app-shell">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="content">
        <Topbar onMenu={() => setMenuOpen(true)} />
        {children}
      </main>
      <BottomNav onMenu={() => setMenuOpen(true)} menuOpen={menuOpen} />
    </div>
  );
}
