import { NavLink } from "react-router-dom";
import { navigation } from "../../app/navigation";
import { X } from "lucide-react";

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      <div className={`sidebar-backdrop ${open ? "is-open" : ""}`} onClick={onClose} aria-hidden="true" />
      <aside className={`sidebar ${open ? "is-open" : ""}`}>
        <div className="brand-lockup">
          <img src="/giglify.svg" alt="Giglify logo" className="brand-logo" />
          <div>
            <p className="eyebrow">Giglify</p>
            <h1>Admin console</h1>
          </div>
          <button className="icon-button sidebar-close" onClick={onClose} aria-label="Close navigation"><X size={19} /></button>
        </div>
        <nav aria-label="Admin navigation">
          <p className="nav-section-label">Workspace</p>
          {navigation.slice(0, 5).map((item) => (
            <NavLink onClick={onClose} className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} key={item.id} to={item.path}>
              <item.icon size={17} strokeWidth={2} aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
          <p className="nav-section-label nav-section-spaced">Administration</p>
          {navigation.slice(5).map((item) => (
            <NavLink onClick={onClose} className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} key={item.id} to={item.path}>
              <item.icon size={17} strokeWidth={2} aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <span className="status-dot status-dot-live" /> Authenticated admin workspace
        </div>
      </aside>
    </>
  );
}
