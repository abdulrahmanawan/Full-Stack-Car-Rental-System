import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Key, Loader2, CheckCircle, Shield } from "lucide-react";
import logoImage from "../assets/logo.png";

const API = "https://full-stack-car-rental-system.vercel.app";

const DriverInvite = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [form, setForm] = useState({ phone: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/drivers/setup-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          phone: form.phone || undefined,
          email: form.email || undefined,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Setup failed");
      setMessage("Password set successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="login-page">
        <div className="soft-orb soft-orb-1" />
        <div className="soft-orb soft-orb-2" />
        <div className="grid-overlay" />
        <div className="d-flex align-items-center justify-content-center vh-100">
          <div className="text-center text-white">
            <Shield size={48} className="mb-3 text-danger" />
            <h2 className="fw-bold">Invalid Invite Link</h2>
            <p className="text-white-50">This link is expired or incorrect.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="soft-orb soft-orb-1" />
      <div className="soft-orb soft-orb-2" />
      <div className="grid-overlay" />

      <div className="container-fluid login-shell">
        <div className="row min-vh-100 g-0 align-items-center">
          <div className="col-lg-7 d-none d-lg-flex hero-side">
            <div className="hero-content">
              <div className="brand-pill">
                <div className="brand-logo">
                  <img src={logoImage} alt="Awan Rent a Car" />
                </div>
                <div>
                  <h1>Awan Rent a Car</h1>
                  <p>Driver Onboarding</p>
                </div>
              </div>

              <h2 className="hero-title">
                Welcome to the
                <span>driver team.</span>
              </h2>

              <p className="hero-text">
                Set up your account to receive trip assignments, view customer details,
                and manage your rides.
              </p>

              <div className="hero-points">
                <div className="hero-point">Trip Assignments</div>
                <div className="hero-point">Customer Info</div>
                <div className="hero-point">Easy Login</div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-5 auth-side">
            <div className="login-card">
              <div className="login-top">
                <div className="mobile-brand d-lg-none">
                  <div className="brand-logo">
                    <img src={logoImage} alt="Awan Rent a Car" />
                  </div>
                  <div>
                    <h1>Awan Rent a Car</h1>
                    <p>Driver Setup</p>
                  </div>
                </div>

                <Key size={36} className="mb-3 text-info" />
                <h2>Set Your Password</h2>
                <p>Create a secure password for your driver account</p>
              </div>

              {message && (
                <div className="alert alert-success border-0 rounded-4 mb-3">
                  <CheckCircle size={16} className="me-2" />
                  {message}
                </div>
              )}
              {error && (
                <div className="alert alert-danger border-0 rounded-4 mb-3">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Phone Number (optional)</label>
                  <input
                    type="tel"
                    className="form-control custom-input"
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="03xx xxxxxxx"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email (optional)</label>
                  <input
                    type="email"
                    className="form-control custom-input"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    placeholder="driver@example.com"
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">New Password *</label>
                  <input
                    type="password"
                    className="form-control custom-input"
                    value={form.password}
                    onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                    placeholder="At least 6 characters"
                    required
                    minLength={6}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-login w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="d-flex align-items-center justify-content-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Setting up...
                    </span>
                  ) : (
                    <>
                      <CheckCircle size={18} className="me-2" />
                      Set Password &amp; Continue
                    </>
                  )}
                </button>
              </form>

              <div className="card-foot">
                <small>You will be redirected to login after setup</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Styles same as login page */}
      <style>{`
        html, body, #root { min-height: 100%; }
        body { margin: 0; overflow-y: auto; overflow-x: hidden; background: #07111f; }

        .login-page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(circle at top left, rgba(13, 110, 253, 0.12), transparent 28%),
            radial-gradient(circle at bottom right, rgba(13, 202, 240, 0.12), transparent 30%),
            linear-gradient(135deg, #07111f 0%, #0a1828 45%, #050b14 100%);
        }

        .login-shell { position: relative; z-index: 1; }

        .grid-overlay {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 42px 42px;
          mask-image: linear-gradient(to bottom, rgba(0,0,0,0.6), transparent 100%);
          pointer-events: none;
        }

        .soft-orb {
          position: absolute; border-radius: 50%; filter: blur(22px); opacity: 0.22; pointer-events: none;
        }
        .soft-orb-1 { width: 160px; height: 160px; background: #0d6efd; top: 8%; left: 5%; }
        .soft-orb-2 { width: 220px; height: 220px; background: #0dcaf0; right: 6%; bottom: 10%; }

        .hero-side, .auth-side { min-height: 100vh; position: relative; z-index: 1; }
        .hero-side { display: flex; align-items: center; padding: 4rem 4rem 4rem 5rem; color: #fff; }
        .hero-content { max-width: 620px; }

        .brand-pill {
          display: inline-flex; align-items: center; gap: 0.9rem; padding: 0.8rem 1rem;
          border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.06);
          backdrop-filter: blur(12px); border-radius: 999px; margin-bottom: 1.5rem;
        }
        .brand-logo {
          width: 38px; height: 38px; border-radius: 50%; display: inline-flex; align-items: center;
          justify-content: center; background: linear-gradient(135deg, #0d6efd, #0dcaf0);
          box-shadow: 0 10px 24px rgba(13, 110, 253, 0.28); flex: 0 0 auto; overflow: hidden;
        }
        .brand-logo img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .brand-pill h1, .mobile-brand h1 { margin: 0; font-size: 1rem; font-weight: 800; color: #fff; line-height: 1.2; }
        .brand-pill p, .mobile-brand p { margin: 0; font-size: 0.82rem; color: rgba(255,255,255,0.68); }

        .hero-title { font-size: clamp(2.35rem, 4vw, 4.45rem); line-height: 1.06; font-weight: 800; margin: 0 0 1rem; text-shadow: 0 10px 30px rgba(0,0,0,0.24); }
        .hero-title span { display: block; color: #7dd3fc; }
        .hero-text { font-size: 1.02rem; line-height: 1.8; max-width: 540px; color: rgba(255,255,255,0.74); margin-bottom: 1.5rem; }

        .hero-points { display: flex; gap: 0.8rem; flex-wrap: wrap; }
        .hero-point { display: inline-flex; align-items: center; padding: 0.7rem 1rem; border-radius: 999px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.11); color: rgba(255,255,255,0.88); font-size: 0.92rem; }

        .auth-side { display: flex; align-items: center; justify-content: center; padding: 1.25rem; }
        .login-card { width: min(100%, 450px); padding: 2rem; border-radius: 24px; border: 1px solid rgba(255,255,255,0.10); background: rgba(8, 15, 26, 0.74); backdrop-filter: blur(18px); box-shadow: 0 24px 60px rgba(0,0,0,0.28); color: #fff; }
        .login-top { text-align: center; margin-bottom: 1.35rem; }
        .mobile-brand { display: inline-flex; align-items: center; gap: 0.8rem; margin-bottom: 1rem; padding: 0.6rem 0.85rem; border-radius: 999px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.10); }
        .login-top h2 { margin: 0; font-size: 1.7rem; font-weight: 800; }
        .login-top p { margin: 0.35rem 0 0; color: rgba(255,255,255,0.66); }

        .form-label { color: rgba(255,255,255,0.78); font-size: 0.92rem; margin-bottom: 0.45rem; }
        .custom-input { background: rgba(255,255,255,0.06) !important; border: 1px solid rgba(255,255,255,0.10) !important; color: #fff !important; border-radius: 14px; padding: 0.92rem 1rem; box-shadow: none !important; }
        .custom-input::placeholder { color: rgba(255,255,255,0.34); }
        .custom-input:focus { border-color: rgba(13, 202, 240, 0.55) !important; box-shadow: 0 0 0 0.18rem rgba(13, 202, 240, 0.10) !important; background: rgba(255,255,255,0.08) !important; }

        .btn-login { height: 50px; border: none; border-radius: 14px; font-weight: 700; color: #fff; background: linear-gradient(135deg, #0d6efd, #0dcaf0); box-shadow: 0 14px 28px rgba(13, 110, 253, 0.22); transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .btn-login:hover { transform: translateY(-1px); box-shadow: 0 18px 36px rgba(13, 110, 253, 0.28); }
        .btn-login:disabled { opacity: 0.85; transform: none; }
        .card-foot { margin-top: 1rem; text-align: center; color: rgba(255,255,255,0.56); }

        @media (max-width: 991px) {
          .hero-side { display: none !important; }
          .auth-side { min-height: 100vh; padding: 1rem; }
          .login-card { padding: 1.35rem; }
        }
        @media (max-width: 575px) {
          .login-card { width: 100%; max-width: 100%; padding: 1.2rem; }
          .custom-input, .btn-login { height: 48px; }
        }
      `}</style>
    </div>
  );
};

export default DriverInvite;