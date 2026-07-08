import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Mail, Lock, User, Phone, Loader2, LogIn, CheckCircle2, X, AlertCircle } from "lucide-react";

const API = "https://full-stack-car-rental-system.vercel.app";

const Login = () => {
  const [searchParams] = useSearchParams();
  const initialRegister = searchParams.get("register") === "1";
  
  const [isRegister, setIsRegister] = useState(initialRegister);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const showToast = (type, message) => {
    if (type === "error") {
      setError(message);
      setTimeout(() => setError(""), 5000);
    } else {
      setSuccess(message);
      setTimeout(() => setSuccess(""), 5000);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const url = isRegister
        ? `${API}/api/customers/register`
        : `${API}/api/customers/login`;

      const body = isRegister
        ? {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            password: formData.password,
          }
        : {
            email: formData.email,
            password: formData.password,   // empty password allowed for password‑less accounts
          };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      if (!isRegister) {
        // Login success
        localStorage.setItem("customerToken", data.token);
        localStorage.setItem("customer", JSON.stringify(data.customer));
        showToast("success", "Logged in successfully!");
        setTimeout(() => navigate("/profile"), 1500);
      } else {
        // Register success
        showToast("success", "Registration successful! You can now login.");
        setIsRegister(false);
        setFormData({ name: "", phone: "", email: "", password: "" });
      }
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrap}>
      {/* Toast Notifications */}
      {error && (
        <div style={styles.toastError}>
          <div style={styles.toastContent}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
          <button onClick={() => setError("")} style={styles.toastClose}><X size={18} /></button>
        </div>
      )}
      {success && (
        <div style={styles.toastSuccess}>
          <div style={styles.toastContent}>
            <CheckCircle2 size={18} />
            <span>{success}</span>
          </div>
          <button onClick={() => setSuccess("")} style={styles.toastClose}><X size={18} /></button>
        </div>
      )}

      <style>{`
        .auth-title {
          font-size: clamp(1.8rem, 3.8vw, 3rem);
          line-height: 1.1;
          letter-spacing: -0.03em;
        }

        .auth-subtitle {
          color: rgba(255,255,255,0.78);
          max-width: 560px;
          font-size: 1rem;
          line-height: 1.75;
        }

        .auth-card {
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.08);
          box-shadow: 0 14px 34px rgba(15, 23, 42, 0.08);
        }

        .form-control {
          min-height: 50px;
          border-radius: 14px !important;
          border: 1px solid #dbe3ef !important;
          box-shadow: none !important;
        }

        .form-control:focus {
          border-color: #0d6efd !important;
          box-shadow: 0 0 0 0.2rem rgba(13,110,253,0.12) !important;
        }

        .auth-btn {
          min-height: 52px;
          border-radius: 14px !important;
          border: none !important;
          background: linear-gradient(135deg, #0d6efd, #2563eb) !important;
          box-shadow: 0 12px 24px rgba(13, 110, 253, 0.18);
          font-weight: 800;
          color: #fff !important;
        }

        .auth-btn:hover {
          color: #fff !important;
        }

        .hero-panel {
          background:
            linear-gradient(135deg, rgba(11,18,32,0.96) 0%, rgba(16,41,77,0.96) 100%),
            url("https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1600");
          background-size: cover;
          background-position: center;
          color: #fff;
          overflow: hidden;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          padding: 8px 14px;
          border-radius: 999px;
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          font-size: 0.88rem;
          font-weight: 700;
        }

        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          color: rgba(255,255,255,0.9);
          margin-bottom: 12px;
        }

        .feature-dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: #7dd3fc;
          margin-top: 8px;
          flex-shrink: 0;
          box-shadow: 0 0 0 6px rgba(125, 211, 252, 0.15);
        }

        .brand-box {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 22px;
        }

        .small-link {
          color: #0d6efd;
          text-decoration: none;
          font-weight: 700;
        }

        .small-link:hover {
          text-decoration: underline;
        }

        @keyframes slideInRight {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @media (max-width: 991.98px) {
          .hero-panel {
            min-height: 280px;
          }
        }
      `}</style>

      <section className="container py-4 py-lg-5">
        <div className="row g-0 align-items-stretch auth-card rounded-4 overflow-hidden">
          <div className="col-lg-6 p-4 p-md-5 bg-white">
            <div className="mb-4">
              <div className="d-inline-flex align-items-center px-3 py-2 rounded-pill mb-3" style={styles.softBadge}>
                {isRegister ? "Create Account" : "Welcome Back"}
              </div>
              <h1 className="auth-title fw-bold text-dark mb-2">
                {isRegister ? "Register" : "Login"}
              </h1>
              <p className="text-muted mb-0" style={{ lineHeight: 1.7 }}>
                {isRegister
                  ? "Join us to book cars and manage your rides."
                  : "Sign in to continue your booking and manage your rides easily."}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                {isRegister && (
                  <>
                    <div className="col-12">
                      <label className="form-label fw-semibold text-dark">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold text-dark">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="03xx xxxxxxx"
                        required
                      />
                    </div>
                  </>
                )}

                <div className="col-12">
                  <label className="form-label fw-semibold text-dark">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold text-dark">
                    Password
                    {!isRegister && <span className="text-muted ms-1" style={{fontWeight:"normal", fontSize:"0.85rem"}}>(leave blank if you haven't set one)</span>}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter password"
                    minLength={isRegister ? "6" : "0"}
                  />
                  {!isRegister && (
                    <div className="form-text mt-1">
                      If you booked without an account, just enter your email and leave password empty.
                    </div>
                  )}
                </div>

                {!isRegister && (
                  <div className="col-12 d-flex justify-content-end">
                    <a href="#" className="small-link">
                      Forgot password?
                    </a>
                  </div>
                )}

                <div className="col-12 d-grid mt-2">
                  <button type="submit" className="btn auth-btn" disabled={loading}>
                    {loading ? (
                      <><Loader2 size={18} className="me-2 animate-spin" /> Please wait...</>
                    ) : isRegister ? (
                      "Create Account"
                    ) : (
                      <><LogIn size={18} className="me-2" /> Login</>
                    )}
                  </button>
                </div>
              </div>
            </form>

            <div className="text-center mt-3">
              <span className="text-muted">
                {isRegister ? "Already have an account?" : "Don't have an account?"}
              </span>{" "}
              <button
                className="btn btn-link p-0 fw-semibold"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError("");
                  setSuccess("");
                  setFormData({ name: "", phone: "", email: "", password: "" });
                }}
              >
                {isRegister ? "Sign In" : "Create one"}
              </button>
            </div>
          </div>

          <div className="col-lg-6 hero-panel p-4 p-md-5 d-flex align-items-center">
            <div>
              <div className="hero-badge mb-3">Awan Rent a Car</div>
              <h2 className="auth-title fw-bold mb-3">
                Find Your Perfect Rental Car
              </h2>
              <p className="auth-subtitle mb-4">
                Discover reliable cars, professional drivers, and smooth booking for airport transfers, city rides, and out-of-city travel.
              </p>

              <div className="brand-box p-4 p-md-4">
                <div className="feature-item">
                  <span className="feature-dot"></span>
                  <span>Quick access to your bookings</span>
                </div>
                <div className="feature-item">
                  <span className="feature-dot"></span>
                  <span>Easy support for ride confirmation</span>
                </div>
                <div className="feature-item mb-0">
                  <span className="feature-dot"></span>
                  <span>Safe and trusted travel experience</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const styles = {
  pageWrap: {
    background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
    minHeight: "100vh",
    position: "relative",
  },
  softBadge: {
    background: "rgba(13,110,253,0.08)",
    color: "#0d6efd",
    fontWeight: 700,
    fontSize: "0.88rem",
  },
  toastError: {
    position: "fixed",
    top: "24px",
    right: "24px",
    zIndex: 9999,
    background: "#991b1b",
    color: "#fff",
    padding: "16px 20px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    boxShadow: "0 16px 40px rgba(0,0,0,0.2)",
    animation: "slideInRight 0.45s ease",
    maxWidth: "380px",
  },
  toastSuccess: {
    position: "fixed",
    top: "24px",
    right: "24px",
    zIndex: 9999,
    background: "#065f46",
    color: "#fff",
    padding: "16px 20px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    boxShadow: "0 16px 40px rgba(0,0,0,0.2)",
    animation: "slideInRight 0.45s ease",
    maxWidth: "380px",
  },
  toastContent: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flex: 1,
  },
  toastClose: {
    background: "transparent",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    padding: "4px",
    opacity: 0.8,
  },
};

export default Login;