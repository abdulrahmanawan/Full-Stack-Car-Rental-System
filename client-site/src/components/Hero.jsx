import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, CarFront, Users, ShieldCheck, Headphones, Zap } from "lucide-react";

const carTypes = ["All Types", "Sedan", "Hatchback", "SUV", "Van", "Luxury", "MPV", "Other"];
const seatOptions = ["Any Seats", "4", "5", "7"];

const Hero = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All Types");
  const [seats, setSeats] = useState("Any Seats");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    if (type !== "All Types") params.set("type", type);
    if (seats !== "Any Seats") params.set("seats", seats);
    navigate(`/cars?${params.toString()}`);
  };

  return (
    <section className="hero-wrapper">
      <div className="hero-bg-grid" />
      <style>{`
        .hero-wrapper {
          background: linear-gradient(135deg, #0b1220 0%, #0f2342 45%, #14315d 100%);
          padding-top: 12px;
          padding-bottom: 28px;
          position: relative;
          overflow: hidden;
        }

        .hero-bg-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 44px 44px;
          mask-image: linear-gradient(to bottom, rgba(0,0,0,0.3), transparent 100%);
          pointer-events: none;
        }

        .hero-title {
          font-size: clamp(2rem, 4vw, 3.35rem);
          line-height: 1.08;
          letter-spacing: -0.03em;
          max-width: 820px;
        }

        .hero-subtitle {
          font-size: clamp(0.98rem, 1.3vw, 1.1rem);
          line-height: 1.75;
          max-width: 720px;
        }

        .hero-search-card {
          border: 1px solid rgba(255,255,255,0.12);
          box-shadow: 0 18px 50px rgba(0,0,0,0.18);
          max-width: 1120px;
        }

        .hero-input,
        .hero-select {
          border-radius: 14px !important;
          border: 1px solid #dbe3ef !important;
          box-shadow: none !important;
          min-height: 52px;
          font-size: 0.95rem;
        }

        .hero-btn {
          border-radius: 14px !important;
          min-height: 52px;
          border: none !important;
          background: linear-gradient(135deg, #0d6efd, #2563eb) !important;
          box-shadow: 0 12px 24px rgba(13,110,253,0.22);
          font-size: 0.95rem;
        }

        .hero-label {
          color: #1f2937;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .hero-stat-card {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.10);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          min-height: 108px;
        }

        .hero-stat-number {
          color: #ffffff;
          font-size: clamp(1.5rem, 2.2vw, 2rem);
          line-height: 1;
        }

        .hero-stat-text {
          color: rgba(255,255,255,0.75);
          font-size: 0.92rem;
          line-height: 1.4;
        }

        .service-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 999px;
          padding: 6px 12px;
          color: #e2e8f0;
          font-size: 0.8rem;
          font-weight: 500;
          backdrop-filter: blur(4px);
          transition: transform 0.2s;
        }

        .service-pill:hover {
          transform: translateY(-1px);
          background: rgba(255,255,255,0.14);
        }

        @media (max-width: 991.98px) {
          .hero-wrapper {
            padding-top: 24px;
            padding-bottom: 24px;
          }
          .hero-search-card {
            margin-top: 18px;
          }
        }

        @media (max-width: 575.98px) {
          .hero-search-card {
            padding: 14px !important;
          }
          .hero-btn {
            width: 100%;
          }
          .hero-stat-card {
            padding: 14px !important;
            min-height: 96px;
          }
        }
      `}</style>

      <div className="container py-4 py-lg-5 position-relative">
        <div className="row justify-content-center">
          <div className="col-12 col-xl-10 text-center">
            <h1 className="hero-title fw-bold mb-3 mx-auto text-white">
              Find Your Perfect <span style={{ color: "#8fd3ff" }}>Rental Car</span>
            </h1>

            <p className="hero-subtitle mb-4 mx-auto" style={{ color: "rgba(255,255,255,0.78)" }}>
              Discover reliable cars, professional drivers, and smooth booking for
              airport transfers, city rides, and out-of-city travel.
            </p>

            <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
              <span className="service-pill"><CarFront size={14} />Premium Fleet</span>
              <span className="service-pill"><ShieldCheck size={14} />Verified Drivers</span>
              <span className="service-pill"><Zap size={14} />Instant Booking</span>
              <span className="service-pill"><Headphones size={14} />24/7 Support</span>
            </div>

            <div className="bg-white rounded-4 shadow-lg p-3 p-md-4 mx-auto hero-search-card">
              <div className="row g-3 align-items-end text-start">
                <div className="col-12 col-md-6 col-lg-3">
                  <label className="hero-label">
                    <Search size={16} />
                    <span>Search Car</span>
                  </label>
                  <input
                    type="text"
                    className="form-control hero-input"
                    placeholder="Name, city or type"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>

                <div className="col-12 col-md-6 col-lg-3">
                  <label className="hero-label">
                    <CarFront size={16} />
                    <span>Car Type</span>
                  </label>
                  <select
                    className="form-select hero-select"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    {carTypes.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-6 col-lg-3">
                  <label className="hero-label">
                    <Users size={16} />
                    <span>Seats</span>
                  </label>
                  <select
                    className="form-select hero-select"
                    value={seats}
                    onChange={(e) => setSeats(e.target.value)}
                  >
                    {seatOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-6 col-lg-3">
                  <button
                    className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2 fw-semibold hero-btn"
                    onClick={handleSearch}
                  >
                    <Search size={18} />
                    Search
                  </button>
                </div>
              </div>
            </div>

            <div className="row g-3 g-md-4 mt-4 mt-lg-5">
              <div className="col-6 col-lg-3">
                <div className="p-3 p-md-4 rounded-4 h-100 hero-stat-card">
                  <h2 className="fw-bold mb-1 hero-stat-number">7+</h2>
                  <p className="mb-0 hero-stat-text">Premium Cars</p>
                </div>
              </div>
              <div className="col-6 col-lg-3">
                <div className="p-3 p-md-4 rounded-4 h-100 hero-stat-card">
                  <h2 className="fw-bold mb-1 hero-stat-number">24/7</h2>
                  <p className="mb-0 hero-stat-text">Support</p>
                </div>
              </div>
              <div className="col-6 col-lg-3">
                <div className="p-3 p-md-4 rounded-4 h-100 hero-stat-card">
                  <h2 className="fw-bold mb-1 hero-stat-number">Fast</h2>
                  <p className="mb-0 hero-stat-text">Booking Process</p>
                </div>
              </div>
              <div className="col-6 col-lg-3">
                <div className="p-3 p-md-4 rounded-4 h-100 hero-stat-card">
                  <h2 className="fw-bold mb-1 hero-stat-number">100%</h2>
                  <p className="mb-0 hero-stat-text">Trusted Service</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;