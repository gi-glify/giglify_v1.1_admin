import { useEffect, type ReactNode } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AdminLayout({ children }: { children: ReactNode }) {
  const location = useLocation();

  useEffect(() => {
    AOS.init({ duration: 600, once: true, easing: "ease-out", offset: 40 });
  }, []);

  useEffect(() => {
    AOS.refreshHard();
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="content">
        <Topbar />
        {children}
      </main>
    </div>
  );
}
