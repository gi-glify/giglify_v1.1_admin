import { Menu, Users, X } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { navigation } from "../../app/navigation";

const tabs = navigation.filter((item) => ["overview", "requesters", "tasks", "payments"].includes(item.id));

export function BottomNav() {
  const [open, setOpen] = useState(false); const location = useLocation();
  useEffect(() => { setOpen(false); }, [location.pathname]);
  useEffect(() => { if (!open) return; const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false); document.addEventListener("keydown", close); return () => document.removeEventListener("keydown", close); }, [open]);
  return <><nav className="admin-bottom-nav" aria-label="Primary admin navigation">{tabs.map((item) => <NavLink key={item.id} to={item.path} className={({ isActive }) => isActive ? "bottom-nav-item active" : "bottom-nav-item"}><item.icon size={19} /><span>{item.id === "requesters" ? "Queue" : item.label.split(" ")[0]}</span></NavLink>)}<button className={open ? "bottom-nav-item active" : "bottom-nav-item"} onClick={() => setOpen(true)} aria-label="Open admin menu" aria-expanded={open}><Menu size={19} /><span>More</span></button></nav>{open && <div className="more-sheet-backdrop" onClick={() => setOpen(false)}><aside className="more-sheet" role="dialog" aria-modal="true" aria-label="Admin tools and account" onClick={(event) => event.stopPropagation()}><div className="sheet-handle" /><div className="sheet-heading"><div><p className="eyebrow">More workspace</p><h3>Tools and account</h3></div><button className="icon-button" onClick={() => setOpen(false)} aria-label="Close menu"><X size={18} /></button></div><div className="sheet-links">{navigation.slice(4).map((item) => <NavLink key={item.id} to={item.path} onClick={() => setOpen(false)} className="sheet-link"><item.icon size={19} /><span>{item.label}</span></NavLink>)}<NavLink to="/profile" onClick={() => setOpen(false)} className="sheet-link"><Users size={19} /><span>Admin profile</span></NavLink></div></aside></div>}</>;
}
