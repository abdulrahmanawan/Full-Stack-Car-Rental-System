import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import { Bell, X, CalendarCheck2 } from "lucide-react";

const API = "https://full-stack-car-rental-system.vercel.app";
const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

const playBeep = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = 800;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {}
};

const AdminLayout = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  const [notification, setNotification] = useState({ visible: false, message: "", type: "info" });
  const [notificationQueue, setNotificationQueue] = useState([]);
  const prevBookingIds = useRef(new Set());

  const addNotification = useCallback((msg, type = "info") => {
    setNotificationQueue(prev => [...prev, { message: msg, type }]);
  }, []);

  
  useEffect(() => {
    if (!token) return;
    const fetchLatest = async () => {
      try {
        const res = await fetch(`${API}/api/bookings`, { headers: { Authorization: `Bearer ${token}` } });
        const bookings = await res.json();
        if (!Array.isArray(bookings)) return;
        const latestIds = new Set(bookings.map(b => b.id));
        if (prevBookingIds.current.size > 0) {
          
          for (const id of latestIds) {
            if (!prevBookingIds.current.has(id)) {
              const booking = bookings.find(b => b.id === id);
              if (booking) {
                addNotification(`New booking #${booking.id} by ${booking.customer_name || "someone"}`, "success");
              }
            }
          }
        }
        prevBookingIds.current = latestIds;
      } catch (e) {}
    };
    fetchLatest();
    const interval = setInterval(fetchLatest, 10000);
    return () => clearInterval(interval);
  }, [token, addNotification]);

  useEffect(() => {
    if (notificationQueue.length > 0 && !notification.visible) {
      const next = notificationQueue[0];
      setNotification({ visible: true, message: next.message, type: next.type });
      playBeep();
      const timer = setTimeout(() => {
        setNotification({ visible: false, message: "", type: "info" });
        setNotificationQueue(prev => prev.slice(1));
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [notificationQueue, notification.visible]);

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      <div className="admin-layout">
        <Sidebar />
        <main className="admin-main">
          {children}
        </main>

        
        {notification.visible && (
          <div className="admin-toast-wrapper">
            <div className={`admin-toast ${notification.type}`}>
              <div className="toast-icon">
                {notification.type === "success" ? <CalendarCheck2 size={18} /> : <Bell size={18} />}
              </div>
              <span className="toast-message">{notification.message}</span>
              <button
                className="toast-close"
                onClick={() => {
                  setNotification({ visible: false, message: "", type: "info" });
                  setNotificationQueue(prev => prev.slice(1));
                }}
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .admin-layout {
          --sidebar-width: 260px;
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(13, 110, 253, 0.06), transparent 28%),
            radial-gradient(circle at top right, rgba(59, 130, 246, 0.05), transparent 24%),
            linear-gradient(180deg, #f6f8fb 0%, #eef2f7 55%, #e8edf3 100%);
        }

        .admin-main {
          margin-left: var(--sidebar-width);
          min-height: 100vh;
          padding: 18px;
          transition: margin-left 0.2s ease;
        }

        
        .admin-toast-wrapper {
          position: fixed;
          top: 28px;
          right: 28px;
          z-index: 9999;
          max-width: 400px;
          width: calc(100% - 56px);
          animation: slideInRight 0.45s ease;
        }

        .admin-toast {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px 22px;
          border-radius: 18px;
          color: #fff;
          box-shadow: 0 20px 50px rgba(0,0,0,0.22);
          backdrop-filter: blur(12px);
          font-size: 0.98rem;
        }

        .admin-toast.success { background: #065f46; }
        .admin-toast.info { background: #1e40af; }
        .admin-toast.error { background: #991b1b; }

        .toast-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .toast-message {
          flex: 1;
          font-weight: 500;
          line-height: 1.4;
        }

        .toast-close {
          background: transparent;
          border: none;
          color: #fff;
          cursor: pointer;
          padding: 4px;
          opacity: 0.8;
          flex-shrink: 0;
        }

        @keyframes slideInRight {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @media (max-width: 991px) {
          .admin-main {
            margin-left: 0;
            padding: 14px;
          }
          .admin-toast-wrapper {
            top: 16px;
            right: 16px;
            width: calc(100% - 32px);
          }
        }
      `}</style>
    </NotificationContext.Provider>
  );
};

export default AdminLayout;