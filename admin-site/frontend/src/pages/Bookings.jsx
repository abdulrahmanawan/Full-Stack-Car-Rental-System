import React, { useEffect, useMemo, useState } from "react";
import {
  Plus, Search, RefreshCw, Pencil, Trash2, Eye, X, Check,
  ChevronLeft, ChevronRight, Calendar, Clock3, CarFront,
  User, MapPin, Users, Filter, LayoutGrid, AlertTriangle,
  CircleDashed, BadgeCheck, UserPlus, DollarSign
} from "lucide-react";

const API = "http://localhost:5000";

const emptyForm = {
  customer_id: "",
  car_id: "",
  trip_type: "One Way",
  pickup_location: "",
  drop_location: "",
  booking_date: "",
  booking_time: "",
  passengers: 1,
  message: "",
  status: "Pending",
};

const steps = [
  { id: 1, title: "Booking" },
  { id: 2, title: "Details" },
];

const statusOptions = [
  { value: "Pending", label: "Pending" },
  { value: "Confirmed", label: "Confirmed" },
  { value: "Completed", label: "Completed" },
  { value: "Cancelled", label: "Cancelled" },
];

const tripTypes = ["One Way", "Round Trip", "Airport Transfer", "Hourly"];

const Bookings = () => {
  const token = localStorage.getItem("adminToken");

  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [cars, setCars] = useState([]);
  const [drivers, setDrivers] = useState([]);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [viewBooking, setViewBooking] = useState(null);

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedBookingForAssign, setSelectedBookingForAssign] = useState(null);
  const [selectedDriverId, setSelectedDriverId] = useState("");

  const [rentModalOpen, setRentModalOpen] = useState(false);
  const [selectedBookingForRent, setSelectedBookingForRent] = useState(null);
  const [rentAmount, setRentAmount] = useState("");

  const [message, setMessage] = useState("");
  const [step, setStep] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tripFilter, setTripFilter] = useState("all");

  const fetchBookings = async () => {
    try {
      setPageLoading(true);
      const res = await fetch(`${API}/api/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch {
      setMessage("Bookings load failed");
    } finally {
      setPageLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await fetch(`${API}/api/customers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCustomers(Array.isArray(data) ? data : []);
    } catch {}
  };

  const fetchCars = async () => {
    try {
      const res = await fetch(`${API}/api/cars`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCars(Array.isArray(data) ? data : []);
    } catch {}
  };

  const fetchDrivers = async () => {
    try {
      const res = await fetch(`${API}/api/drivers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDrivers(Array.isArray(data) ? data : []);
    } catch {}
  };

  useEffect(() => {
    fetchBookings();
    fetchCustomers();
    fetchCars();
    fetchDrivers();
  }, []);

  const filteredBookings = useMemo(() => {
    const q = search.toLowerCase();
    return bookings.filter((b) => {
      const searchMatch =
        b.customer_name?.toLowerCase().includes(q) ||
        b.car_name?.toLowerCase().includes(q) ||
        b.pickup_location?.toLowerCase().includes(q) ||
        b.drop_location?.toLowerCase().includes(q);
      const statusMatch = statusFilter === "all" || b.status === statusFilter;
      const tripMatch = tripFilter === "all" || b.trip_type === tripFilter;
      return searchMatch && statusMatch && tripMatch;
    });
  }, [bookings, search, statusFilter, tripFilter]);

  const stats = useMemo(() => ({
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "Pending").length,
    confirmed: bookings.filter((b) => b.status === "Confirmed").length,
    completed: bookings.filter((b) => b.status === "Completed").length,
    cancelled: bookings.filter((b) => b.status === "Cancelled").length,
  }), [bookings]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setModalOpen(false);
    setMessage("");
    setStep(1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (step !== 2) return;
    setLoading(true);
    try {
      const cleanDate = form.booking_date ? form.booking_date.split("T")[0] : "";
      const body = {
        customer_id: Number(form.customer_id),
        car_id: Number(form.car_id),
        trip_type: form.trip_type,
        pickup_location: form.pickup_location,
        drop_location: form.drop_location,
        booking_date: cleanDate,
        booking_time: form.booking_time,
        passengers: Number(form.passengers),
        message: form.message,
        status: form.status,
      };

      const url = editingId
        ? `${API}/api/bookings/${editingId}`
        : `${API}/api/bookings`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to save booking");
      }

      setMessage(editingId ? "Booking updated!" : "Booking created!");
      resetForm();
      fetchBookings();
    } catch (err) {
      console.error("Booking save error:", err);
      setMessage(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API}/api/bookings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      setMessage("Booking deleted");
      setViewBooking(null);
      fetchBookings();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const openEdit = (booking) => {
    setEditingId(booking.id);
    setForm({
      customer_id: booking.customer_id || "",
      car_id: booking.car_id || "",
      trip_type: booking.trip_type || "One Way",
      pickup_location: booking.pickup_location || "",
      drop_location: booking.drop_location || "",
      booking_date: booking.booking_date,
      booking_time: booking.booking_time || "",
      passengers: booking.passengers || 1,
      message: booking.message || "",
      status: booking.status || "Pending",
    });
    setStep(1);
    setModalOpen(true);
  };

  const openAssignDriver = (booking) => {
    setSelectedBookingForAssign(booking);
    setSelectedDriverId("");
    setAssignModalOpen(true);
  };

  const handleAssignDriver = async () => {
    if (!selectedDriverId || !selectedBookingForAssign) return;
    try {
      const res = await fetch(`${API}/api/drivers/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookingId: selectedBookingForAssign.id,
          driverId: Number(selectedDriverId),
        }),
      });
      if (!res.ok) throw new Error("Assignment failed");
      setMessage("Driver assigned successfully!");
      setAssignModalOpen(false);
      setSelectedBookingForAssign(null);
      fetchBookings();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const openRentModal = (booking) => {
    setSelectedBookingForRent(booking);
    setRentAmount(booking.rent || "");
    setRentModalOpen(true);
  };

  const handleSetRent = async () => {
    if (!selectedBookingForRent) return;
    const rentValue = parseFloat(rentAmount);
    if (isNaN(rentValue) || rentValue < 0) {
      setMessage("Please enter a valid rent amount.");
      return;
    }
    try {
      const res = await fetch(`${API}/api/bookings/${selectedBookingForRent.id}/rent`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rent: rentValue }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to set rent");
      }
      setMessage("Rent updated!");
      setRentModalOpen(false);
      setSelectedBookingForRent(null);
      fetchBookings();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const statusChip = (status) => {
    if (status === "Pending") return "status-chip pending";
    if (status === "Confirmed") return "status-chip confirmed";
    if (status === "Completed") return "status-chip completed";
    return "status-chip cancelled";
  };

  return (
    <div className="bookings-page" style={{ fontSize: "0.92rem", padding: "12px" }}>
      <style>{`
        .bookings-page {
          min-height: 100%;
          color: #0f172a;
        }
        .page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }
        .page-title {
          margin: 0;
          font-size: 1.35rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #0f172a;
        }
        .page-subtitle {
          margin: 2px 0 0;
          color: #64748b;
          font-size: 0.85rem;
        }
        .top-actions { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
        .icon-btn {
          height: 38px;
          border-radius: 10px;
          border: 1px solid rgba(15,23,42,0.08);
          background: rgba(255,255,255,0.94);
          color: #0f172a;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 0 14px;
          transition: all 0.18s ease;
          box-shadow: 0 8px 20px rgba(15,23,42,0.04);
          backdrop-filter: blur(10px);
          font-size: 0.85rem;
        }
        .icon-btn:hover { transform: translateY(-1px); border-color: rgba(13,110,253,0.18); background: #fff; }
        .icon-btn.primary { background: linear-gradient(135deg, #0d6efd, #2563eb 45%, #3b82f6); color: #fff; border-color: transparent; }
        .quick-stats { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-bottom: 14px; }
        .stat-card {
          background: rgba(255,255,255,0.94);
          border: 1px solid rgba(15,23,42,0.08);
          border-radius: 14px;
          padding: 14px 16px;
          box-shadow: 0 8px 20px rgba(15,23,42,0.04);
          backdrop-filter: blur(10px);
        }
        .stat-label { color: #64748b; font-size: 0.78rem; margin-bottom: 4px; }
        .stat-value { font-size: 1.25rem; font-weight: 800; letter-spacing: -0.02em; color: #0f172a; line-height: 1; }
        .stat-note { color: #94a3b8; font-size: 0.75rem; margin-top: 6px; }
        .toolbar-grid { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 14px; }
        .table-card {
          background: rgba(255,255,255,0.95);
          border: 1px solid rgba(15,23,42,0.08);
          border-radius: 18px;
          padding: 16px;
          box-shadow: 0 8px 20px rgba(15,23,42,0.04);
          overflow: hidden;
        }
        .table-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; gap: 8px; flex-wrap: wrap; }
        .table-title { margin: 0; font-size: 1rem; font-weight: 800; color: #0f172a; }
        .table-note { font-size: 0.82rem; color: #64748b; }
        .status-chip { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 0.78rem; font-weight: 600; }
        .status-chip.pending { background: #fff3cd; color: #856404; }
        .status-chip.confirmed { background: #d1e7dd; color: #0f5132; }
        .status-chip.completed { background: #cfe2ff; color: #084298; }
        .status-chip.cancelled { background: #f8d7da; color: #842029; }
        .modal-backdrop-custom {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15,23,42,0.5); display: flex; align-items: center; justify-content: center; z-index: 999;
        }
        .modal-shell {
          background: white; border-radius: 24px; width: 90%; max-width: 720px;
          max-height: 90vh; overflow-y: auto; padding: 28px;
        }
        .modal-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
        .modal-title { font-size: 1.25rem; font-weight: 800; color: #0f172a; }
        .modal-subtitle { font-size: 0.82rem; color: #64748b; }
        .modal-close { background: none; border: none; cursor: pointer; color: #64748b; }
        .stepper { display: flex; gap: 8px; margin-bottom: 20px; }
        .step-chip {
          display: flex; align-items: center; gap: 6px; background: #f1f5f9;
          padding: 6px 14px; border-radius: 30px; font-size: 0.82rem; font-weight: 500; color: #64748b;
        }
        .step-chip.active { background: #0d6efd; color: white; }
        .modal-body { flex: 1; }
        .modal-grid { display: flex; flex-direction: column; gap: 16px; }
        .section-block { display: flex; flex-direction: column; gap: 6px; }
        .section-label { font-weight: 600; color: #0f172a; font-size: 0.88rem; }
        .control {
          width: 100%; padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 10px; background: white; font-size: 0.88rem;
        }
        .modal-footer {
          display: flex; justify-content: space-between; align-items: center;
          padding-top: 18px; border-top: 1px solid #e2e8f0; margin-top: 18px;
        }
        .footer-actions { display: flex; gap: 8px; }
        .footer-btn {
          display: flex; align-items: center; gap: 6px; background: #f1f5f9;
          border: none; border-radius: 8px; padding: 8px 14px; font-weight: 600; cursor: pointer; font-size: 0.85rem;
        }
        .footer-btn.primary { background: #0d6efd; color: white; }
        @media (max-width: 992px) { .quick-stats { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .quick-stats { grid-template-columns: 1fr; } }
      `}</style>

      
      <div className="page-header">
        <div>
          <h2 className="page-title">Bookings</h2>
          <p className="page-subtitle">Manage customer bookings, confirmations and trips.</p>
        </div>
        <div className="top-actions">
          <button className="icon-btn" onClick={fetchBookings}><RefreshCw size={16} /> Refresh</button>
          <button className="icon-btn primary" onClick={() => { resetForm(); setModalOpen(true); }}><Plus size={16} /> Add Booking</button>
        </div>
      </div>

      {message && <div className="alert alert-info rounded-3 shadow-sm" style={{ padding: "8px 12px", fontSize: "0.85rem", marginBottom: "12px" }}>{message}</div>}

      
      <div className="quick-stats">
        <div className="stat-card"><div className="stat-label">Total</div><div className="stat-value">{stats.total}</div><div className="stat-note">All bookings</div></div>
        <div className="stat-card"><div className="stat-label">Pending</div><div className="stat-value">{stats.pending}</div><div className="stat-note">Waiting</div></div>
        <div className="stat-card"><div className="stat-label">Confirmed</div><div className="stat-value">{stats.confirmed}</div><div className="stat-note">Approved</div></div>
        <div className="stat-card"><div className="stat-label">Completed</div><div className="stat-value">{stats.completed}</div><div className="stat-note">Finished</div></div>
        <div className="stat-card"><div className="stat-label">Cancelled</div><div className="stat-value">{stats.cancelled}</div><div className="stat-note">Rejected</div></div>
      </div>

      
      <div className="toolbar-grid">
        <div className="input-group" style={{ flex: 1 }}>
          <span className="input-group-text"><Search size={16} /></span>
          <input type="text" className="form-control" style={{ fontSize: "0.88rem" }} placeholder="Search customer, car, pickup or drop..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="form-select" style={{ fontSize: "0.85rem" }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          {statusOptions.map((item) => (<option key={item.value} value={item.value}>{item.label}</option>))}
        </select>
        <select className="form-select" style={{ fontSize: "0.85rem" }} value={tripFilter} onChange={(e) => setTripFilter(e.target.value)}>
          <option value="all">All Trip Types</option>
          {tripTypes.map((trip) => (<option key={trip} value={trip}>{trip}</option>))}
        </select>
        <button className="icon-btn" onClick={() => { setSearch(""); setTripFilter("all"); setStatusFilter("all"); }}><Filter size={15} /> Clear</button>
      </div>

      
      <div className="table-card">
        <div className="table-head">
          <div>
            <h3 className="table-title">Booking List</h3>
            <div className="table-note">Showing {filteredBookings.length} of {bookings.length} bookings</div>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table align-middle mb-0" style={{ fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ fontSize: "0.78rem" }}>
                <th>#</th>
                <th>Customer</th>
                <th>Car</th>
                <th>Trip</th>
                <th>Date</th>
                <th>Status</th>
                <th>Driver</th>
                <th>Rent</th>
                <th width="220">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageLoading ? (
                <tr><td colSpan="9" className="text-center py-5"><RefreshCw size={20} className="me-2" style={{ animation: "spin 1s linear infinite" }} /> Loading...</td></tr>
              ) : filteredBookings.length === 0 ? (
                <tr><td colSpan="9" className="text-center py-5"><LayoutGrid size={32} className="mb-2 text-secondary" /><div className="fw-bold">No Booking Found</div><small className="text-muted">Try another search or create booking.</small></td></tr>
              ) : (
                filteredBookings.map((booking, index) => (
                  <tr key={booking.id}>
                    <td><strong>#{index + 1}</strong></td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}><User size={16} /></div>
                        <div><div className="fw-bold">{booking.customer_name}</div><small className="text-muted">{booking.phone}</small></div>
                      </div>
                    </td>
                    <td><div className="fw-semibold">{booking.car_name}</div></td>
                    <td>
                      <span className="badge bg-light text-dark">{booking.trip_type}</span>
                      <div className="small text-muted mt-1" style={{ maxWidth: 200 }}><MapPin size={12} className="me-1" />{booking.pickup_location}</div>
                    </td>
                    <td><div className="fw-semibold">{booking.booking_date}</div><small className="text-muted">{booking.booking_time}</small></td>
                    <td><span className={statusChip(booking.status)}>{booking.status}</span></td>
                    <td>
                      {booking.driver_name ? (
                        <span className="badge bg-success">{booking.driver_name}</span>
                      ) : booking.status === "Confirmed" ? (
                        <button className="btn btn-success btn-sm" onClick={() => openAssignDriver(booking)}>
                          <UserPlus size={13} className="me-1" /> Assign
                        </button>
                      ) : (<span className="text-muted">—</span>)}
                    </td>
                    <td>
                      {booking.rent != null ? (
                        <span className="fw-semibold">Rs {booking.rent}</span>
                      ) : (
                        <button className="btn btn-outline-primary btn-sm" onClick={() => openRentModal(booking)}>
                          <DollarSign size={13} className="me-1" /> Set Rent
                        </button>
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-2 flex-wrap">
                        <button className="btn btn-light btn-sm" onClick={() => setViewBooking(booking)}><Eye size={14} /></button>
                        <button className="btn btn-warning btn-sm" onClick={() => openEdit(booking)}><Pencil size={14} /></button>
                        <button className="btn btn-danger btn-sm" onClick={() => { if (window.confirm("Delete this booking?")) handleDelete(booking.id); }}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      
      {modalOpen && (
        <div className="modal-backdrop-custom" onClick={resetForm}>
          <div className="modal-shell" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <h3 className="modal-title">{editingId ? "Edit Booking" : "New Booking"}</h3>
                <p className="modal-subtitle">Step {step} of {steps.length}</p>
              </div>
              <button className="modal-close" onClick={resetForm}><X size={18} /></button>
            </div>

            <div className="stepper">
              {steps.map((item) => (
                <div key={item.id} className={`step-chip ${step === item.id ? "active" : ""}`}>
                  <span>{item.id}</span><span>{item.title}</span>
                </div>
              ))}
            </div>

            <form>
              <div className="modal-body">
                {step === 1 && (
                  <div className="modal-grid">
                    <div className="section-block">
                      <label className="section-label">Customer</label>
                      <select className="form-select control" name="customer_id" value={form.customer_id} onChange={handleChange} required>
                        <option value="">Select Customer</option>
                        {customers.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                      </select>
                    </div>
                    <div className="section-block">
                      <label className="section-label">Car</label>
                      <select className="form-select control" name="car_id" value={form.car_id} onChange={handleChange} required>
                        <option value="">Select Car</option>
                        {cars.map((car) => (<option key={car.id} value={car.id}>{car.name}{car.plate ? ` (${car.plate})` : ""}</option>))}
                      </select>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Trip Type</label>
                      <select className="form-select" name="trip_type" value={form.trip_type} onChange={handleChange}>
                        {tripTypes.map((t) => (<option key={t} value={t}>{t}</option>))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Status</label>
                      <select className="form-select" name="status" value={form.status} onChange={handleChange}>
                        {statusOptions.map((s) => (<option key={s.value} value={s.value}>{s.label}</option>))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Pickup Location</label>
                      <input type="text" className="form-control" name="pickup_location" value={form.pickup_location} onChange={handleChange} placeholder="Enter pickup location" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Drop Location</label>
                      <input type="text" className="form-control" name="drop_location" value={form.drop_location} onChange={handleChange} placeholder="Enter drop location" />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Booking Date</label>
                      <input
                        type="date" className="form-control" name="booking_date" value={form.booking_date} onChange={handleChange} min={new Date().toISOString().split('T')[0]} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Booking Time</label>
                      <input type="time" className="form-control" name="booking_time" value={form.booking_time} onChange={handleChange} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Passengers</label>
                      <input type="number" className="form-control" min="1" name="passengers" value={form.passengers} onChange={handleChange} />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Message</label>
                      <textarea rows="4" className="form-control" name="message" value={form.message} onChange={handleChange} placeholder="Special Instructions..." />
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <div className="d-flex justify-content-between w-100">
                  <div>
                    {step > 1 && (
                      <button type="button" className="btn btn-outline-secondary px-3" onClick={() => setStep(step - 1)}>
                        <ChevronLeft size={16} className="me-1" /> Previous
                      </button>
                    )}
                  </div>
                  <div className="d-flex gap-2">
                    <button type="button" className="btn btn-light px-3" onClick={resetForm}>Cancel</button>
                    {step === 1 ? (
                      <button type="button" className="btn btn-primary px-3" onClick={() => setStep(2)}>
                        Next <ChevronRight size={16} className="ms-1" />
                      </button>
                    ) : (
                      <button type="button" className="btn btn-success px-3" disabled={loading} onClick={handleSave}>
                        {loading ? (
                          <><span className="spinner-border spinner-border-sm me-2"></span> Saving...</>
                        ) : editingId ? (
                          <><Check size={16} className="me-2" /> Update</>
                        ) : (
                          <><Check size={16} className="me-2" /> Save</>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      
      {viewBooking && (
        <div className="modal-backdrop-custom" onClick={() => setViewBooking(null)}>
          <div className="modal-shell" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3 className="modal-title">Booking #{viewBooking.id}</h3>
              <button className="modal-close" onClick={() => setViewBooking(null)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-6"><label className="fw-semibold">Customer</label><p className="text-muted">{viewBooking.customer_name}</p></div>
                <div className="col-6"><label className="fw-semibold">Car</label><p className="text-muted">{viewBooking.car_name}</p></div>
                <div className="col-6"><label className="fw-semibold">Trip Type</label><p className="text-muted">{viewBooking.trip_type}</p></div>
                <div className="col-6"><label className="fw-semibold">Status</label><span className={statusChip(viewBooking.status)}>{viewBooking.status}</span></div>
                <div className="col-6"><label className="fw-semibold">Pickup</label><p className="text-muted">{viewBooking.pickup_location}</p></div>
                <div className="col-6"><label className="fw-semibold">Drop</label><p className="text-muted">{viewBooking.drop_location}</p></div>
                <div className="col-6"><label className="fw-semibold">Date</label><p className="text-muted">{viewBooking.booking_date}</p></div>
                <div className="col-6"><label className="fw-semibold">Time</label><p className="text-muted">{viewBooking.booking_time}</p></div>
                <div className="col-6"><label className="fw-semibold">Passengers</label><p className="text-muted">{viewBooking.passengers}</p></div>
                <div className="col-6"><label className="fw-semibold">Driver</label><p className="text-muted">{viewBooking.driver_name || "—"}</p></div>
                <div className="col-6"><label className="fw-semibold">Rent</label><p className="text-muted">{viewBooking.rent != null ? `Rs ${viewBooking.rent}` : "Not set"}</p></div>
                <div className="col-6"><label className="fw-semibold">Customer Confirmed</label><p className="text-muted">{viewBooking.customer_confirmed ? "Yes" : "No"}</p></div>
                <div className="col-12"><label className="fw-semibold">Message</label><p className="text-muted">{viewBooking.message || "—"}</p></div>
              </div>
            </div>
            <div className="modal-footer">
              <div className="text-muted small">Booking ID : #{viewBooking.id}</div>
              <div className="footer-actions">
                <button className="footer-btn" onClick={() => { setViewBooking(null); openEdit(viewBooking); }}><Pencil size={16} /> Edit</button>
                <button className="footer-btn" onClick={() => handleDelete(viewBooking.id)}><Trash2 size={16} /> Delete</button>
                <button className="footer-btn primary" onClick={() => setViewBooking(null)}><X size={16} /> Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      
      {assignModalOpen && selectedBookingForAssign && (
        <div className="modal-backdrop-custom" onClick={() => setAssignModalOpen(false)}>
          <div className="modal-shell" style={{ maxWidth: "450px" }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3 className="modal-title">Assign Driver</h3>
              <button className="modal-close" onClick={() => setAssignModalOpen(false)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <p className="text-muted mb-3">Booking #{selectedBookingForAssign.id} ({selectedBookingForAssign.customer_name})</p>
              <div className="mb-3">
                <label className="form-label fw-semibold">Select Driver</label>
                <select className="form-select" value={selectedDriverId} onChange={(e) => setSelectedDriverId(e.target.value)}>
                  <option value="">-- Choose a driver --</option>
                  {drivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>{driver.name} ({driver.phone})</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-light" onClick={() => setAssignModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" disabled={!selectedDriverId} onClick={handleAssignDriver}><Check size={16} className="me-1" /> Assign</button>
            </div>
          </div>
        </div>
      )}

      
      {rentModalOpen && selectedBookingForRent && (
        <div className="modal-backdrop-custom" onClick={() => setRentModalOpen(false)}>
          <div className="modal-shell" style={{ maxWidth: "450px" }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3 className="modal-title">Set Rent</h3>
              <button className="modal-close" onClick={() => setRentModalOpen(false)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <p className="text-muted mb-3">Booking #{selectedBookingForRent.id} ({selectedBookingForRent.customer_name})</p>
              <div className="mb-3">
                <label className="form-label fw-semibold">Rent Amount (Rs)</label>
                <input type="number" className="form-control" value={rentAmount} onChange={(e) => setRentAmount(e.target.value)} min="0" placeholder="Enter rent amount" />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-light" onClick={() => setRentModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSetRent}><Check size={16} className="me-1" /> Set Rent</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;