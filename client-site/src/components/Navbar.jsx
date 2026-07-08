import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogIn, UserCircle, Menu, X } from "lucide-react";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("customerToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("customerToken");
    localStorage.removeItem("customer");
    setIsLoggedIn(false);
    navigate("/");
  };

  const navLinkClass = ({ isActive }) =>
    `nav-link-item ${isActive ? "active-link" : ""}`;

  return (
    <nav className="nav-wrap">
      <style>{`
        .nav-wrap {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: rgba(255, 255, 255, 0.86);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(15, 23, 42, 0.08);
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
        }

        .nav-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 16px;
        }

        .brand-link {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: #0f172a;
        }

        .brand-logo {
          width: 46px;
          height: 46px;
          border-radius: 14px;
          object-fit: cover;
          display: block;
          box-shadow: 0 10px 22px rgba(13, 110, 253, 0.16);
          border: 1px solid rgba(15, 23, 42, 0.08);
          background: #fff;
        }

        .brand-text {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }

        .brand-title {
          font-size: 1.02rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: 0.2px;
        }

        .brand-sub {
          font-size: 0.76rem;
          color: #64748b;
          font-weight: 500;
          margin-top: 3px;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .nav-link-item {
          position: relative;
          text-decoration: none;
          color: #334155;
          font-weight: 600;
          font-size: 0.95rem;
          padding: 10px 14px;
          border-radius: 999px;
          transition: all 0.25s ease;
        }

        .nav-link-item:hover {
          color: #0d6efd;
          background: rgba(13, 110, 253, 0.08);
          transform: translateY(-1px);
        }

        .active-link {
          color: #0d6efd;
          background: rgba(13, 110, 253, 0.10);
        }

        .action-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 14px;
          border: none;
          background: linear-gradient(135deg, #0d6efd, #2563eb);
          color: #fff;
          text-decoration: none;
          font-weight: 700;
          box-shadow: 0 12px 24px rgba(13, 110, 253, 0.18);
          transition: all 0.25s ease;
        }

        .action-btn:hover {
          color: #fff;
          transform: translateY(-1px);
          box-shadow: 0 14px 28px rgba(13, 110, 253, 0.24);
        }

        .menu-btn {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          border: 1px solid rgba(15, 23, 42, 0.08);
          background: rgba(255, 255, 255, 0.92);
          display: grid;
          place-items: center;
          transition: all 0.25s ease;
        }

        .menu-btn:hover {
          transform: translateY(-1px);
        }

        .mobile-panel {
          border-top: 1px solid rgba(15, 23, 42, 0.08);
          background: rgba(255, 255, 255, 0.96);
          padding: 12px 0 16px;
        }

        .mobile-link {
          display: block;
          margin: 4px 0;
          padding: 12px 14px;
          border-radius: 12px;
          color: #334155;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .mobile-link:hover {
          background: rgba(13, 110, 253, 0.08);
          color: #0d6efd;
        }

        .mobile-actions {
          display: flex;
          gap: 10px;
          padding: 10px 14px 0;
        }

        .mobile-login,
        .mobile-primary {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 11px 14px;
          border-radius: 14px;
          text-decoration: none;
          font-weight: 700;
          transition: all 0.25s ease;
        }

        .mobile-login {
          border: 1px solid rgba(15, 23, 42, 0.08);
          background: #fff;
          color: #0f172a;
        }

        .mobile-primary {
          border: none;
          background: linear-gradient(135deg, #0d6efd, #2563eb);
          color: #fff;
          box-shadow: 0 12px 24px rgba(13, 110, 253, 0.18);
        }

        @media (max-width: 575.98px) {
          .nav-inner {
            padding: 0 12px;
          }

          .brand-title {
            font-size: 0.98rem;
          }

          .brand-sub {
            font-size: 0.72rem;
          }

          .brand-logo {
            width: 42px;
            height: 42px;
          }
        }
      `}</style>

      <div className="nav-inner">
        <div className="d-flex justify-content-between align-items-center py-3">
          <Link to="/" className="brand-link" onClick={() => setIsMenuOpen(false)}>
            <img src={logo} alt="Awan Rent a Car" className="brand-logo" />
            <div className="brand-text">
              <span className="brand-title">Awan Rent a Car</span>
              <span className="brand-sub">Premium Car Rental</span>
            </div>
          </Link>

          <div className="d-none d-md-flex nav-links">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            <NavLink to="/cars" className={navLinkClass}>Cars</NavLink>
            <NavLink to="/about" className={navLinkClass}>About</NavLink>
            <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
          </div>

          <div className="d-none d-md-flex">
            {isLoggedIn ? (
              <Link to="/profile" className="action-btn">
                <UserCircle size={18} />
                Profile
              </Link>
            ) : (
              <Link to="/login" className="action-btn">
                <LogIn size={18} />
                Login
              </Link>
            )}
          </div>

          <button
            type="button"
            className="d-md-none menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="d-md-none mobile-panel">
            <NavLink to="/" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Home</NavLink>
            <NavLink to="/cars" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Cars</NavLink>
            <NavLink to="/about" className="mobile-link" onClick={() => setIsMenuOpen(false)}>About</NavLink>
            <NavLink to="/contact" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Contact</NavLink>

            <div className="mobile-actions">
              {isLoggedIn ? (
                <Link to="/profile" className="mobile-primary" onClick={() => setIsMenuOpen(false)}>
                  <UserCircle size={16} />
                  Profile
                </Link>
              ) : (
                <>
                  <Link to="/login" className="mobile-login" onClick={() => setIsMenuOpen(false)}>
                    <LogIn size={16} />
                    Login
                  </Link>
                  <Link to="/login?register=1" className="mobile-primary" onClick={() => setIsMenuOpen(false)}>
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;