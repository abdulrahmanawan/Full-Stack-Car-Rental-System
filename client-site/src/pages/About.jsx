import React from "react";
import { Link } from "react-router-dom";
import { Car, ShieldCheck, Clock3, MapPinned, Users, BadgeCheck } from "lucide-react";

const About = () => {
  return (
    <div style={styles.pageWrap}>
      <style>{`
        .about-title {
          font-size: clamp(1.9rem, 3vw, 2.8rem);
          line-height: 1.12;
          letter-spacing: -0.03em;
        }

        .about-subtitle {
          color: #64748b;
          max-width: 720px;
          margin: 0 auto;
          font-size: 0.98rem;
          line-height: 1.7;
        }

        .about-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 999px;
          background: rgba(13, 110, 253, 0.08);
          color: #0d6efd;
          font-weight: 700;
          font-size: 0.86rem;
        }

        .about-card {
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.08);
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.05);
          border-radius: 24px;
          height: 100%;
        }

        .about-section-title {
          font-size: 1rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 10px;
        }

        .about-text {
          color: #64748b;
          line-height: 1.75;
          font-size: 0.95rem;
          margin-bottom: 0;
        }

        .about-icon {
          width: 50px;
          height: 50px;
          border-radius: 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0d6efd, #2563eb);
          color: #fff;
          flex-shrink: 0;
          box-shadow: 0 10px 20px rgba(13, 110, 253, 0.16);
        }

        .mini-box {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          height: 100%;
        }

        .about-list {
          padding-left: 18px;
          margin-bottom: 0;
        }

        .about-list li {
          margin-bottom: 10px;
          color: #334155;
          line-height: 1.6;
        }

        .about-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 18px;
          border-radius: 14px;
          background: linear-gradient(135deg, #0d6efd, #2563eb);
          color: #fff;
          text-decoration: none;
          font-weight: 700;
          box-shadow: 0 12px 24px rgba(13, 110, 253, 0.18);
        }

        .about-cta:hover {
          color: #fff;
        }
      `}</style>

      <section className="container py-4 py-lg-5">
        <div className="text-center mb-4 mb-lg-5">
          <span className="about-pill mb-3">
            <Car size={16} />
            About Awan Rent a Car
          </span>
          <h1 className="about-title fw-bold text-dark mb-3">
            Simple, Reliable, and Comfortable Travel
          </h1>
          <p className="about-subtitle mb-0">
            We provide clean cars with professional drivers for airport transfers,
            city rides, and out-of-city travel across Islamabad and nearby areas.
          </p>
        </div>

        <div className="row g-4 align-items-stretch">
          <div className="col-12 col-lg-6 d-flex">
            <div className="about-card p-4 p-md-5 w-100">
              <h2 className="about-section-title">Who We Are</h2>
              <p className="about-text mb-4">
                Awan Rent a Car is a family-run service focused on comfort,
                punctuality, and clean vehicles. Our aim is to make every ride
                easy and stress-free.
              </p>

              <div className="d-flex align-items-start gap-3 mb-4">
                <div className="about-icon">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3 className="about-section-title mb-1">Trusted Service</h3>
                  <p className="about-text">
                    Every booking is handled carefully and every ride is managed by a trained driver.
                  </p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3">
                <div className="about-icon">
                  <Clock3 size={22} />
                </div>
                <div>
                  <h3 className="about-section-title mb-1">On-Time Travel</h3>
                  <p className="about-text">
                    We try to keep pickup and drop-off on time so your travel stays smooth.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-6 d-flex">
            <div className="about-card p-4 p-md-5 w-100">
              <h2 className="about-section-title">Why Customers Choose Us</h2>
              <p className="about-text mb-4">
                Customers choose us because we keep things simple, honest, and comfortable.
              </p>

              <ul className="about-list mb-4">
                <li>Clean and well-maintained vehicles</li>
                <li>Professional drivers only</li>
                <li>Airport, city, and out-of-city rides</li>
                <li>Fast booking and easy communication</li>
                <li>Fair pricing with clear service details</li>
              </ul>

              <div className="row g-3 mb-4">
                <div className="col-12 col-sm-6">
                  <div className="mini-box p-3 p-md-4">
                    <div className="d-flex align-items-center gap-2 mb-2 text-primary fw-bold">
                      <MapPinned size={18} />
                      Islamabad Base
                    </div>
                    <p className="mb-0 text-muted small">
                      Serving airport and nearby routes
                    </p>
                  </div>
                </div>

                <div className="col-12 col-sm-6">
                  <div className="mini-box p-3 p-md-4">
                    <div className="d-flex align-items-center gap-2 mb-2 text-primary fw-bold">
                      <Users size={18} />
                      Family Friendly
                    </div>
                    <p className="mb-0 text-muted small">
                      Comfortable rides for all travelers
                    </p>
                  </div>
                </div>
              </div>

              <Link to="/contact" className="about-cta">
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center mt-4 mt-lg-5">
          <span className="about-pill">
            <BadgeCheck size={16} />
            Clean design. Reliable service.
          </span>
        </div>
      </section>
    </div>
  );
};

const styles = {
  pageWrap: {
    background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
    minHeight: "100vh",
  },
};

export default About;