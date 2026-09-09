import { NavLink } from "react-router-dom";
import { navigation } from "../../app/navigation";

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand-lockup">
        <img src="/giglify.svg" alt="Giglify logo" className="brand-logo" />
        <div>
          <p className="eyebrow">Giglify</p>
          <h1>Admin console</h1>
        </div>
      </div>
      <nav aria-label="Admin navigation">
        {navigation.map((item) => (
          <NavLink className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} key={item.id} to={item.path}>
            <item.icon size={17} strokeWidth={2} aria-hidden="true" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <span className="status-dot status-dot-live" /> Authenticated admin workspace
      </div>
    </aside>
  );
}
