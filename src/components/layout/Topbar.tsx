import { useLocation } from "react-router-dom";
import { useAuth } from "../../app/AuthProvider";
import { navigation } from "../../app/navigation";
import { Bell, ChevronDown, Menu, Moon, ShieldCheck, Sun } from "lucide-react";
import { useTheme } from "../../app/ThemeProvider";
import { useState } from "react";

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const { session, signOut } = useAuth();
  const { pathname } = useLocation();
  const current = navigation.find((item) => pathname.startsWith(item.path));
  const { theme, toggleTheme } = useTheme();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="topbar">
      <div className="topbar-title">
        <button className="mobile-menu-button" onClick={onMenu} aria-label="Open navigation"><Menu size={20} /></button>
        <p className="eyebrow">Operations</p>
        <h2>{current?.label ?? "Admin console"}</h2>
      </div>
      <div className="topbar-actions">
        <button className="topbar-icon-button" onClick={toggleTheme} aria-label="Toggle theme">{theme === "light" ? <Moon size={18} /> : <Sun size={18} />}</button>
        <div className="topbar-popover-wrap"><button className="topbar-icon-button notification-button" onClick={() => setNotificationsOpen((value) => !value)} aria-label="Notifications" aria-expanded={notificationsOpen}><Bell size={18} /><span className="notification-dot" /></button>{notificationsOpen && <div className="topbar-popover notification-popover"><strong>Notifications</strong><p>No new admin notifications.</p><button className="text-button" onClick={() => setNotificationsOpen(false)}>Dismiss</button></div>}</div>
        <div className="topbar-popover-wrap"><button className="profile-trigger" onClick={() => setProfileOpen((value) => !value)} aria-label="Open admin profile" aria-expanded={profileOpen}><span className="profile-avatar"><ShieldCheck size={16} /></span><span className="profile-email">{session?.user.email ?? "Admin"}</span><ChevronDown size={14} /></button>{profileOpen && <div className="topbar-popover profile-popover"><strong>Admin account</strong><p>{session?.user.email ?? "Authenticated administrator"}</p><button className="text-button" onClick={() => void signOut()}>Sign out</button></div>}</div>
      </div>
    </header>
  );
}
