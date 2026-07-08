import React, { useEffect, useMemo, useState } from "react";
import {
  Plus, Search, RefreshCw, Pencil, Trash2, Eye, X, Check,
  User, Phone, Mail, Filter, LayoutGrid, Calendar,
} from "lucide-react";

const API = "http://localhost:5000";
const emptyForm = { name: "", phone: "", email: "" };

const Customers = () => {
  const token = localStorage.getItem("adminToken");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewCustomer, setViewCustomer] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/customers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch customers");
      const data = await res.json();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      setMessage("Could not load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  const filteredCustomers = useMemo(() => {
    const q = search.toLowerCase();
    return customers.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q)
    );
  }, [customers, search]);

  const stats = useMemo(
    () => ({
      total: customers.length,
      today: customers.filter((c) => {
        const today = new Date().toISOString().split("T")[0];
        return c.created_at?.startsWith(today);
      }).length,
    }),
    [customers]
  );

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setModalOpen(false);
    setMessage("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const openCreate = () => { resetForm(); setModalOpen(true); };
  const openEdit = (customer) => {
    setEditingId(customer.id);
    setForm({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const url = editingId
        ? `${API}/api/customers/${editingId}`
        : `${API}/api/customers`;
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Operation failed");
      }
      setMessage(editingId ? "Customer updated!" : "Customer created!");
      resetForm();
      fetchCustomers();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      const res = await fetch(`${API}/api/customers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      setMessage("Customer deleted");
      setViewCustomer(null);
      fetchCustomers();
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="customers-page" style={{ fontSize: "0.92rem", padding: "12px" }}>
      <style>{`
        .customers-page {
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
        .top-actions {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
        }
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
        .icon-btn:hover {
          transform: translateY(-1px);
          border-color: rgba(13,110,253,0.18);
          background: #fff;
        }
        .icon-btn.primary {
          background: linear-gradient(135deg, #0d6efd, #2563eb 45%, #3b82f6);
          color: #fff;
          border-color: transparent;
        }
        .quick-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-bottom: 14px;
        }
        .stat-card {
          background: rgba(255,255,255,0.94);
          border: 1px solid rgba(15,23,42,0.08);
          border-radius: 14px;
          padding: 14px 16px;
          box-shadow: 0 8px 20px rgba(15,23,42,0.04);
          backdrop-filter: blur(10px);
        }
        .stat-label {
          color: #64748b;
          font-size: 0.78rem;
          margin-bottom: 4px;
        }
        .stat-value {
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #0f172a;
          line-height: 1;
        }
        .stat-note {
          color: #94a3b8;
          font-size: 0.75rem;
          margin-top: 6px;
        }
        .toolbar-grid {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 14px;
        }
        .table-card {
          background: rgba(255,255,255,0.95);
          border: 1px solid rgba(15,23,42,0.08);
          border-radius: 18px;
          padding: 16px;
          box-shadow: 0 8px 20px rgba(15,23,42,0.04);
          overflow: hidden;
        }
        .table-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
          gap: 8px;
          flex-wrap: wrap;
        }
        .table-title {
          margin: 0;
          font-size: 1rem;
          font-weight: 800;
          color: #0f172a;
        }
        .table-note {
          font-size: 0.82rem;
          color: #64748b;
        }
        .modal-backdrop-custom {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15,23,42,0.5);
          display: flex; align-items: center; justify-content: center;
          z-index: 999;
        }
        .modal-shell {
          background: white;
          border-radius: 24px;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 28px;
        }
        .modal-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
        }
        .modal-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0f172a;
        }
        .modal-close {
          background: none;
          border: none;
          cursor: pointer;
          color: #64748b;
        }
        .form-control {
          min-height: 46px;
          border-radius: 12px !important;
          border: 1px solid #dbe3ef !important;
          font-size: 0.9rem;
        }
        @media (max-width: 600px) {
          .quick-stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* ----- PAGE HEADER ----- */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Customers</h2>
          <p className="page-subtitle">Manage all customer profiles</p>
        </div>
        <div className="top-actions">
          <button className="icon-btn" onClick={fetchCustomers}>
            <RefreshCw size={16} /> Refresh
          </button>
          <button className="icon-btn primary" onClick={openCreate}>
            <Plus size={16} /> Add Customer
          </button>
        </div>
      </div>

      {message && <div className="alert alert-info rounded-3 shadow-sm" style={{ padding: "8px 12px", fontSize: "0.85rem", marginBottom: "12px" }}>{message}</div>}

      {/* ----- STATS ----- */}
      <div className="quick-stats">
        <div className="stat-card">
          <div className="stat-label">Total Customers</div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-note">All registered customers</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">New Today</div>
          <div className="stat-value">{stats.today}</div>
          <div className="stat-note">Customers added today</div>
        </div>
      </div>

      {/* ----- TOOLBAR ----- */}
      <div className="toolbar-grid">
        <div className="input-group" style={{ flex: 1 }}>
          <span className="input-group-text"><Search size={16} /></span>
          <input
            type="text" className="form-control" style={{ fontSize: "0.88rem" }}
            placeholder="Search by name, phone, email..."
            value={search} onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="icon-btn" onClick={() => setSearch("")}>
          <Filter size={15} /> Clear
        </button>
      </div>

      {/* ----- TABLE ----- */}
      <div className="table-card">
        <div className="table-head">
          <div>
            <h3 className="table-title">Customer List</h3>
            <div className="table-note">
              Showing {filteredCustomers.length} of {customers.length} customers
            </div>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table align-middle mb-0" style={{ fontSize: "0.88rem" }}>
            <thead>
              <tr style={{ fontSize: "0.8rem" }}>
                <th>#</th><th>Name</th><th>Phone</th><th>Email</th><th>Joined</th><th width="180">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    <RefreshCw size={20} className="me-2" style={{ animation: "spin 1s linear infinite" }} />
                    Loading customers...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    <LayoutGrid size={32} className="mb-2 text-secondary" />
                    <div className="fw-bold">No Customers Found</div>
                    <small className="text-muted">Try a different search or add a new customer.</small>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer, index) => (
                  <tr key={customer.id}>
                    <td><strong>#{index + 1}</strong></td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
                          <User size={16} />
                        </div>
                        <div className="fw-semibold">{customer.name}</div>
                      </div>
                    </td>
                    <td><div className="d-flex align-items-center gap-1"><Phone size={14} className="text-muted" />{customer.phone}</div></td>
                    <td><div className="d-flex align-items-center gap-1"><Mail size={14} className="text-muted" />{customer.email}</div></td>
                    <td><div className="d-flex align-items-center gap-1"><Calendar size={14} className="text-muted" />{customer.created_at ? new Date(customer.created_at).toLocaleDateString() : "—"}</div></td>
                    <td>
                      <div className="d-flex gap-2">
                        <button className="btn btn-light btn-sm" onClick={() => setViewCustomer(customer)}><Eye size={15} /></button>
                        <button className="btn btn-warning btn-sm" onClick={() => openEdit(customer)}><Pencil size={15} /></button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(customer.id)}><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============ ADD / EDIT MODAL ============ */}
      {modalOpen && (
        <div className="modal-backdrop-custom" onClick={resetForm}>
          <div className="modal-shell" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3 className="modal-title">{editingId ? "Edit Customer" : "New Customer"}</h3>
              <button className="modal-close" onClick={resetForm}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Full Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} className="form-control" placeholder="Enter full name" required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Phone Number</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="form-control" placeholder="03xx xxxxxxx" required />
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold">Email Address</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} className="form-control" placeholder="customer@example.com" required />
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-light px-4" onClick={resetForm}>Cancel</button>
                <button type="submit" className="btn btn-success px-4" disabled={submitLoading}>
                  {submitLoading ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span> Saving...</>
                  ) : (
                    <><Check size={18} className="me-2" />{editingId ? "Update" : "Save"}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============ VIEW CUSTOMER MODAL ============ */}
      {viewCustomer && (
        <div className="modal-backdrop-custom" onClick={() => setViewCustomer(null)}>
          <div className="modal-shell" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3 className="modal-title">Customer #{viewCustomer.id}</h3>
              <button className="modal-close" onClick={() => setViewCustomer(null)}><X size={18} /></button>
            </div>
            <div className="mb-3">
              <label className="fw-semibold">Name</label>
              <p className="text-muted">{viewCustomer.name}</p>
            </div>
            <div className="mb-3">
              <label className="fw-semibold">Phone</label>
              <p className="text-muted">{viewCustomer.phone}</p>
            </div>
            <div className="mb-3">
              <label className="fw-semibold">Email</label>
              <p className="text-muted">{viewCustomer.email}</p>
            </div>
            <div className="mb-3">
              <label className="fw-semibold">Joined</label>
              <p className="text-muted">{viewCustomer.created_at ? new Date(viewCustomer.created_at).toLocaleString() : "—"}</p>
            </div>
            <div className="d-flex justify-content-end gap-2 mt-3">
              <button className="btn btn-warning btn-sm" onClick={() => { setViewCustomer(null); openEdit(viewCustomer); }}>
                <Pencil size={16} className="me-1" /> Edit
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(viewCustomer.id)}>
                <Trash2 size={16} className="me-1" /> Delete
              </button>
              <button className="btn btn-light btn-sm" onClick={() => setViewCustomer(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;