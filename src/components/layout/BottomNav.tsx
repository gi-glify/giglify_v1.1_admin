import { Menu } from "lucide-react";
import { NavLink } from "react-router-dom";
import { navigation } from "../../app/navigation";

const tabs = navigation.filter((item) => ["overview", "requesters", "tasks", "payments"].includes(item.id));

export function BottomNav({ onMenu, menuOpen }: { onMenu: () => void; menuOpen: boolean }) {
  return <nav className="admin-bottom-nav" aria-label="Primary admin navigation">{tabs.map((item) => <NavLink key={item.id} to={item.path} className={({ isActive }) => isActive ? "bottom-nav-item active" : "bottom-nav-item"}><item.icon size={19} /><span>{item.id === "requesters" ? "Queue" : item.label.split(" ")[0]}</span></NavLink>)}<button className={menuOpen ? "bottom-nav-item active" : "bottom-nav-item"} onClick={onMenu} aria-label="Open admin menu" aria-expanded={menuOpen}><Menu size={19} /><span>More</span></button></nav>;
}
