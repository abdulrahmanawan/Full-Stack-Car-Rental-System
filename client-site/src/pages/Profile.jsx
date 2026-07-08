import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin, Calendar, Clock, Users, Edit3, Loader2, Check, X, Key,
  User, Mail, Phone, LogOut, Shield, ArrowRight, Car,
  PhoneCall, MessageSquare, Bell, Smartphone, Banknote,
} from "lucide-react";

const API = "http://localhost:5000";
const ADMIN_WHATSAPP = "923165040247";
const EASYPAISA_ACCOUNT = "03188046057";
const EASYPAISA_NAME = "Abdulrahman";

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

const Profile = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [paymentData, setPaymentData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    trip_type: "",
    pickup_location: "",
    drop_location: "",
    booking_date: "",
    booking_time: "",
    passengers: 1,
    message: "",
  });
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [notification, setNotification] = useState({ visible: false, message: "" });
  const [notificationQueue, setNotificationQueue] = useState([]);

  const token = localStorage.getItem("customerToken");
  const customer = JSON.parse(localStorage.getItem("customer") || "{}");
  const prevBookingsRef = useRef([]);

  useEffect(() => {
    if (notificationQueue.length > 0 && !notification.visible) {
      const next = notificationQueue[0];
      setNotification({ visible: true, message: next });
      playBeep();
      const timer = setTimeout(() => {
        setNotification({ visible: false, message: "" });
        setNotificationQueue((prev) => prev.slice(1));
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [notificationQueue, notification.visible]);

  const addNotification = useCallback((msg) => {
    setNotificationQueue((prev) => [...prev, msg]);
  }, []);

  const fetchPayments = async (bookingsArr) => {
    const payments = {};
    for (const booking of bookingsArr) {
      try {
        const res = await fetch(`${API}/api/payments/booking/${booking.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          payments[booking.id] = data;
        }
      } catch {}
    }
    setPaymentData(payments);
  };

  const fetchBookings = useCallback(async (silent = false) => {
    try {
      const res = await fetch(`${API}/api/customers/my-bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch bookings");
      const data = await res.json();
      const newBookings = Array.isArray(data) ? data : [];

      if (!silent) {
        setBookings(newBookings);
        prevBookingsRef.current = newBookings;
        await fetchPayments(newBookings);
        setLoading(false);
        return;
      }

      const oldBookings = prevBookingsRef.current;
      for (let i = 0; i < newBookings.length; i++) {
        const b = newBookings[i];
        const old = oldBookings.find((p) => p.id === b.id);
        if (!old) continue;
        const serial = i + 1;
        if (b.rent != null && old.rent !== b.rent) {
          addNotification(`💰 Booking #${serial} rent updated to Rs ${b.rent}`);
        }
        if (b.status !== old.status) {
          addNotification(`🔄 Booking #${serial} status changed to ${b.status}`);
        }
        if (b.driver_name && (!old.driver_name || old.driver_name !== b.driver_name)) {
          addNotification(`👨‍✈️ Driver assigned for booking #${serial}: ${b.driver_name}`);
        }
      }
      setBookings(newBookings);
      prevBookingsRef.current = newBookings;
      await fetchPayments(newBookings);
    } catch (err) {
      if (!silent) setError(err.message);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [token, addNotification]);

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetchBookings();
    const interval = setInterval(() => fetchBookings(true), 10000);
    return () => clearInterval(interval);
  }, [token, fetchBookings, navigate]);

  const canEdit = (status) => !["Confirmed", "Completed", "Cancelled"].includes(status);

  const startEdit = (booking) => {
    setEditingId(booking.id);
    setEditError("");
    setEditForm({
      trip_type: booking.trip_type,
      pickup_location: booking.pickup_location,
      drop_location: booking.drop_location,
      booking_date: booking.booking_date,
      booking_time: booking.booking_time || "",
      passengers: booking.passengers,
      message: booking.message || "",
    });
  };

  const cancelEdit = () => { setEditingId(null); setEditError(""); };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveEdit = async (id) => {
    setSaving(true); setEditError("");
    try {
      const res = await fetch(`${API}/api/customers/my-bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");
      setEditingId(null);
      fetchBookings();
    } catch (err) { setEditError(err.message); } finally { setSaving(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault(); setPasswordError(""); setPasswordMsg(""); setChangingPassword(true);
    try {
      const res = await fetch(`${API}/api/customers/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(passwordForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update password");
      setPasswordMsg(data.message);
      setPasswordForm({ currentPassword: "", newPassword: "" });
    } catch (err) { setPasswordError(err.message); } finally { setChangingPassword(false); }
  };

  const initiatePayment = async (bookingId, method) => {
    try {
      const res = await fetch(`${API}/api/payments/my`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookingId, method }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to initiate payment");
      }
      fetchBookings();
    } catch (err) {
      alert(err.message);
    }
  };

  const openWhatsAppConfirm = (booking) => {
    const msg = `Hello, I confirm booking #${booking.id}:\nCar: ${booking.car_name}\nDate: ${booking.booking_date} at ${booking.booking_time}\nPickup: ${booking.pickup_location}\nDrop: ${booking.drop_location}\nPassengers: ${booking.passengers}\nMessage: ${booking.message || "N/A"}\nRent: ${booking.rent != null ? "Rs " + booking.rent : "Not set"}\n\nPlease proceed.`;
    window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleLogout = () => { localStorage.clear(); navigate("/login"); };

  const statusChip = (status) => {
    const base = { display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 14px", borderRadius: "30px", fontSize: "0.82rem", fontWeight: 700, textTransform: "capitalize", letterSpacing: "0.3px" };
    if (status === "Confirmed") return <span style={{ ...base, background: "#d1fae5", color: "#065f46" }}>✅ {status}</span>;
    if (status === "Completed") return <span style={{ ...base, background: "#dbeafe", color: "#1e40af" }}>🏁 {status}</span>;
    if (status === "Cancelled") return <span style={{ ...base, background: "#fee2e2", color: "#991b1b" }}>❌ {status}</span>;
    return <span style={{ ...base, background: "#fff7ed", color: "#9a3412" }}>⏳ {status}</span>;
  };

  return (
    <div style={styles.page}>
      {notification.visible && (
        <div style={styles.toastWrapper}>
          <div style={styles.toast}>
            <Bell size={18} style={{ flexShrink: 0 }} />
            <span style={styles.toastMessage}>{notification.message}</span>
            <button onClick={() => { setNotification({ visible: false, message: "" }); setNotificationQueue((prev) => prev.slice(1)); }} style={styles.toastClose}><X size={16} /></button>
          </div>
        </div>
      )}

      <div className="container" style={styles.container}>
        <div style={styles.profileHeader}>
          <div style={styles.avatar}><User size={28} color="#fff" /></div>
          <div style={styles.profileInfo}>
            <h2 style={styles.name}>{customer.name || "Customer"}</h2>
            <div style={styles.contactRow}>
              <span style={styles.contactItem}><Mail size={15} color="#64748b" /> {customer.email || "No email"}</span>
              {customer.phone && <span style={styles.contactItem}><Phone size={15} color="#64748b" /> {customer.phone}</span>}
            </div>
          </div>
          <div style={styles.headerActions}>
            <button style={styles.passwordBtn} onClick={() => setShowPasswordForm(!showPasswordForm)}><Shield size={17} /> {showPasswordForm ? "Cancel" : "Change Password"}</button>
            <button style={styles.logoutBtn} onClick={handleLogout}><LogOut size={17} /> Logout</button>
          </div>
        </div>

        {showPasswordForm && (
          <div style={styles.passwordCard}>
            <div style={styles.passwordHeader}><Key size={18} /><h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700 }}>Account Security</h3></div>
            <p style={{ color: "#64748b", marginBottom: 20, fontSize: "0.95rem" }}>Update your password to keep your account secure.</p>
            {passwordMsg && <div className="alert alert-success" style={{ borderRadius: 12 }}>{passwordMsg}</div>}
            {passwordError && <div className="alert alert-danger" style={{ borderRadius: 12 }}>{passwordError}</div>}
            <form onSubmit={handlePasswordChange}>
              <div style={styles.passwordGrid}>
                <div>
                  <label style={styles.fieldLabel}>Current Password <span style={{ color: "#94a3b8" }}>(leave blank if not set)</span></label>
                  <input type="password" style={styles.formControl} value={passwordForm.currentPassword} onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))} />
                </div>
                <div>
                  <label style={styles.fieldLabel}>New Password</label>
                  <input type="password" style={styles.formControl} value={passwordForm.newPassword} onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))} required minLength="6" />
                </div>
              </div>
              <button type="submit" style={styles.savePasswordBtn} disabled={changingPassword}>
                {changingPassword ? <><Loader2 size={16} className="me-2 animate-spin" /> Updating...</> : <><Check size={16} /> Update Password</>}
              </button>
            </form>
          </div>
        )}

        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}><Car size={22} className="me-2" /> My Bookings</h3>
          <span style={styles.bookingCount}>{bookings.length} booking{bookings.length !== 1 ? "s" : ""}</span>
        </div>

        {loading ? (
          <div style={styles.loadingBox}><Loader2 size={36} className="animate-spin text-primary" /><p style={{ color: "#64748b", marginTop: 12 }}>Loading your bookings...</p></div>
        ) : error ? (
          <div className="alert alert-danger" style={{ borderRadius: 16 }}>{error}</div>
        ) : bookings.length === 0 ? (
          <div style={styles.emptyState}>
            <Car size={40} color="#94a3b8" /><h4 style={{ color: "#475569", marginTop: 12 }}>No bookings yet</h4><p style={{ color: "#94a3b8", marginBottom: 20 }}>Your upcoming rides will appear here.</p>
            <button style={styles.browseBtn} onClick={() => navigate("/cars")}>Browse Cars <ArrowRight size={16} /></button>
          </div>
        ) : (
          <div style={styles.bookingGrid}>
            {bookings.map((booking, idx) => (
              <div key={booking.id} style={styles.bookingCard}>
                <div style={styles.bookingHeader}>
                  <div><h4 style={styles.carName}>{booking.car_name || "Car"}</h4><span style={styles.bookingId}>Booking #{idx + 1}</span></div>
                  {statusChip(booking.status)}
                </div>

                {editingId === booking.id ? (
                  <div style={styles.editForm}>
                    {editError && <div className="alert alert-danger" style={{ borderRadius: 10, padding: "8px 12px", fontSize: "0.9rem" }}>{editError}</div>}
                    <div style={styles.editGrid}>
                      <div style={styles.fullWidth}><label style={styles.fieldLabel}>Trip Type</label><select name="trip_type" value={editForm.trip_type} onChange={handleEditChange} style={styles.formSelect}><option>One Way</option><option>Round Trip</option><option>Airport Transfer</option><option>Hourly</option></select></div>
                      <div><label style={styles.fieldLabel}>Pickup</label><input type="text" name="pickup_location" value={editForm.pickup_location} onChange={handleEditChange} style={styles.formControl} /></div>
                      <div><label style={styles.fieldLabel}>Drop</label><input type="text" name="drop_location" value={editForm.drop_location} onChange={handleEditChange} style={styles.formControl} /></div>
                      <div><label style={styles.fieldLabel}>Date</label><input type="date" name="booking_date" value={editForm.booking_date} onChange={handleEditChange} style={styles.formControl} min={new Date().toISOString().split('T')[0]} /></div>
                      <div><label style={styles.fieldLabel}>Time</label><input type="time" name="booking_time" value={editForm.booking_time} onChange={handleEditChange} style={styles.formControl} /></div>
                      <div><label style={styles.fieldLabel}>Passengers</label><input type="number" name="passengers" value={editForm.passengers} onChange={handleEditChange} style={styles.formControl} min="1" /></div>
                      <div style={styles.fullWidth}><label style={styles.fieldLabel}>Message</label><textarea name="message" value={editForm.message} onChange={handleEditChange} style={styles.formTextarea} rows="2"></textarea></div>
                    </div>
                    <div style={styles.editActions}>
                      <button style={styles.saveEditBtn} onClick={() => saveEdit(booking.id)} disabled={saving}><Check size={16} /> {saving ? "Saving..." : "Save"}</button>
                      <button style={styles.cancelEditBtn} onClick={cancelEdit}><X size={16} /> Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div style={styles.bookingBody}>
                    <div style={styles.bookingInfoGrid}>
                      <div style={styles.infoItem}><MapPin size={16} color="#3b82f6" /><div><span style={styles.infoLabel}>Pickup</span><span style={styles.infoValue}>{booking.pickup_location}</span></div></div>
                      <div style={styles.infoItem}><MapPin size={16} color="#10b981" /><div><span style={styles.infoLabel}>Drop</span><span style={styles.infoValue}>{booking.drop_location}</span></div></div>
                      <div style={styles.infoItem}><Calendar size={16} color="#f59e0b" /><div><span style={styles.infoLabel}>Date</span><span style={styles.infoValue}>{booking.booking_date}</span></div></div>
                      <div style={styles.infoItem}><Clock size={16} color="#8b5cf6" /><div><span style={styles.infoLabel}>Time</span><span style={styles.infoValue}>{booking.booking_time}</span></div></div>
                      <div style={styles.infoItem}><Users size={16} color="#ec4899" /><div><span style={styles.infoLabel}>Passengers</span><span style={styles.infoValue}>{booking.passengers}</span></div></div>
                      <div style={styles.infoItem}><span style={{ fontSize: 16, color: "#6366f1" }}>💰</span><div><span style={styles.infoLabel}>Rent</span><span style={styles.infoValue}>{booking.rent != null ? `Rs ${booking.rent}` : "Not set"}</span></div></div>
                      {booking.driver_name && (
                        <div style={styles.infoItem}><span style={{ fontSize: 16, color: "#ef4444" }}>👨‍✈️</span><div><span style={styles.infoLabel}>Driver</span><span style={styles.infoValue}>{booking.driver_name} {booking.driver_phone && <a href={`tel:${booking.driver_phone}`} style={styles.driverPhoneLink}><PhoneCall size={14} className="ms-1 me-1" />{booking.driver_phone}</a>}</span></div></div>
                      )}
                    </div>

                    {booking.message && <p style={styles.bookingMessage}>💬 "{booking.message}"</p>}

                    {booking.rent != null ? (
                      paymentData[booking.id] ? (
                        <div style={styles.paymentCard}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={styles.paymentLabel}>💵 Payment</span>
                            <span className={`badge rounded-pill ${paymentData[booking.id].status === "completed" ? "bg-success" : paymentData[booking.id].status === "failed" ? "bg-danger" : "bg-warning text-dark"}`}>
                              {paymentData[booking.id].status}
                            </span>
                          </div>
                          <div style={{ marginTop: 8 }}>
                            <div><strong>Amount:</strong> Rs {paymentData[booking.id].amount}</div>
                            <div><strong>Method:</strong> {paymentData[booking.id].method === "easypaisa" ? "EasyPaisa" : "Cash"}</div>
                            {paymentData[booking.id].status === "pending" && paymentData[booking.id].method === "easypaisa" && (
                              <div style={{ marginTop: 10, padding: "10px", background: "#f0fdf4", borderRadius: 10 }}>
                                <p style={{ fontWeight: 600, margin: 0 }}>Send payment to:</p>
                                <p style={{ margin: "5px 0" }}><strong>EasyPaisa Account:</strong> {EASYPAISA_ACCOUNT}</p>
                                <p style={{ margin: "5px 0" }}><strong>Account Name:</strong> {EASYPAISA_NAME}</p>
                                <p style={{ margin: "5px 0" }}><strong>Amount:</strong> Rs {paymentData[booking.id].amount}</p>
                              </div>
                            )}
                            {paymentData[booking.id].status === "pending" && paymentData[booking.id].method === "cash" && (
                              <div style={{ marginTop: 10, padding: "10px", background: "#f0fdf4", borderRadius: 10 }}>
                                <p style={{ fontWeight: 600, margin: 0 }}>Pay Cash at ride time</p>
                                <p style={{ margin: "5px 0" }}>Rs {paymentData[booking.id].amount}</p>
                              </div>
                            )}
                            {paymentData[booking.id].note && (
                              <div style={{ marginTop: 8 }}><strong>Note:</strong> {paymentData[booking.id].note}</div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div style={{ marginTop: 12 }}>
                          <p style={{ fontWeight: 600, marginBottom: 8 }}>Select Payment Method</p>
                          <div style={{ display: "flex", gap: 10 }}>
                            <button
                              style={styles.paymentMethodBtn}
                              onClick={() => initiatePayment(booking.id, "easypaisa")}
                            >
                              <Smartphone size={16} /> EasyPaisa
                            </button>
                            <button
                              style={styles.paymentMethodBtn}
                              onClick={() => initiatePayment(booking.id, "cash")}
                            >
                              <Banknote size={16} /> Cash
                            </button>
                          </div>
                        </div>
                      )
                    ) : (
                      <div style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Rent not set by admin yet</div>
                    )}

                    <div style={styles.actionRow}>
                      {canEdit(booking.status) && (
                        <button style={styles.editBtn} onClick={() => startEdit(booking)}><Edit3 size={15} /> Edit Booking</button>
                      )}
                      {booking.driver_name && (
                        <a href={`tel:${booking.driver_phone}`} style={{ ...styles.callDriverBtn, textDecoration: "none" }}><PhoneCall size={15} /> Call Driver</a>
                      )}
                      <button style={styles.whatsappBtn} onClick={() => openWhatsAppConfirm(booking)}><MessageSquare size={15} /> WhatsApp Confirm</button>
                    </div>
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
  page: { minHeight: "100vh", background: "linear-gradient(135deg, #f0f4ff 0%, #f9fafb 100%)", padding: "40px 0", position: "relative" },
  container: { maxWidth: "1000px", margin: "0 auto", padding: "0 20px" },
  profileHeader: { background: "#ffffff", borderRadius: "24px", padding: "30px", display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap", boxShadow: "0 10px 40px rgba(0,0,0,0.05)", marginBottom: "30px" },
  avatar: { width: "70px", height: "70px", borderRadius: "50%", background: "linear-gradient(135deg, #0d6efd, #2563eb)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  profileInfo: { flex: 1 },
  name: { fontSize: "1.6rem", fontWeight: 800, color: "#0f172a", margin: "0 0 4px 0" },
  contactRow: { display: "flex", gap: "20px", flexWrap: "wrap", color: "#64748b", fontSize: "0.95rem" },
  contactItem: { display: "flex", alignItems: "center", gap: "6px" },
  headerActions: { display: "flex", gap: "10px", flexWrap: "wrap" },
  passwordBtn: { display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 18px", borderRadius: "12px", border: "1px solid #d1d5db", background: "#fff", color: "#0f172a", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" },
  logoutBtn: { display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 18px", borderRadius: "12px", border: "none", background: "#fee2e2", color: "#991b1b", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" },
  passwordCard: { background: "#fff", borderRadius: "20px", padding: "28px", boxShadow: "0 10px 30px rgba(0,0,0,0.04)", marginBottom: "30px" },
  passwordHeader: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" },
  passwordGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" },
  fieldLabel: { display: "block", fontWeight: 600, color: "#0f172a", marginBottom: "6px", fontSize: "0.9rem" },
  formControl: { width: "100%", padding: "10px 14px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "0.95rem", background: "#f8fafc", outline: "none", transition: "0.2s" },
  formSelect: { width: "100%", padding: "10px 14px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "0.95rem", background: "#f8fafc", outline: "none" },
  formTextarea: { width: "100%", padding: "10px 14px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "0.95rem", background: "#f8fafc", outline: "none", resize: "vertical" },
  savePasswordBtn: { display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px", borderRadius: "12px", background: "linear-gradient(135deg, #0d6efd, #2563eb)", color: "#fff", fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 8px 24px rgba(13,110,253,0.25)", transition: "0.2s" },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  sectionTitle: { fontSize: "1.5rem", fontWeight: 800, color: "#0f172a", margin: 0, display: "flex", alignItems: "center" },
  bookingCount: { background: "#0d6efd", color: "#fff", padding: "4px 14px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: 700 },
  loadingBox: { textAlign: "center", padding: "60px 0" },
  emptyState: { textAlign: "center", padding: "60px 20px", background: "#fff", borderRadius: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.03)" },
  browseBtn: { display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px", borderRadius: "12px", background: "#0d6efd", color: "#fff", border: "none", fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 20px rgba(13,110,253,0.2)" },
  bookingGrid: { display: "grid", gap: "24px" },
  bookingCard: { background: "#fff", borderRadius: "24px", padding: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.04)", border: "1px solid #f1f5f9" },
  bookingHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px" },
  carName: { fontSize: "1.2rem", fontWeight: 700, color: "#0f172a", margin: "0 0 4px 0" },
  bookingId: { fontSize: "0.85rem", color: "#94a3b8", fontWeight: 500 },
  bookingBody: { display: "flex", flexDirection: "column", gap: "16px" },
  bookingInfoGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px" },
  infoItem: { display: "flex", gap: "10px", alignItems: "flex-start" },
  infoLabel: { display: "block", fontSize: "0.75rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase" },
  infoValue: { display: "block", fontSize: "0.95rem", fontWeight: 600, color: "#1e293b" },
  bookingMessage: { background: "#f8fafc", padding: "12px 16px", borderRadius: "12px", fontStyle: "italic", color: "#475569", margin: 0 },
  actionRow: { display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" },
  editBtn: { display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 18px", borderRadius: "12px", border: "1px solid #fbbf24", background: "#fffbeb", color: "#92400e", fontWeight: 600, cursor: "pointer", transition: "0.2s" },
  callDriverBtn: { display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 18px", borderRadius: "12px", border: "1px solid #6366f1", background: "#eef2ff", color: "#4338ca", fontWeight: 600, cursor: "pointer" },
  whatsappBtn: { display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 18px", borderRadius: "12px", border: "1px solid #25D366", background: "#dcfce7", color: "#166534", fontWeight: 600, cursor: "pointer" },
  driverPhoneLink: { color: "#2563eb", fontWeight: 600, textDecoration: "none" },
  editForm: { marginTop: "10px" },
  editGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" },
  fullWidth: { gridColumn: "1 / -1" },
  editActions: { display: "flex", gap: "10px", marginTop: "18px" },
  saveEditBtn: { display: "inline-flex", alignItems: "center", gap: "6px", padding: "10px 20px", borderRadius: "12px", background: "#10b981", color: "#fff", border: "none", fontWeight: 700, cursor: "pointer", boxShadow: "0 6px 18px rgba(16,185,129,0.2)" },
  cancelEditBtn: { display: "inline-flex", alignItems: "center", gap: "6px", padding: "10px 20px", borderRadius: "12px", background: "#f1f5f9", color: "#475569", border: "none", fontWeight: 600, cursor: "pointer" },
  paymentCard: { background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 14, padding: 14, marginTop: 12 },
  paymentLabel: { fontWeight: 700, fontSize: "0.9rem", color: "#0f172a" },
  paymentMethodBtn: {
    display: "inline-flex", alignItems: "center", gap: "8px",
    padding: "10px 18px", borderRadius: "12px",
    border: "1px solid #d1d5db", background: "#fff",
    color: "#0f172a", fontWeight: 600, cursor: "pointer",
    transition: "all 0.2s",
  },
  toastWrapper: { position: "fixed", top: "24px", right: "24px", zIndex: 9999, maxWidth: "380px", width: "calc(100% - 48px)", animation: "slideInRight 0.45s ease" },
  toast: { background: "#065f46", color: "#fff", padding: "16px 20px", borderRadius: "16px", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 16px 40px rgba(0,0,0,0.2)", backdropFilter: "blur(10px)" },
  toastMessage: { fontSize: "0.95rem", lineHeight: 1.4, fontWeight: 500, flex: 1 },
  toastClose: { background: "transparent", border: "none", color: "#fff", cursor: "pointer", padding: "4px", opacity: 0.8 },
};

export default Profile;