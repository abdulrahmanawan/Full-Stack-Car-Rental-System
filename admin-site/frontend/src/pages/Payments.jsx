import React, { useEffect, useState } from "react";
import {
  Search, RefreshCw, Check, X, Filter, Eye,
} from "lucide-react";

const API = "http://localhost:5000";

const Payments = () => {
  const token = localStorage.getItem("adminToken");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [message, setMessage] = useState("");

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [note, setNote] = useState("");
  const [updating, setUpdating] = useState(false);

  const [bookingIndexMap, setBookingIndexMap] = useState({});

  const fetchData = async () => {
    try {
      setLoading(true);
      const [payRes, bookRes] = await Promise.all([
        fetch(`${API}/api/payments`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API}/api/bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const payData = payRes.ok ? await payRes.json() : [];
      const bookData = bookRes.ok ? await bookRes.json() : [];

      const indexMap = {};
      if (Array.isArray(bookData)) {
        bookData.forEach((booking, idx) => {
          indexMap[booking.id] = idx + 1;
        });
      }
      setBookingIndexMap(indexMap);
      setPayments(Array.isArray(payData) ? payData : []);
    } catch {
      setMessage("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = payments.filter(p => {
    const q = search.toLowerCase();
    const matchSearch =
      p.customer_name?.toLowerCase().includes(q) ||
      p.car_name?.toLowerCase().includes(q) ||
      String(p.booking_id).includes(q);
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openStatusModal = (payment) => {
    setSelectedPayment(payment);
    setNewStatus(payment.status);
    setNote(payment.note || "");
    setStatusModalOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedPayment) return;
    setUpdating(true);
    try {
      const res = await fetch(`${API}/api/payments/${selectedPayment.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus, note }),
      });
      if (!res.ok) throw new Error("Update failed");
      setMessage("Payment status updated!");
      setStatusModalOpen(false);
      fetchData();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const statusBadge = (status) => {
    const map = {
      pending: "bg-warning text-dark",
      completed: "bg-success",
      failed: "bg-danger",
    };
    return map[status] || "bg-secondary";
  };

  return (
    <div className="p-3" style={{ fontSize: "0.92rem" }}>
      <style>{`
        .modal-backdrop-custom {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15,23,42,0.5); display: flex; align-items: center; justify-content: center; z-index: 999;
        }
        .modal-shell {
          background: white; border-radius: 24px; width: 90%; max-width: 450px;
          max-height: 90vh; overflow-y: auto; padding: 24px;
        }
        .modal-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
        .modal-title { font-size: 1.25rem; font-weight: 800; color: #0f172a; }
        .modal-close { background: none; border: none; cursor: pointer; color: #64748b; }
        .modal-footer {
          display: flex; justify-content: flex-end; gap: 10px;
          padding-top: 18px; border-top: 1px solid #e2e8f0; margin-top: 18px;
        }
        .form-control, .form-select { font-size: 0.9rem; }
      `}</style>

      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
        <div>
          <h2 className="fw-bold mb-0" style={{ fontSize: "1.35rem" }}>Payments</h2>
          <p className="text-muted mb-0" style={{ fontSize: "0.85rem" }}>View & update payment records</p>
        </div>
        <button className="btn btn-sm btn-outline-secondary" onClick={fetchData}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {message && <div className="alert alert-info py-2" style={{ fontSize: "0.85rem" }}>{message}</div>}

      <div className="d-flex gap-2 mb-3 flex-wrap">
        <div className="input-group" style={{ maxWidth: 300 }}>
          <span className="input-group-text"><Search size={16} /></span>
          <input type="text" className="form-control" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-select" style={{ maxWidth: 180, fontSize: "0.85rem" }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
        <button className="btn btn-sm btn-light" onClick={() => { setSearch(""); setStatusFilter("all"); }}>
          <Filter size={16} /> Clear
        </button>
      </div>

      <div className="table-responsive bg-white rounded-4 shadow-sm">
        <table className="table align-middle mb-0" style={{ fontSize: "0.85rem" }}>
          <thead>
            <tr style={{ fontSize: "0.8rem" }}>
              <th>#</th><th>Booking</th><th>Customer</th><th>Car</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="9" className="text-center py-4">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="9" className="text-center py-4 text-muted">No payments found</td></tr>
            ) : (
              filtered.map((payment, index) => {
                const bookingSerial = bookingIndexMap[payment.booking_id] || payment.booking_id;
                return (
                  <tr key={payment.id}>
                    <td className="fw-semibold">#{index + 1}</td>
                    <td>#{bookingSerial}</td>
                    <td>{payment.customer_name}</td>
                    <td>{payment.car_name}</td>
                    <td className="fw-semibold">Rs {payment.amount}</td>
                    <td className="text-capitalize">{payment.method}</td>
                    <td><span className={`badge rounded-pill ${statusBadge(payment.status)}`}>{payment.status}</span></td>
                    <td>{new Date(payment.created_at).toLocaleDateString()}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary" onClick={() => openStatusModal(payment)}>
                        <Eye size={14} /> Update
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {statusModalOpen && selectedPayment && (
        <div className="modal-backdrop-custom" onClick={() => setStatusModalOpen(false)}>
          <div className="modal-shell" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h3 className="modal-title">Update Payment #{selectedPayment.id}</h3>
              <button className="modal-close" onClick={() => setStatusModalOpen(false)}><X size={18} /></button>
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Status</label>
              <select className="form-select" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Note (optional)</label>
              <textarea className="form-control" rows="2" value={note} onChange={e => setNote(e.target.value)}></textarea>
            </div>
            <div className="modal-footer">
              <button className="btn btn-light" onClick={() => setStatusModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleStatusUpdate} disabled={updating}>
                {updating ? "Saving..." : <><Check size={16} className="me-1" /> Save</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;