import { useLocation } from "react-router-dom";
import { useAuth } from "../../app/AuthProvider";
import { navigation } from "../../app/navigation";
import { Menu, ShieldCheck } from "lucide-react";

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const { session, signOut } = useAuth();
  const { pathname } = useLocation();
  const current = navigation.find((item) => pathname.startsWith(item.path));

  return (
    <header className="topbar">
      <div className="topbar-title">
        <button className="mobile-menu-button" onClick={onMenu} aria-label="Open navigation"><Menu size={20} /></button>
        <p className="eyebrow">Operations</p>
        <h2>{current?.label ?? "Admin console"}</h2>
      </div>
      <div className="topbar-actions">
        <span className="admin-chip"><ShieldCheck size={15} /> {session?.user.email ?? "Admin"}</span>
        <button className="text-button" onClick={() => void signOut()}>Sign out</button>
      </div>
    </header>
  );
}
