import React from "react";
import { Link } from "react-router-dom";
import {
  Car,
  Phone,
  Mail,
  MapPin,
  ArrowUpRight,
} from "lucide-react";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div className="container py-5 py-lg-6">
        <div className="row g-4 g-lg-5">
          {/* Company Info */}
          <div className="col-12 col-md-6 col-lg-4">
            <Link to="/" style={styles.brand}>
              <div style={styles.brandIcon}>
                <Car size={22} />
              </div>
              <div>
                <span style={styles.brandName}>Awan Rent a Car</span>
                <div style={styles.brandSub}>Premium Car Rental Service</div>
              </div>
            </Link>

            <p style={styles.text} className="mt-3 mb-4">
              Reliable rent a car service for airport transfers, city travel, and out-of-city trips with clean cars and professional drivers.
            </p>

            <div className="d-flex gap-3">
              <a href="#" style={styles.socialIcon} aria-label="Facebook">
                <FaFacebookF size={18} />
              </a>
              <a href="#" style={styles.socialIcon} aria-label="Twitter">
                <FaTwitter size={18} />
              </a>
              <a href="#" style={styles.socialIcon} aria-label="Instagram">
                <FaInstagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-6 col-md-3 col-lg-2">
            <h5 style={styles.heading}>Quick Links</h5>
            <ul className="list-unstyled m-0" style={styles.linkList}>
              <li><Link to="/" style={styles.link}>Home</Link></li>
              <li><Link to="/cars" style={styles.link}>Cars</Link></li>
              <li><Link to="/about" style={styles.link}>About</Link></li>
              <li><Link to="/contact" style={styles.link}>Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="col-6 col-md-3 col-lg-2">
            <h5 style={styles.heading}>Services</h5>
            <ul className="list-unstyled m-0" style={styles.linkList}>
              <li><span style={styles.linkText}>Airport Transfers</span></li>
              <li><span style={styles.linkText}>City Rides</span></li>
              <li><span style={styles.linkText}>Out of City</span></li>
              <li><span style={styles.linkText}>Family Trips</span></li>
              <li><span style={styles.linkText}>With Driver Only</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-12 col-lg-4">
            <h5 style={styles.heading}>Contact Us</h5>

            <div style={styles.contactItem}>
              <Phone size={17} style={styles.contactIcon} />
              <span>+92 300 0000000</span>
            </div>

            <div style={styles.contactItem}>
              <Mail size={17} style={styles.contactIcon} />
              <span>info@awanrent.com</span>
            </div>

            <div style={styles.contactItem}>
              <MapPin size={17} style={styles.contactIcon} />
              <span>Islamabad, Pakistan</span>
            </div>

            <div className="mt-4">
              <Link to="/cars" style={styles.ctaBtn}>
                Book Now
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        <div style={styles.divider}></div>

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <p style={styles.bottomText} className="mb-0 text-center text-md-start">
            © {currentYear} Awan Rent a Car. All rights reserved.
          </p>

          <div className="text-center pe-5">
          <a
            href="https://www.linkedin.com/in/abdulrahman-awan-5184aa373"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.developerLink}
          >
            Developed by Abdulrahman Awan
          </a>
        </div>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    background:
      "linear-gradient(180deg, #0b1220 0%, #10192b 55%, #0b1220 100%)",
    color: "#d1d5db",
  },
  brand: {
    display: "inline-flex",
    alignItems: "center",
    gap: "12px",
    textDecoration: "none",
    color: "#fff",
    fontWeight: 800,
  },
  brandIcon: {
    width: "46px",
    height: "46px",
    borderRadius: "16px",
    display: "grid",
    placeItems: "center",
    background: "linear-gradient(135deg, #0d6efd, #2563eb)",
    color: "#fff",
    boxShadow: "0 12px 28px rgba(13,110,253,0.22)",
    flexShrink: 0,
  },
  brandName: {
    display: "block",
    fontSize: "1.15rem",
    lineHeight: 1.1,
    color: "#fff",
  },
  brandSub: {
    fontSize: "0.82rem",
    color: "#9ca3af",
    fontWeight: 500,
    marginTop: "2px",
  },
  text: {
    color: "#cbd5e1",
    lineHeight: 1.8,
    maxWidth: "420px",
  },
  heading: {
    color: "#fff",
    fontWeight: 800,
    fontSize: "1rem",
    marginBottom: "18px",
    letterSpacing: "0.2px",
  },
  linkList: {
    lineHeight: "2.1",
  },
  link: {
    color: "#cbd5e1",
    textDecoration: "none",
    transition: "0.25s ease",
    fontWeight: 500,
  },
  linkText: {
    color: "#cbd5e1",
    fontWeight: 500,
  },
  socialIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.06)",
    color: "#e5e7eb",
    textDecoration: "none",
    transition: "0.25s ease",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  contactItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "14px",
    color: "#d1d5db",
    lineHeight: 1.5,
  },
  contactIcon: {
    color: "#60a5fa",
    flexShrink: 0,
  },
  ctaBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 18px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #0d6efd, #2563eb)",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 700,
    boxShadow: "0 14px 30px rgba(13,110,253,0.22)",
  },
  divider: {
    height: "1px",
    background: "rgba(255,255,255,0.08)",
    margin: "28px 0 18px",
  },
  bottomText: {
    color: "#94a3b8",
    fontSize: "0.92rem",
  },
  bottomLink: {
    color: "#cbd5e1",
    textDecoration: "none",
    fontSize: "0.92rem",
    transition: "0.25s ease",
  },
  developerLink: {
    color: "#60a5fa",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: "0.95rem",
    transition: "0.25s ease",
  },
};

export default Footer;