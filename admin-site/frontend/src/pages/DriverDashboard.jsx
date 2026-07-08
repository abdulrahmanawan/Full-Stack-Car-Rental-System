import React, { useEffect, useState } from "react";
import { MapPin, Calendar, Clock, Users, Phone, Loader2, Car } from "lucide-react";

const API = "http://localhost:5000";

const DriverDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("driverToken");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API}/api/drivers/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <style>{`
        .driver-dashboard {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }
        .trip-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .trip-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.08);
        }
      `}</style>

      <div className="driver-dashboard">
        <div style={styles.header}>
          <h2 style={styles.title}>Assigned Trips</h2>
          <span style={styles.badge}>{bookings.length} trip{bookings.length !== 1 ? "s" : ""}</span>
        </div>

        {loading ? (
          <div style={styles.centered}>
            <Loader2 size={40} className="animate-spin" style={{ color: "#0d6efd" }} />
            <p style={{ marginTop: 12, color: "#64748b" }}>Loading your trips...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div style={styles.emptyState}>
            <Car size={48} style={{ color: "#94a3b8", marginBottom: 12 }} />
            <h4 style={{ color: "#475569", fontWeight: 600 }}>No trips assigned</h4>
            <p style={{ color: "#94a3b8" }}>Your upcoming rides will appear here once assigned by admin.</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {bookings.map((booking) => (
              <div key={booking.id} style={styles.card} className="trip-card">
                <div style={styles.cardHeader}>
                  <h5 style={styles.customerName}>{booking.customer_name}</h5>
                  <span style={styles.statusBadge}>{booking.status}</span>
                </div>

                <div style={styles.phoneRow}>
                  <Phone size={14} style={{ color: "#0d6efd" }} />
                  <span style={styles.phoneText}>{booking.customer_phone}</span>
                </div>

                <hr style={{ borderColor: "#e2e8f0", margin: "14px 0" }} />

                <div style={styles.infoGrid}>
                  <div style={styles.infoItem}>
                    <MapPin size={15} style={{ color: "#0d6efd" }} />
                    <div>
                      <span style={styles.infoLabel}>Pickup → Drop</span>
                      <span style={styles.infoValue}>
                        {booking.pickup_location} → {booking.drop_location}
                      </span>
                    </div>
                  </div>

                  <div style={styles.infoItem}>
                    <Calendar size={15} style={{ color: "#f59e0b" }} />
                    <div>
                      <span style={styles.infoLabel}>Date</span>
                      <span style={styles.infoValue}>{booking.booking_date}</span>
                    </div>
                  </div>

                  <div style={styles.infoItem}>
                    <Clock size={15} style={{ color: "#8b5cf6" }} />
                    <div>
                      <span style={styles.infoLabel}>Time</span>
                      <span style={styles.infoValue}>{booking.booking_time}</span>
                    </div>
                  </div>

                  <div style={styles.infoItem}>
                    <Users size={15} style={{ color: "#10b981" }} />
                    <div>
                      <span style={styles.infoLabel}>Passengers</span>
                      <span style={styles.infoValue}>{booking.passengers}</span>
                    </div>
                  </div>
                </div>

                {booking.message && (
                  <div style={styles.messageBox}>
                    💬 {booking.message}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "28px",
  },
  title: {
    fontWeight: 800,
    fontSize: "1.8rem",
    color: "#0f172a",
    margin: 0,
  },
  badge: {
    background: "#e0f2fe",
    color: "#0369a1",
    padding: "6px 16px",
    borderRadius: "30px",
    fontWeight: 700,
    fontSize: "0.9rem",
    border: "1px solid #bae6fd",
  },
  centered: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "80px 0",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "80px 0",
    color: "#64748b",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    padding: "22px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  customerName: {
    fontWeight: 700,
    fontSize: "1.2rem",
    color: "#0f172a",
    margin: 0,
  },
  statusBadge: {
    background: "#dcfce7",
    color: "#166534",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: 700,
    border: "1px solid #bbf7d0",
  },
  phoneRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#64748b",
    fontSize: "0.9rem",
    marginBottom: "4px",
  },
  phoneText: {
    color: "#475569",
    fontWeight: 500,
  },
  infoGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "16px",
  },
  infoItem: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
  },
  infoLabel: {
    display: "block",
    fontSize: "0.7rem",
    color: "#94a3b8",
    textTransform: "uppercase",
    fontWeight: 600,
    letterSpacing: "0.5px",
  },
  infoValue: {
    display: "block",
    fontSize: "0.95rem",
    color: "#1e293b",
    fontWeight: 500,
  },
  messageBox: {
    background: "#f8fafc",
    padding: "12px 16px",
    borderRadius: "12px",
    color: "#64748b",
    fontStyle: "italic",
    fontSize: "0.92rem",
    border: "1px dashed #cbd5e1",
  },
};

export default DriverDashboard;