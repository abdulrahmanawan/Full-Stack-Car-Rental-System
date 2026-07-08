import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CarFront, Users, CalendarCheck2, Wallet, TrendingUp,
  Clock3, CircleCheckBig, CircleX, RefreshCw,
} from "lucide-react";

const API = "http://localhost:5000";

const Dashboard = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalCars: 0, totalCustomers: 0, totalBookings: 0, revenue: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const adminRes = await fetch(`${API}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (adminRes.ok) { const adminData = await adminRes.json(); setAdmin(adminData); }

        const [carsRes, customersRes, bookingsRes] = await Promise.all([
          fetch(`${API}/api/cars`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API}/api/customers`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API}/api/bookings`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const carsData = carsRes.ok ? await carsRes.json() : [];
        const customersData = customersRes.ok ? await customersRes.json() : [];
        const bookingsData = bookingsRes.ok ? await bookingsRes.json() : [];
        const revenue = bookingsData
          .filter(b => b.rent != null && (b.status === "Confirmed" || b.status === "Completed"))
          .reduce((sum, b) => sum + Number(b.rent), 0);

        setStats({ totalCars: carsData.length, totalCustomers: customersData.length, totalBookings: bookingsData.length, revenue });
        setRecentBookings(bookingsData.slice(0, 6));
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    if (token) fetchData();
  }, [token]);

  const statCards = [
    { title: "Total Cars", value: stats.totalCars, icon: <CarFront size={20} />, color: "#0d6efd", bg: "rgba(13,110,253,0.12)" },
    { title: "Customers", value: stats.totalCustomers, icon: <Users size={20} />, color: "#198754", bg: "rgba(25,135,84,0.12)" },
    { title: "Bookings", value: stats.totalBookings, icon: <CalendarCheck2 size={20} />, color: "#f59e0b", bg: "rgba(245,158,11,0.16)" },
    { title: "Revenue", value: `Rs ${stats.revenue.toLocaleString()}`, icon: <Wallet size={20} />, color: "#0dcaf0", bg: "rgba(13,202,240,0.12)" },
  ];

  const getStatusBadge = (status) => {
    const map = { Pending: "bg-warning text-dark", Confirmed: "bg-success", Completed: "bg-info text-dark", Cancelled: "bg-danger" };
    return map[status] || "bg-secondary";
  };

  return (
    <div className="container-fluid px-0" style={{ fontSize: "0.95rem" }}>
      <div className="card border-0 shadow-sm rounded-4 mb-3 overflow-hidden" style={{ background: "linear-gradient(135deg, #0d6efd 0%, #6610f2 55%, #111827 100%)" }}>
        <div className="card-body p-3 p-md-4 text-white">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <span className="badge text-bg-light text-dark mb-2 rounded-pill px-3 py-1" style={{ fontSize: "0.82rem" }}>Car Rental Admin Dashboard</span>
              <h2 className="fw-bold mb-1" style={{ fontSize: "1.5rem" }}>{loading ? "Loading..." : `Welcome back, ${admin?.name || "Admin"}`}</h2>
              <p className="text-white-50 mb-0" style={{ fontSize: "0.9rem" }}>Manage cars, customers, bookings, and revenue.</p>
            </div>
            <div className="col-lg-4 mt-3 mt-lg-0 text-lg-end">
              <div className="d-inline-flex align-items-center gap-2 bg-white bg-opacity-10 px-3 py-1 rounded-pill" style={{ fontSize: "0.85rem" }}>
                <TrendingUp size={18} />
                <span className="fw-medium">System Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-3">
        {statCards.map((item, idx) => (
          <div className="col-6 col-xl-3" key={idx}>
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-3 d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted mb-1" style={{ fontSize: "0.82rem" }}>{item.title}</p>
                  <h3 className="fw-bold mb-0" style={{ fontSize: "1.35rem" }}>{item.value}</h3>
                </div>
                <div className="d-flex align-items-center justify-content-center rounded-3" style={{ width: "48px", height: "48px", background: item.bg, color: item.color }}>{item.icon}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3">
        <div className="col-12 col-xl-8">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-3 p-md-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div>
                  <h5 className="fw-bold mb-0" style={{ fontSize: "1.1rem" }}>Recent Bookings</h5>
                  <small className="text-muted">Latest requests</small>
                </div>
                <button className="btn btn-sm btn-outline-primary rounded-pill" style={{ fontSize: "0.82rem" }} onClick={() => navigate("/bookings")}>View All</button>
              </div>
              <div className="table-responsive">
                <table className="table align-middle mb-0" style={{ fontSize: "0.88rem" }}>
                  <thead>
                    <tr className="text-muted" style={{ fontSize: "0.8rem" }}><th>#</th><th>Customer</th><th>Car</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={4} className="text-center py-3"><RefreshCw size={20} className="animate-spin" /></td></tr>
                    ) : recentBookings.length === 0 ? (
                      <tr><td colSpan={4} className="text-center text-muted py-3">No bookings yet</td></tr>
                    ) : (
                      recentBookings.map((booking, idx) => (
                        <tr key={booking.id}>
                          <td className="fw-semibold">#{idx + 1}</td>
                          <td>{booking.customer_name || "—"}</td>
                          <td>{booking.car_name || "—"}</td>
                          <td><span className={`badge rounded-pill px-2 py-1 ${getStatusBadge(booking.status)}`} style={{ fontSize: "0.78rem" }}>{booking.status}</span></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-4">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-3 p-md-4">
              <h5 className="fw-bold mb-2" style={{ fontSize: "1.1rem" }}>Quick Actions</h5>
              <div className="d-grid gap-2">
                <button className="btn btn-primary rounded-3 d-flex align-items-center gap-2" style={{ fontSize: "0.9rem" }} onClick={() => navigate("/cars")}><CarFront size={18} />Add New Car</button>
                <button className="btn btn-outline-success rounded-3 d-flex align-items-center gap-2" style={{ fontSize: "0.9rem" }} onClick={() => navigate("/customers")}><Users size={18} />Add Customer</button>
                <button className="btn btn-outline-warning rounded-3 d-flex align-items-center gap-2" style={{ fontSize: "0.9rem" }} onClick={() => navigate("/bookings")}><CalendarCheck2 size={18} />Manage Bookings</button>
                <button className="btn btn-outline-dark rounded-3 d-flex align-items-center gap-2" style={{ fontSize: "0.9rem" }} onClick={() => navigate("/payments")}><Wallet size={18} />View Payments</button>
              </div>
              <hr className="my-3" />
              <h6 className="fw-bold mb-2" style={{ fontSize: "0.95rem" }}>Today Summary</h6>
              <div className="d-flex justify-content-between align-items-center mb-2" style={{ fontSize: "0.85rem" }}>
                <span className="text-muted"><Clock3 size={14} className="me-1" />Pending</span>
                <span className="fw-semibold">{recentBookings.filter(b => b.status === "Pending").length}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2" style={{ fontSize: "0.85rem" }}>
                <span className="text-muted"><CircleCheckBig size={14} className="me-1 text-success" />Confirmed</span>
                <span className="fw-semibold">{recentBookings.filter(b => b.status === "Confirmed").length}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center" style={{ fontSize: "0.85rem" }}>
                <span className="text-muted"><CircleX size={14} className="me-1 text-danger" />Cancelled</span>
                <span className="fw-semibold">{recentBookings.filter(b => b.status === "Cancelled").length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;