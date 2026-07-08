import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Car, LogOut, UserCircle, MessageSquare } from "lucide-react";

const DriverLayout = ({ children }) => {
  const navigate = useNavigate();
  const driver = JSON.parse(localStorage.getItem("driverData") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("driverToken");
    localStorage.removeItem("driverData");
    navigate("/login");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex" }}>
      
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <div style={styles.brandMark}>A</div>
          <div>
            <div style={styles.brandTitle}>Awan Rent a Car</div>
            <small style={styles.brandSub}>Driver Panel</small>
          </div>
        </div>

        <nav style={styles.nav}>
          <NavLink
            to="/driver/dashboard"
            style={({ isActive }) => ({
              ...styles.navItem,
              background: isActive ? "rgba(13,110,253,0.15)" : "transparent",
              borderColor: isActive ? "rgba(13,110,253,0.3)" : "transparent",
            })}
          >
            <Car size={18} />
            <span>My Trips</span>
          </NavLink>

          
          <NavLink
            to="/driver/chat"
            style={({ isActive }) => ({
              ...styles.navItem,
              background: isActive ? "rgba(13,110,253,0.15)" : "transparent",
              borderColor: isActive ? "rgba(13,110,253,0.3)" : "transparent",
            })}
          >
            <MessageSquare size={18} />
            <span>Chat</span>
          </NavLink>
        </nav>

        <div style={styles.userSection}>
          <div style={styles.userRow}>
            <UserCircle size={28} />
            <div style={{ flex: 1 }}>
              <div style={styles.userName}>{driver.name || "Driver"}</div>
              <div style={styles.userPhone}>{driver.phone || ""}</div>
            </div>
          </div>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      
      <main style={styles.main}>
        {children}
      </main>
    </div>
  );
};

const styles = {
  sidebar: {
    width: "260px",
    background: "linear-gradient(180deg, #0b1120 0%, #0f172a 100%)",
    borderRight: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    flexDirection: "column",
    padding: "20px 14px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
    position: "fixed",
    height: "100vh",
    zIndex: 100,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "28px",
    paddingBottom: "16px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  brandMark: {
    width: "42px",
    height: "42px",
    borderRadius: "13px",
    background: "linear-gradient(135deg, #0d6efd, #0dcaf0)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: 800,
    fontSize: "1rem",
    flexShrink: 0,
  },
  brandTitle: {
    color: "#fff",
    fontWeight: 700,
    fontSize: "0.95rem",
    lineHeight: 1.2,
  },
  brandSub: {
    color: "rgba(255,255,255,0.55)",
    fontSize: "0.78rem",
  },
  nav: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 14px",
    borderRadius: "12px",
    color: "rgba(255,255,255,0.75)",
    textDecoration: "none",
    fontWeight: 500,
    border: "1px solid transparent",
    transition: "all 0.2s ease",
  },
  userSection: {
    borderTop: "1px solid rgba(255,255,255,0.08)",
    paddingTop: "16px",
    marginTop: "auto",
  },
  userRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "#fff",
    marginBottom: "12px",
  },
  userName: {
    fontWeight: 700,
    fontSize: "0.95rem",
    color: "#fff",
  },
  userPhone: {
    fontSize: "0.8rem",
    color: "rgba(255,255,255,0.6)",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    width: "100%",
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.15)",
    background: "transparent",
    color: "#e2e8f0",
    fontWeight: 600,
    cursor: "pointer",
    transition: "0.2s",
  },
  main: {
    flex: 1,
    background: "#f8fafc",
    padding: "30px",
    minHeight: "100vh",
    marginLeft: "260px", 
    color: "#0f172a",
  },
};

export default DriverLayout;