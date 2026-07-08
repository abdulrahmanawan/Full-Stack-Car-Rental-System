import React, { useEffect, useMemo, useState } from "react";
import {
  Plus, Pencil, Trash2, Search, X, ChevronLeft, ChevronRight,
  RefreshCw, CarFront, MapPin, Star, BadgeCheck, Tag, Gauge,
  Fuel, Filter, Upload, Check, LayoutGrid, Eye, Clock3,
  AlertTriangle, CircleDashed,
} from "lucide-react";

const API = "https://full-stack-car-rental-system.vercel.app";

const emptyForm = {
  name: "", brand: "", model: "", year: "", location: "Islamabad",
  type: "Sedan", seats: 5, transmission: "Automatic", fuel_type: "Petrol",
  daily_price: "", weekly_price: "", rating: "4.5", status: "available",
  featured: false, badges: "", description: "", image_url: "",
};

const popularModels = [
  "Toyota Corolla","Toyota Yaris","Toyota Fortuner","Honda Civic","Honda City","Honda Brv",
  "Kia Sportage","Kia Picanto","Suzuki Alto","Suzuki Cultus","Hyundai Tucson",
  "Hyundai Elantra","MG HS","Changan Alsvin","Daihatsu Mira","Nissan Dayz","Toyota Aqua",
];

const steps = [
  { id: 1, title: "Basics" }, { id: 2, title: "Details" }, { id: 3, title: "Pricing" },
];

const typeOptions = ["Sedan","Hatchback","SUV","Van","Luxury","MPV","Other"];
const statusOptions = [
  { value: "available", label: "Available", icon: <Check size={14} /> },
  { value: "booked", label: "Booked", icon: <CircleDashed size={14} /> },
  { value: "maintenance", label: "Maintenance", icon: <AlertTriangle size={14} /> },
];

const fallbackImage = "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1200";

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [viewCar, setViewCar] = useState(null);
  const [step, setStep] = useState(1);
  const token = localStorage.getItem("adminToken");

  const fetchCars = async () => {
    try {
      setPageLoading(true);
      const res = await fetch(`${API}/api/cars`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setCars(Array.isArray(data) ? data : []);
    } catch { setMessage("Cars Cannot Load !"); } finally { setPageLoading(false); }
  };

  useEffect(() => { fetchCars(); }, []);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyMargin = body.style.margin;
    const prevBodyPaddingRight = body.style.paddingRight;
    if (modalOpen || viewCar) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      html.style.overflow = "hidden"; body.style.overflow = "hidden"; body.style.margin = "0";
      if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      html.style.overflow = prevHtmlOverflow; body.style.overflow = prevBodyOverflow;
      body.style.margin = prevBodyMargin; body.style.paddingRight = prevBodyPaddingRight;
    };
  }, [modalOpen, viewCar]);

  const filteredCars = useMemo(() => {
    const q = search.trim().toLowerCase();
    return cars.filter(car => {
      const matchesQuery = !q || car.name?.toLowerCase().includes(q) || car.brand?.toLowerCase().includes(q) || car.model?.toLowerCase().includes(q) || car.location?.toLowerCase().includes(q) || String(car.year).includes(q);
      const matchesStatus = statusFilter === "all" || car.status === statusFilter;
      const matchesType = typeFilter === "all" || car.type === typeFilter;
      return matchesQuery && matchesStatus && matchesType;
    });
  }, [cars, search, statusFilter, typeFilter]);

  const stats = useMemo(() => ({
    total: cars.length,
    available: cars.filter(c => c.status === "available").length,
    booked: cars.filter(c => c.status === "booked").length,
    maintenance: cars.filter(c => c.status === "maintenance").length,
    featured: cars.filter(c => Number(c.featured) === 1).length,
  }), [cars]);

  const resetForm = () => { setForm(emptyForm); setEditingId(null); setImagePreview(""); setMessage(""); setStep(1); };
  const openCreateModal = () => { resetForm(); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setMessage(""); setStep(1); setImagePreview(""); };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "image_url") setImagePreview(value);
  };

  const handleEdit = (car) => {
    setEditingId(car.id);
    setForm({
      name: car.name || "", brand: car.brand || "", model: car.model || "", year: car.year || "",
      location: car.location || "Islamabad", type: car.type || "Sedan", seats: car.seats || 5,
      transmission: car.transmission || "Automatic", fuel_type: car.fuel_type || "Petrol",
      daily_price: car.daily_price || "", weekly_price: car.weekly_price || "",
      rating: car.rating || "4.5", status: car.status || "available",
      featured: Number(car.featured) === 1,
      badges: Array.isArray(car.badges) ? car.badges.join(", ") : car.badges || "",
      description: car.description || "",
      image_url: car.image_url || "",
    });
    setImagePreview(car.image_url || "");
    setViewCar(null);
    setModalOpen(true);
    setStep(1);
    setMessage("");
  };

  const handleView = (car) => setViewCar(car);

  const handleDelete = async (id) => {
    if (!window.confirm("Kya aap is car ko delete karna chahte ho?")) return;
    try {
      const res = await fetch(`${API}/api/cars/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) { setMessage(data.message || "Delete failed"); return; }
      setMessage(data.message || "Car deleted");
      fetchCars();
      if (editingId === id) resetForm();
      setModalOpen(false);
      setViewCar(null);
    } catch { setMessage("Server error"); }
  };

  const validateStep = (currentStep) => {
    if (currentStep === 1) { if (!form.name || !form.brand || !form.model || !form.year || !form.type) { setMessage("Basics complete karo."); return false; } }
    if (currentStep === 2) { if (!form.location || !form.seats || !form.transmission || !form.fuel_type || !form.status) { setMessage("Details complete karo."); return false; } }
    if (currentStep === 3) { if (!form.daily_price) { setMessage("Daily price required hai."); return false; } }
    setMessage(""); return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < 3) { if (!validateStep(step)) return; setStep(prev => prev + 1); return; }
    if (!validateStep(3)) return;
    setLoading(true); setMessage("");
    try {
      const body = { ...form };
      const url = editingId ? `${API}/api/cars/${editingId}` : `${API}/api/cars`;
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { setMessage(data.message || "Something went wrong"); return; }
      setMessage(data.message || "Saved");
      await fetchCars();
      closeModal();
      resetForm();
    } catch { setMessage("Server connection failed"); } finally { setLoading(false); }
  };

  const badgeList = form.badges.split(",").map(item => item.trim()).filter(Boolean);
  const selectedStepTitle = steps.find(item => item.id === step)?.title || "Basics";
  const statusChip = (status) => { if (status === "available") return "status-chip available"; if (status === "booked") return "status-chip booked"; return "status-chip maintenance"; };
  const modelSuggestions = popularModels.filter(item => { const q = form.model.trim().toLowerCase(); if (!q) return true; return item.toLowerCase().includes(q); });
  const viewBadges = Array.isArray(viewCar?.badges) ? viewCar.badges : typeof viewCar?.badges === "string" ? viewCar.badges.split(",").map(b => b.trim()).filter(Boolean) : [];

  return (
    <div className="cars-page" style={{ fontSize: "0.85rem", padding: "12px" }}>
      <style>{`
        .cars-page { min-height: 100%; color: #0f172a; }
        .page-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 12px; flex-wrap: wrap; }
        .page-title { margin: 0; font-size: 1.25rem; font-weight: 800; letter-spacing: -0.03em; color: #0f172a; }
        .page-subtitle { margin: 2px 0 0; color: #64748b; font-size: 0.8rem; }
        .top-actions { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
        .icon-btn { height: 36px; border-radius: 10px; border: 1px solid rgba(15,23,42,0.08); background: rgba(255,255,255,0.94); color: #0f172a; display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 0 12px; transition: all 0.18s ease; box-shadow: 0 8px 20px rgba(15,23,42,0.04); backdrop-filter: blur(10px); font-size: 0.82rem; }
        .icon-btn:hover { transform: translateY(-1px); border-color: rgba(13,110,253,0.18); background: #fff; }
        .icon-btn.primary { background: linear-gradient(135deg, #0d6efd, #2563eb 45%, #3b82f6); color: #fff; border-color: transparent; }
        .quick-stats { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 8px; margin-bottom: 12px; }
        .stat-card { background: rgba(255,255,255,0.94); border: 1px solid rgba(15,23,42,0.08); border-radius: 14px; padding: 12px 14px; box-shadow: 0 8px 20px rgba(15,23,42,0.04); backdrop-filter: blur(10px); }
        .stat-label { color: #64748b; font-size: 0.72rem; margin-bottom: 4px; }
        .stat-value { font-size: 1.15rem; font-weight: 800; letter-spacing: -0.02em; color: #0f172a; line-height: 1; }
        .stat-note { color: #94a3b8; font-size: 0.7rem; margin-top: 4px; }
        .toolbar { background: rgba(255,255,255,0.94); border: 1px solid rgba(15,23,42,0.08); border-radius: 14px; padding: 10px; box-shadow: 0 8px 20px rgba(15,23,42,0.04); margin-bottom: 12px; backdrop-filter: blur(10px); }
        .toolbar-grid { display: grid; grid-template-columns: 1.5fr repeat(3, minmax(0, 1fr)); gap: 8px; }
        .control { height: 38px; border-radius: 10px !important; border-color: rgba(15,23,42,0.1) !important; background: #fff !important; color: #0f172a !important; box-shadow: none !important; font-size: 0.85rem; }
        .control::placeholder { color: #94a3b8; }
        .control:focus { border-color: rgba(13,110,253,0.35) !important; box-shadow: 0 0 0 0.15rem rgba(13,110,253,0.08) !important; }
        .input-group-text { background: #fff !important; color: #475569 !important; border-color: rgba(15,23,42,0.1) !important; }
        .table-card { background: rgba(255,255,255,0.95); border: 1px solid rgba(15,23,42,0.08); border-radius: 18px; box-shadow: 0 8px 20px rgba(15,23,42,0.04); overflow: hidden; }
        .table-head { padding: 12px 16px; border-bottom: 1px solid rgba(15,23,42,0.08); display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap; }
        .table-title { margin: 0; font-size: 0.95rem; font-weight: 800; color: #0f172a; }
        .table-note { color: #64748b; font-size: 0.8rem; }
        .cars-table-wrap { overflow-x: auto; }
        .cars-table { width: 100%; min-width: 820px; border-collapse: collapse; table-layout: fixed; }
        .cars-table thead th { text-align: left; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; padding: 10px 14px; background: #f8fafc; border-bottom: 1px solid rgba(15,23,42,0.08); }
        .cars-table tbody td { padding: 10px 14px; border-bottom: 1px solid rgba(15,23,42,0.06); vertical-align: middle; color: #0f172a; font-size: 0.82rem; }
        .cars-row:hover { background: #fbfdff; }
        .car-main { display: flex; gap: 10px; align-items: center; min-width: 0; }
        .car-thumb { width: 56px; height: 40px; border-radius: 10px; object-fit: cover; background: #f1f5f9; border: 1px solid rgba(15,23,42,0.08); flex: 0 0 auto; }
        .car-name { font-weight: 700; margin: 0; font-size: 0.88rem; color: #0f172a; }
        .car-meta { margin: 2px 0 0; color: #64748b; font-size: 0.78rem; }
        .mini-badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: 999px; background: rgba(13,110,253,0.08); color: #0d6efd; font-weight: 700; font-size: 0.72rem; margin-right: 4px; margin-bottom: 4px; white-space: nowrap; border: 1px solid rgba(13,110,253,0.12); }
        .status-chip { display: inline-flex; align-items: center; gap: 5px; padding: 5px 8px; border-radius: 999px; font-size: 0.75rem; font-weight: 700; text-transform: capitalize; border: 1px solid transparent; }
        .status-chip.available { background: rgba(34,197,94,0.12); color: #15803d; border-color: rgba(34,197,94,0.18); }
        .status-chip.booked { background: rgba(59,130,246,0.12); color: #1d4ed8; border-color: rgba(59,130,246,0.18); }
        .status-chip.maintenance { background: rgba(245,158,11,0.14); color: #b45309; border-color: rgba(245,158,11,0.2); }
        .action-group { display: flex; gap: 6px; flex-wrap: wrap; }
        .action-btn { border-radius: 10px; height: 32px; padding: 0 10px; display: inline-flex; align-items: center; gap: 5px; border: 1px solid rgba(15,23,42,0.1); background: #fff; color: #0f172a; transition: all 0.18s ease; font-weight: 600; font-size: 0.78rem; box-shadow: 0 6px 14px rgba(15,23,42,0.02); }
        .action-btn:hover { transform: translateY(-1px); border-color: rgba(13,110,253,0.18); background: #f8fafc; }
        .action-btn.danger:hover { border-color: rgba(248,113,113,0.28); }
        .empty-state { padding: 20px 14px; text-align: center; color: #64748b; }
        .modal-backdrop-custom { position: fixed; inset: 0; background: rgba(15,23,42,0.45); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; padding: 12px; z-index: 2000; overflow: hidden; }
        .modal-shell { width: min(960px, 100%); height: min(92vh, 850px); max-height: 92vh; background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%); border-radius: 20px; overflow: hidden; box-shadow: 0 24px 80px rgba(0,0,0,0.2); display: flex; flex-direction: column; border: 1px solid rgba(15,23,42,0.08); min-height: 0; }
        .modal-head { padding: 12px 16px; border-bottom: 1px solid rgba(15,23,42,0.08); display: flex; align-items: center; justify-content: space-between; gap: 10px; flex: 0 0 auto; background: #fff; }
        .modal-title { margin: 0; font-size: 0.98rem; font-weight: 800; color: #0f172a; }
        .modal-subtitle { margin: 2px 0 0; color: #64748b; font-size: 0.82rem; }
        .modal-close { width: 36px; height: 36px; border-radius: 10px; border: 1px solid rgba(15,23,42,0.1); background: #fff; display: inline-flex; align-items: center; justify-content: center; color: #0f172a; transition: all 0.18s ease; flex: 0 0 auto; }
        .modal-close:hover { background: #f8fafc; }
        .stepper { padding: 10px 16px 0; display: flex; gap: 8px; flex-wrap: wrap; flex: 0 0 auto; background: #fff; }
        .step-chip { display: inline-flex; align-items: center; gap: 6px; padding: 7px 10px; border-radius: 999px; border: 1px solid rgba(15,23,42,0.1); color: #64748b; background: #fff; font-size: 0.8rem; font-weight: 600; }
        .step-chip.active { color: #0d6efd; border-color: rgba(13,110,253,0.22); background: rgba(13,110,253,0.08); }
        .modal-body { padding: 14px; overflow-y: auto; overflow-x: hidden; flex: 1 1 auto; min-height: 0; scrollbar-gutter: stable; }
        .modal-body::-webkit-scrollbar, .cars-table-wrap::-webkit-scrollbar, .suggest-scroll::-webkit-scrollbar, .model-list::-webkit-scrollbar { width: 6px; height: 6px; }
        .modal-body::-webkit-scrollbar-thumb, .cars-table-wrap::-webkit-scrollbar-thumb, .suggest-scroll::-webkit-scrollbar-thumb, .model-list::-webkit-scrollbar-thumb { background: rgba(15,23,42,0.18); border-radius: 999px; }
        .modal-body::-webkit-scrollbar-track, .cars-table-wrap::-webkit-scrollbar-track, .suggest-scroll::-webkit-scrollbar-track, .model-list::-webkit-scrollbar-track { background: transparent; }
        .modal-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; align-items: start; }
        .section-block { border: 1px solid rgba(15,23,42,0.08); border-radius: 14px; padding: 12px; background: #fff; align-self: start; }
        .section-label { display: block; margin-bottom: 6px; font-size: 0.8rem; font-weight: 700; color: #0f172a; }
        .helper-row { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 8px; }
        .suggestion-chip { border: 1px solid rgba(15,23,42,0.1); background: #fff; color: #0f172a; border-radius: 999px; height: 30px; padding: 0 10px; font-size: 0.76rem; display: inline-flex; align-items: center; transition: all 0.16s ease; cursor: pointer; }
        .suggestion-chip:hover { border-color: rgba(13,110,253,0.22); background: rgba(13,110,253,0.05); transform: translateY(-1px); }
        .suggestion-chip.active { border-color: rgba(13,110,253,0.22); background: rgba(13,110,253,0.08); color: #0d6efd; }
        .model-selected { display: inline-flex; align-items: center; gap: 5px; padding: 6px 10px; border-radius: 999px; border: 1px solid rgba(13,110,253,0.14); background: rgba(13,110,253,0.06); color: #475569; font-size: 0.78rem; }
        .model-selected strong { color: #0f172a; }
        .suggest-scroll { max-height: 180px; overflow-y: auto; overflow-x: hidden; border: 1px solid rgba(15,23,42,0.08); border-radius: 14px; padding: 8px; background: #f8fafc; }
        .model-list { display: grid; grid-template-columns: 1fr; gap: 6px; max-height: 140px; overflow-y: auto; overflow-x: hidden; padding-right: 4px; }
        .preview-box { border: 1px dashed rgba(15,23,42,0.18); border-radius: 14px; background: #f8fafc; padding: 10px; }
        .preview-thumb { width: 100%; height: 140px; object-fit: cover; border-radius: 12px; background: #edf2f7; }
        .modal-footer { padding: 10px 16px 14px; border-top: 1px solid rgba(15,23,42,0.08); display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap; background: #fff; flex: 0 0 auto; }
        .footer-actions { display: flex; gap: 8px; flex-wrap: wrap; }
        .footer-btn { height: 36px; border-radius: 10px; border: 1px solid rgba(15,23,42,0.1); background: #fff; color: #0f172a; padding: 0 12px; display: inline-flex; align-items: center; gap: 6px; font-weight: 700; font-size: 0.82rem; transition: all 0.18s ease; }
        .footer-btn.primary { background: linear-gradient(135deg, #0d6efd, #2563eb 45%, #3b82f6); color: #fff; border-color: transparent; }
        .footer-btn:hover { transform: translateY(-1px); }
        .message-bar { margin-bottom: 12px; }
        .badge-soft { background: rgba(13,110,253,0.08); color: #0d6efd; border: 1px solid rgba(13,110,253,0.12); }
        .view-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 12px; }
        .view-hero { border-radius: 16px; overflow: hidden; border: 1px solid rgba(15,23,42,0.08); background: #f8fafc; }
        .view-image { width: 100%; height: 220px; object-fit: cover; display: block; }
        .view-body { display: grid; gap: 10px; }
        .info-card { border: 1px solid rgba(15,23,42,0.08); border-radius: 14px; background: #fff; padding: 12px; }
        .info-title { margin: 0 0 6px; font-size: 0.82rem; font-weight: 800; color: #0f172a; }
        .info-value { color: #475569; font-size: 0.85rem; line-height: 1.6; word-break: break-word; }
        .view-meta { display: flex; flex-wrap: wrap; gap: 6px; }
        .view-meta .mini-badge { margin: 0; }

        @media (max-width: 991px) {
          .quick-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .toolbar-grid { grid-template-columns: 1fr 1fr; }
          .page-header { flex-direction: column; align-items: flex-start; }
          .modal-grid, .view-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 575px) {
          .cars-page { padding: 8px; }
          .quick-stats { grid-template-columns: 1fr; }
          .toolbar-grid { grid-template-columns: 1fr; }
          .top-actions { width: 100%; }
          .icon-btn { width: 100%; justify-content: center; }
          .modal-shell { max-height: calc(100vh - 16px); border-radius: 16px; }
          .modal-head, .modal-body, .modal-footer { padding-left: 12px; padding-right: 12px; }
          .view-image { height: 180px; }
        }
      `}</style>

      <div className="page-header">
        <div>
          <h1 className="page-title">Cars</h1>
          <p className="page-subtitle">Manage your fleet</p>
        </div>
        <div className="top-actions">
          <button className="icon-btn" type="button" onClick={fetchCars}><RefreshCw size={14} /> Refresh</button>
          <button className="icon-btn primary" type="button" onClick={openCreateModal}><Plus size={14} /> Add Car</button>
        </div>
      </div>

      {message && <div className="alert alert-info rounded-3 shadow-sm message-bar" style={{ padding: "8px 12px", fontSize: "0.82rem" }}>{message}</div>}

      <div className="quick-stats">
        <div className="stat-card"><div className="stat-label">Total</div><div className="stat-value">{stats.total}</div><div className="stat-note">All cars</div></div>
        <div className="stat-card"><div className="stat-label">Available</div><div className="stat-value">{stats.available}</div><div className="stat-note">Ready</div></div>
        <div className="stat-card"><div className="stat-label">Booked</div><div className="stat-value">{stats.booked}</div><div className="stat-note">Reserved</div></div>
        <div className="stat-card"><div className="stat-label">Maintenance</div><div className="stat-value">{stats.maintenance}</div><div className="stat-note">Unavailable</div></div>
        <div className="stat-card"><div className="stat-label">Featured</div><div className="stat-value">{stats.featured}</div><div className="stat-note">Homepage</div></div>
      </div>

      <div className="toolbar">
        <div className="toolbar-grid">
          <div className="input-group">
            <span className="input-group-text bg-transparent control"><Search size={14} /></span>
            <input type="text" className="form-control control" placeholder="Search name, brand, model..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="form-select control" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="booked">Booked</option>
            <option value="maintenance">Maintenance</option>
          </select>
          <select className="form-select control" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="all">All Types</option>
            {typeOptions.map(item => <option key={item} value={item}>{item}</option>)}
          </select>
          <button className="icon-btn" type="button" onClick={() => { setSearch(""); setStatusFilter("all"); setTypeFilter("all"); }}><Filter size={14} /> Clear</button>
        </div>
      </div>

      <div className="table-card">
        <div className="table-head">
          <div>
            <h2 className="table-title">Car List</h2>
            <div className="table-note">{filteredCars.length} of {cars.length}</div>
          </div>
        </div>
        {pageLoading ? (
          <div className="empty-state">Loading...</div>
        ) : filteredCars.length === 0 ? (
          <div className="empty-state"><LayoutGrid size={22} className="mb-2" /><div className="fw-semibold">No cars found</div></div>
        ) : (
          <div className="cars-table-wrap">
            <table className="cars-table">
              <thead><tr><th>Car</th><th>Status</th><th style={{ width: "180px" }}>Actions</th></tr></thead>
              <tbody>
                {filteredCars.map(car => (
                  <tr key={car.id} className="cars-row">
                    <td>
                      <div className="car-main">
                        <img src={car.image_url ? car.image_url : fallbackImage} alt={car.name} className="car-thumb" onError={e => { e.currentTarget.src = fallbackImage; }} />
                        <div style={{ minWidth: 0 }}><p className="car-name">{car.name}</p><p className="car-meta">{car.brand} • {car.model}</p></div>
                      </div>
                    </td>
                    <td><span className={statusChip(car.status)}>{car.status === "available" && <Check size={12} />}{car.status === "booked" && <CircleDashed size={12} />}{car.status === "maintenance" && <AlertTriangle size={12} />}{car.status}</span></td>
                    <td>
                      <div className="action-group">
                        <button className="action-btn" type="button" onClick={() => handleView(car)}><Eye size={13} /> View</button>
                        <button className="action-btn" type="button" onClick={() => handleEdit(car)}><Pencil size={13} /> Edit</button>
                        <button className="action-btn danger" type="button" onClick={() => handleDelete(car.id)}><Trash2 size={13} /> Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="modal-backdrop-custom" onClick={closeModal}>
          <div className="modal-shell" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <div><h3 className="modal-title">{editingId ? "Edit Car" : "Add Car"}</h3><p className="modal-subtitle">Step {step} of 3 — {selectedStepTitle}</p></div>
              <button className="modal-close" type="button" onClick={closeModal}><X size={16} /></button>
            </div>
            <div className="stepper">{steps.map(item => <div key={item.id} className={`step-chip ${step === item.id ? "active" : ""}`}><span>{item.id}</span><span>{item.title}</span></div>)}</div>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
              <div className="modal-body" style={{ minHeight: 0 }}>
                {step === 1 && <div className="modal-grid">
                  <div className="section-block"><label className="section-label">Car Name</label><input type="text" className="form-control control" name="name" value={form.name} onChange={handleChange} placeholder="Toyota Corolla Gli" required /></div>
                  <div className="section-block"><label className="section-label">Brand</label><input type="text" className="form-control control" name="brand" value={form.brand} onChange={handleChange} placeholder="Toyota" required /></div>
                  <div className="section-block">
                    <label className="section-label">Model</label>
                    <input type="text" className="form-control control" name="model" value={form.model} onChange={handleChange} placeholder="Start typing model..." required />
                    {form.model && <div className="model-selected mt-2">Selected: <strong>{form.model}</strong></div>}
                    <div className="suggest-scroll mt-2"><div className="d-flex align-items-center justify-content-between mb-2"><div className="small text-muted">Popular</div><div className="small text-muted">{modelSuggestions.length}</div></div>
                      <div className="model-list">{modelSuggestions.map(item => <button key={item} type="button" className={`suggestion-chip ${form.model === item ? "active" : ""}`} onClick={() => setForm(prev => ({ ...prev, model: item }))}>{item}</button>)}</div>
                    </div>
                  </div>
                  <div className="section-block"><label className="section-label">Year</label><input type="number" className="form-control control" name="year" value={form.year} onChange={handleChange} placeholder="2024" min="1990" max="2035" required /></div>
                  <div className="section-block" style={{ gridColumn: "1 / -1" }}><label className="section-label">Type</label><div className="d-flex flex-wrap gap-2">{typeOptions.map(item => <button key={item} type="button" className={`suggestion-chip ${form.type === item ? "active" : ""}`} onClick={() => setForm(prev => ({ ...prev, type: item }))}>{item}</button>)}</div></div>
                </div>}
                {step === 2 && <div className="modal-grid">
                  <div className="section-block"><label className="section-label">Location</label><input type="text" className="form-control control" name="location" value={form.location} onChange={handleChange} required /></div>
                  <div className="section-block"><label className="section-label">Seats</label><input type="number" className="form-control control" name="seats" value={form.seats} onChange={handleChange} min="1" required /></div>
                  <div className="section-block"><label className="section-label">Transmission</label><select className="form-select control" name="transmission" value={form.transmission} onChange={handleChange}><option value="Automatic">Automatic</option><option value="Manual">Manual</option></select></div>
                  <div className="section-block"><label className="section-label">Fuel Type</label><select className="form-select control" name="fuel_type" value={form.fuel_type} onChange={handleChange}><option value="Petrol">Petrol</option><option value="Diesel">Diesel</option><option value="Hybrid">Hybrid</option><option value="Electric">Electric</option></select></div>
                  <div className="section-block"><label className="section-label">Status</label><select className="form-select control" name="status" value={form.status} onChange={handleChange}>{statusOptions.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div>
                  <div className="section-block"><label className="section-label">Rating</label><input type="number" className="form-control control" name="rating" value={form.rating} onChange={handleChange} step="0.1" min="0" max="5" /></div>
                  <div className="section-block" style={{ gridColumn: "1 / -1" }}><div className="form-check"><input className="form-check-input" type="checkbox" name="featured" checked={form.featured} onChange={handleChange} id="featuredCar" /><label className="form-check-label fw-semibold" htmlFor="featuredCar">Featured car</label></div></div>
                </div>}
                {step === 3 && <div className="modal-grid">
                  <div className="section-block"><label className="section-label">Daily Price</label><input type="number" className="form-control control" name="daily_price" value={form.daily_price} onChange={handleChange} required /></div>
                  <div className="section-block"><label className="section-label">Weekly Price</label><input type="number" className="form-control control" name="weekly_price" value={form.weekly_price} onChange={handleChange} /></div>
                  <div className="section-block" style={{ gridColumn: "1 / -1" }}><label className="section-label">Badges / Highlights</label><input type="text" className="form-control control" name="badges" value={form.badges} onChange={handleChange} /><div className="helper-row">{badgeList.length > 0 ? badgeList.map((item, idx) => <span key={idx} className="mini-badge"><BadgeCheck size={11} />{item}</span>) : <span className="text-muted small">No badges</span>}</div></div>
                  <div className="section-block" style={{ gridColumn: "1 / -1" }}><label className="section-label">Description</label><textarea className="form-control control" rows="3" name="description" value={form.description} onChange={handleChange} /></div>
                  <div className="section-block" style={{ gridColumn: "1 / -1" }}>
                    <label className="section-label">Image URL</label>
                    <input
                      type="url"
                      className="form-control control"
                      name="image_url"
                      value={form.image_url}
                      onChange={handleChange}
                      placeholder="https://i.imgur.com/abc.jpg"
                    />
                    <div className="preview-box mt-2">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="preview-thumb" onError={() => setImagePreview(fallbackImage)} />
                      ) : (
                        <div className="d-flex flex-column align-items-center justify-content-center text-muted" style={{ height: "140px" }}>
                          <Upload size={24} className="mb-2" />
                          <span className="small">No image</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>}
              </div>
              <div className="modal-footer">
                <div className="text-muted small">{editingId ? "Update car" : "New car"}</div>
                <div className="footer-actions">
                  <button type="button" className="footer-btn" onClick={closeModal}>Cancel</button>
                  {step > 1 && <button type="button" className="footer-btn" onClick={() => setStep(prev => prev - 1)}><ChevronLeft size={14} /> Back</button>}
                  <button type="submit" className="footer-btn primary" disabled={loading}>
                    {step < 3 ? <><span>Next</span><ChevronRight size={14} /></> : loading ? "Saving..." : <><Check size={14} />{editingId ? "Update" : "Save"}</>}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewCar && (
        <div className="modal-backdrop-custom" onClick={() => setViewCar(null)}>
          <div className="modal-shell" onClick={e => e.stopPropagation()}>
            <div className="modal-head"><div><h3 className="modal-title">Car Details</h3><p className="modal-subtitle">Full record</p></div><button className="modal-close" type="button" onClick={() => setViewCar(null)}><X size={16} /></button></div>
            <div className="modal-body">
              <div className="view-grid">
                <div className="view-hero"><img className="view-image" src={viewCar.image_url ? viewCar.image_url : fallbackImage} alt={viewCar.name} onError={e => { e.currentTarget.src = fallbackImage; }} /></div>
                <div className="view-body">
                  <div className="info-card"><div className="info-title">{viewCar.name}</div><div className="view-meta"><span className="mini-badge"><MapPin size={11} />{viewCar.location}</span><span className="mini-badge"><CarFront size={11} />{viewCar.type}</span><span className="mini-badge"><Gauge size={11} />{viewCar.seats} Seats</span><span className="mini-badge"><Fuel size={11} />{viewCar.fuel_type}</span></div></div>
                  <div className="info-card"><div className="info-title">Brand & Model</div><div className="info-value">{viewCar.brand} • {viewCar.model} • {viewCar.year}</div></div>
                  <div className="info-card"><div className="info-title">Status & Pricing</div><div className="info-value"><div className="mb-2"><span className={statusChip(viewCar.status)}>{viewCar.status === "available" && <Check size={12} />}{viewCar.status === "booked" && <CircleDashed size={12} />}{viewCar.status === "maintenance" && <AlertTriangle size={12} />}{viewCar.status}</span>{Number(viewCar.featured) === 1 && <span className="badge rounded-pill badge-soft ms-2">Featured</span>}</div><div>Daily: Rs {viewCar.daily_price}</div><div>Weekly: Rs {viewCar.weekly_price || "-"}</div><div>Rating: {viewCar.rating}</div><div>Transmission: {viewCar.transmission}</div></div></div>
                  <div className="info-card"><div className="info-title">Highlights</div><div className="view-meta">{viewBadges.length > 0 ? viewBadges.map((b, idx) => <span key={idx} className="mini-badge"><BadgeCheck size={11} />{b}</span>) : <span className="text-muted small">None</span>}</div></div>
                  <div className="info-card"><div className="info-title">Description</div><div className="info-value">{viewCar.description || "No description."}</div></div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <div className="text-muted small">Quick actions</div>
              <div className="footer-actions">
                <button type="button" className="footer-btn" onClick={() => { setViewCar(null); handleEdit(viewCar); }}><Pencil size={14} /> Edit</button>
                <button type="button" className="footer-btn primary" onClick={() => setViewCar(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cars;