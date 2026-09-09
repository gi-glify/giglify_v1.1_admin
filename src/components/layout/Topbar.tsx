import { useLocation } from "react-router-dom";
import { useAuth } from "../../app/AuthProvider";
import { navigation } from "../../app/navigation";

export function Topbar() {
  const { session, signOut } = useAuth();
  const { pathname } = useLocation();
  const current = navigation.find((item) => pathname.startsWith(item.path));

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Operations</p>
        <h2>{current?.label ?? "Admin console"}</h2>
      </div>
      <div className="topbar-actions">
        <span className="admin-chip">{session?.user.email ?? "Admin"}</span>
        <button className="text-button" onClick={() => void signOut()}>Sign out</button>
      </div>
    </header>
  );
}
