import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, CarFront, Users, CalendarCheck2, Wallet,
  Settings, LogOut, Menu, UserRound, MessageSquareMore,
} from "lucide-react";
import logo from "../assets/logo.png";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { to: "/cars", label: "Cars", icon: <CarFront size={18} /> },
  { to: "/customers", label: "Customers", icon: <Users size={18} /> },
  { to: "/drivers", label: "Drivers", icon: <UserRound size={18} /> },
  { to: "/bookings", label: "Bookings", icon: <CalendarCheck2 size={18} /> },
  { to: "/payments", label: "Payments", icon: <Wallet size={18} /> },
  { to: "/settings", label: "Settings", icon: <Settings size={18} /> },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const handleLogout = () => { localStorage.removeItem("adminToken"); localStorage.removeItem("adminData"); navigate("/login"); };
  const navClassName = ({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`;

  return (
    <>
      <button className="btn btn-dark d-lg-none position-fixed top-0 start-0 m-2 sidebar-toggle-btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#adminSidebarMobile" aria-controls="adminSidebarMobile"><Menu size={18} /></button>

      <aside className="d-none d-lg-flex flex-column admin-sidebar">
        <div className="sidebar-brand">
          <img src={logo} alt="Awan Rent a Car" className="brand-logo" />
          <div className="brand-copy">
            <div className="brand-title">Awan Rent a Car</div>
            <small className="brand-subtitle">Admin Panel</small>
          </div>
        </div>
        <div className="sidebar-menu-wrap">
          <nav className="sidebar-nav">
            {navItems.map(item => (
              <NavLink key={item.to} to={item.to} className={navClassName}>
                <span className="sidebar-link-icon">{item.icon}</span>
                <span className="sidebar-link-label">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="btn btn-outline-light w-100 sidebar-logout-btn"><LogOut size={18} /> Logout</button>
        </div>
      </aside>

      <div className="offcanvas offcanvas-start text-bg-dark admin-sidebar-mobile" tabIndex="-1" id="adminSidebarMobile" aria-labelledby="adminSidebarMobileLabel">
        <div className="offcanvas-header sidebar-mobile-header">
          <div className="d-flex align-items-center gap-2">
            <img src={logo} alt="Awan Rent a Car" className="mobile-logo" />
            <div><h5 className="offcanvas-title mb-0" id="adminSidebarMobileLabel">Awan Rent a Car</h5><small className="text-white-50">Admin Panel</small></div>
          </div>
          <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close" />
        </div>
        <div className="offcanvas-body sidebar-mobile-body">
          <nav className="sidebar-nav">
            {navItems.map(item => (
              <NavLink key={item.to} to={item.to} className={navClassName} data-bs-dismiss="offcanvas">
                <span className="sidebar-link-icon">{item.icon}</span>
                <span className="sidebar-link-label">{item.label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="mt-3">
            <button onClick={handleLogout} className="btn btn-outline-light w-100 sidebar-logout-btn" data-bs-dismiss="offcanvas"><LogOut size={18} /> Logout</button>
          </div>
        </div>
      </div>

      <style>{`
        :root { --sidebar-width: 260px; }
        .admin-sidebar, .admin-sidebar-mobile { background: linear-gradient(180deg, #0b1220 0%, #111827 55%, #0f172a 100%); }
        .admin-sidebar { width: var(--sidebar-width); height: 100vh; position: fixed; top: 0; left: 0; z-index: 1030; border-right: 1px solid rgba(255,255,255,0.08); padding: 14px 12px; box-shadow: 0 12px 40px rgba(0,0,0,0.22); overflow: hidden; }
        .sidebar-brand { display: flex; align-items: center; gap: 10px; padding: 10px 10px 14px; margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .brand-logo { width: 40px; height: 40px; border-radius: 13px; object-fit: cover; flex: 0 0 auto; box-shadow: 0 10px 20px rgba(13,110,253,0.28); }
        .mobile-logo { width: 40px; height: 40px; border-radius: 13px; object-fit: cover; flex: 0 0 auto; box-shadow: 0 10px 20px rgba(13,110,253,0.28); }
        .brand-copy { min-width: 0; }
        .brand-title { color: #fff; font-size: 0.95rem; font-weight: 700; line-height: 1.15; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .brand-subtitle { color: rgba(255,255,255,0.58); font-size: 0.78rem; }
        .sidebar-menu-wrap { flex: 1; min-height: 0; overflow-y: auto; overflow-x: hidden; padding-right: 4px; }
        .sidebar-nav { display: grid; gap: 6px; }
        .sidebar-link { display: flex; align-items: center; gap: 12px; padding: 11px 14px; border-radius: 13px; text-decoration: none; color: rgba(255,255,255,0.76); background: transparent; border: 1px solid transparent; transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease, transform 0.18s ease; font-weight: 500; min-height: 44px; font-size: 0.88rem; }
        .sidebar-link:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.08); color: rgba(255,255,255,0.95); transform: translateX(2px); }
        .sidebar-link.active { color: #fff; background: rgba(13,110,253,0.18); border-color: rgba(13,110,253,0.28); box-shadow: inset 0 0 0 1px rgba(255,255,255,0.02); }
        .sidebar-link-icon { width: 24px; display: inline-flex; align-items: center; justify-content: center; flex: 0 0 auto; opacity: 0.98; }
        .sidebar-link-label { flex: 1; text-align: left; min-width: 0; }
        .sidebar-footer { padding-top: 12px; margin-top: 12px; border-top: 1px solid rgba(255,255,255,0.08); }
        .sidebar-logout-btn { height: 42px; border-radius: 13px; display: flex; align-items: center; justify-content: center; gap: 10px; border-color: rgba(255,255,255,0.18); font-size: 0.85rem; }
        .sidebar-logout-btn:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.28); }
        .sidebar-toggle-btn { z-index: 1055; width: 42px; height: 42px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; }
        .admin-sidebar-mobile { width: 260px; }
        .sidebar-mobile-header { border-bottom: 1px solid rgba(255,255,255,0.08); }
        .sidebar-mobile-body { display: flex; flex-direction: column; }
        .sidebar-menu-wrap::-webkit-scrollbar, .admin-sidebar-mobile .offcanvas-body::-webkit-scrollbar { width: 5px; }
        .sidebar-menu-wrap::-webkit-scrollbar-track, .admin-sidebar-mobile .offcanvas-body::-webkit-scrollbar-track { background: transparent; }
        .sidebar-menu-wrap::-webkit-scrollbar-thumb, .admin-sidebar-mobile .offcanvas-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.14); border-radius: 999px; }
        .sidebar-menu-wrap::-webkit-scrollbar-thumb:hover, .admin-sidebar-mobile .offcanvas-body::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.24); }
        .sidebar-menu-wrap, .admin-sidebar-mobile .offcanvas-body { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.18) transparent; }
        @media (max-width: 991px) { .admin-sidebar { display: none !important; } }
        @media (max-width: 575px) { .admin-sidebar-mobile { width: min(85vw, 260px); } .sidebar-link { padding: 10px 13px; } }
      `}</style>
    </>
  );
};

export default Sidebar;