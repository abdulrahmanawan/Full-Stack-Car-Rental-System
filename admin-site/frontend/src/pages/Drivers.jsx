import React, { useEffect, useState } from "react";
import {
  Plus, Search, RefreshCw, Pencil, Trash2, X, Check,
  User, Phone, MessageCircle, Mail, Copy, Filter, LayoutGrid,
} from "lucide-react";

const API = "http://localhost:5000";

const emptyForm = { name: "", phone: "", whatsapp: "", email: "" };

const Drivers = () => {
  const token = localStorage.getItem("adminToken");
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/drivers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDrivers(Array.isArray(data) ? data : []);
    } catch {
      setMessage("Failed to load drivers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDrivers(); }, []);

  const filtered = drivers.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.phone?.includes(search)
  );

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setModalOpen(false);
    setMessage("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const openCreate = () => { resetForm(); setModalOpen(true); };
  const openEdit = (driver) => {
    setEditingId(driver.id);
    setForm({ name: driver.name, phone: driver.phone, whatsapp: driver.whatsapp || "", email: driver.email || "" });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId
        ? `${API}/api/drivers/${editingId}`
        : `${API}/api/drivers`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Operation failed");

      if (!editingId && data.inviteLink) {
        navigator.clipboard.writeText(data.inviteLink);
        alert(`Driver created! Invite link copied to clipboard:\n${data.inviteLink}`);
      }

      setMessage(editingId ? "Driver updated!" : "Driver created!");
      resetForm();
      fetchDrivers();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this driver?")) return;
    try {
      const res = await fetch(`${API}/api/drivers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      setMessage("Driver deleted");
      fetchDrivers();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const copyInviteLink = (inviteToken) => {
    const link = `${window.location.origin}/driver/invite?token=${inviteToken}`;
    navigator.clipboard.writeText(link);
    alert("Invite link copied!");
  };

  return (
    <div className="drivers-page" style={{ fontSize: "0.92rem", padding: "12px" }}>
      <style>{`
        .drivers-page {
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
        .control {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          background: white;
        }
        @media (max-width: 600px) {
          .toolbar-grid {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="page-header">
        <div>
          <h2 className="page-title">Drivers</h2>
          <p className="page-subtitle">Manage drivers and send invite links</p>
        </div>
        <div className="top-actions">
          <button className="icon-btn" onClick={fetchDrivers}><RefreshCw size={16} /> Refresh</button>
          <button className="icon-btn primary" onClick={openCreate}><Plus size={16} /> Add Driver</button>
        </div>
      </div>

      {message && <div className="alert alert-info rounded-3 shadow-sm" style={{ padding: "8px 12px", fontSize: "0.85rem", marginBottom: "12px" }}>{message}</div>}

      <div className="toolbar-grid">
        <div className="input-group" style={{ flex: 1 }}>
          <span className="input-group-text"><Search size={16} /></span>
          <input
            type="text" className="form-control" style={{ fontSize: "0.88rem" }}
            placeholder="Search driver..."
            value={search} onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="icon-btn" onClick={() => setSearch("")}>
          <Filter size={15} /> Clear
        </button>
      </div>

      <div className="table-card">
        <div className="table-head">
          <div>
            <h3 className="table-title">Driver List</h3>
            <div className="table-note">Showing {filtered.length} of {drivers.length} drivers</div>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table align-middle mb-0" style={{ fontSize: "0.88rem" }}>
            <thead>
              <tr style={{ fontSize: "0.8rem" }}>
                <th>#</th><th>Name</th><th>Phone</th><th>WhatsApp</th><th>Email</th><th>Invite</th><th width="180">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    <RefreshCw size={20} className="me-2" style={{ animation: "spin 1s linear infinite" }} />
                    Loading drivers...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    <LayoutGrid size={32} className="mb-2 text-secondary" />
                    <div className="fw-bold">No Drivers Found</div>
                    <small className="text-muted">Try another search or add a new driver.</small>
                  </td>
                </tr>
              ) : (
                filtered.map((driver, index) => (
                  <tr key={driver.id}>
                    <td><strong>#{index + 1}</strong></td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
                          <User size={16} />
                        </div>
                        <div className="fw-semibold">{driver.name}</div>
                      </div>
                    </td>
                    <td><Phone size={14} className="text-muted me-1" />{driver.phone}</td>
                    <td>{driver.whatsapp ? <><MessageCircle size={14} className="text-muted me-1" />{driver.whatsapp}</> : "—"}</td>
                    <td>{driver.email ? <><Mail size={14} className="text-muted me-1" />{driver.email}</> : "—"}</td>
                    <td>
                      {driver.invite_token ? (
                        <button className="btn btn-sm btn-outline-success" onClick={() => copyInviteLink(driver.invite_token)}>
                          <Copy size={14} className="me-1" /> Copy
                        </button>
                      ) : (
                        <span className="text-muted">No link</span>
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-outline-primary" onClick={() => openEdit(driver)}><Pencil size={15} /></button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(driver.id)}><Trash2 size={15} /></button>
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
          <div className="modal-shell" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h3 className="modal-title">{editingId ? "Edit Driver" : "Add Driver"}</h3>
              <button className="modal-close" onClick={resetForm}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Full Name *</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} className="form-control" required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Phone Number *</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="form-control" required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">WhatsApp (optional)</label>
                <input type="tel" name="whatsapp" value={form.whatsapp} onChange={handleChange} className="form-control" />
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold">Email (optional)</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} className="form-control" />
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-light" onClick={resetForm}>Cancel</button>
                <button type="submit" className="btn btn-primary"><Check size={18} className="me-1" /> {editingId ? "Update" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Drivers;