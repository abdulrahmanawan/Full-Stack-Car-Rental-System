import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  MapPin,
  Users,
  Cog,
  Fuel,
  Star,
  BadgeCheck,
  Search,
  SlidersHorizontal,
  ArrowRight,
} from "lucide-react";

const carTypes = ["All Types", "Sedan", "Hatchback", "SUV"];
const seatOptions = ["Any Seats", "4", "5", "7"];

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") || "");
  const [type, setType] = useState(searchParams.get("type") || "All Types");
  const [seats, setSeats] = useState(searchParams.get("seats") || "Any Seats");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API = "http://localhost:5000";

  const getCardType = (car) => {
    if (car.type) return car.type;
    const seatCount = Number(car.seats);
    if (seatCount >= 7) return "SUV";
    if (seatCount <= 4) return "Hatchback";
    return "Sedan";
  };

  const getDisplayStatus = (status) => {
    if (status === "available") return "Available Now";
    if (status === "booked") return "Booked";
    if (status === "maintenance") return "Maintenance";
    return status || "Available Now";
  };

  const getDisplayRating = (car) => {
    if (car.rating) return Number(car.rating);
    if (car.featured === 1) return 4.8;
    return 4.5;
  };

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API}/api/cars/public`);
        const data = await res.json();

        const normalized = Array.isArray(data)
          ? data.map((car) => ({
              id: car.id,
              name: car.name,
              year: car.year,
              location: car.location || "Islamabad",
              seats: car.seats || 5,
              transmission: car.transmission || "Automatic",
              fuel: car.fuel_type || "Petrol",
              price: car.daily_price || 0,
              rating: getDisplayRating(car),
              type: getCardType(car),
              status: getDisplayStatus(car.status),
              image: car.image_url ? `${API}${car.image_url}` : "",
              brand: car.brand || "",
              model: car.model || "",
            }))
          : [];

        setCars(normalized);
      } catch (error) {
        console.error("Cars fetch error:", error);
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const filteredCars = useMemo(() => {
    const q = query.trim().toLowerCase();

    return cars.filter((car) => {
      const matchesQuery =
        !q ||
        car.name.toLowerCase().includes(q) ||
        car.location.toLowerCase().includes(q) ||
        car.type.toLowerCase().includes(q) ||
        car.brand.toLowerCase().includes(q) ||
        car.model.toLowerCase().includes(q);

      const matchesType = type === "All Types" || car.type === type;
      const matchesSeats = seats === "Any Seats" || String(car.seats) === seats;

      return matchesQuery && matchesType && matchesSeats;
    });
  }, [query, type, seats, cars]);

  const clearFilters = () => {
    setQuery("");
    setType("All Types");
    setSeats("Any Seats");
    navigate("/cars", { replace: true });
  };

  return (
    <section style={styles.pageWrap}>
      <style>{`
        * { box-sizing: border-box; }

        .cars-shell {
          width: min(1160px, calc(100% - 28px));
          margin: 0 auto;
          padding: 48px 0 64px;
        }

        .section-pill {
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

        .cars-title {
          font-size: clamp(1.9rem, 3.2vw, 2.8rem);
          line-height: 1.1;
          letter-spacing: -0.03em;
          margin: 0;
        }

        .cars-subtitle {
          color: #64748b;
          max-width: 720px;
          margin: 0 auto;
          font-size: 0.98rem;
          line-height: 1.7;
        }

        .hero-box {
          background:
            radial-gradient(circle at top left, rgba(13, 110, 253, 0.10), transparent 38%),
            linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
          border: 1px solid rgba(15, 23, 42, 0.08);
          box-shadow: 0 18px 42px rgba(15, 23, 42, 0.06);
          border-radius: 28px;
          padding: 26px;
        }

        .filter-box {
          margin-top: 22px;
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.08);
          border-radius: 24px;
          box-shadow: 0 14px 34px rgba(15, 23, 42, 0.06);
          padding: 18px;
        }

        .filter-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .filter-title {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }

        .filter-reset {
          border: 0;
          background: transparent;
          color: #0d6efd;
          font-weight: 700;
          padding: 0;
        }

        .filter-reset:hover {
          text-decoration: underline;
        }

        .search-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 0.8fr auto;
          gap: 12px;
        }

        @media (max-width: 992px) {
          .search-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 576px) {
          .search-grid {
            grid-template-columns: 1fr;
          }
        }

        .field-label {
          display: block;
          font-size: 0.9rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .input-wrap {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
        }

        .search-input,
        .search-select {
          width: 100%;
          min-height: 52px;
          border-radius: 14px;
          border: 1px solid #dbe3ef;
          background: #fff;
          color: #0f172a;
          outline: none;
          box-shadow: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          font-size: 0.97rem;
        }

        .search-input {
          padding: 0 16px 0 42px;
        }

        .search-select {
          padding: 0 14px;
        }

        .search-input:focus,
        .search-select:focus {
          border-color: #0d6efd;
          box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.12);
        }

        .search-btn {
          min-height: 52px;
          border-radius: 14px;
          border: none;
          background: linear-gradient(135deg, #0d6efd, #2563eb);
          color: #fff;
          font-weight: 800;
          padding: 0 18px;
          box-shadow: 0 12px 24px rgba(13, 110, 253, 0.18);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
        }

        .search-btn:hover {
          color: #fff;
          transform: translateY(-1px);
        }

        .results-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin: 22px 2px 16px;
          color: #64748b;
          font-size: 0.94rem;
          flex-wrap: wrap;
        }

        .results-count {
          color: #0f172a;
          font-weight: 800;
        }

        .cars-grid {
          display: grid;
          grid-template-columns: repeat(1, minmax(0, 1fr));
          gap: 20px;
        }

        @media (min-width: 768px) {
          .cars-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (min-width: 992px) {
          .cars-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        .car-card {
          background: #fff;
          border: 1px solid rgba(15, 23, 42, 0.08);
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
          transition: all 0.28s ease;
          overflow: hidden;
          border-radius: 24px;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .car-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 42px rgba(15, 23, 42, 0.12);
        }

        .car-image-wrap {
          position: relative;
          overflow: hidden;
          background: #f8fafc;
        }

        .car-image {
          width: 100%;
          height: 230px;
          object-fit: cover;
          transition: transform 0.4s ease;
          display: block;
        }

        .car-card:hover .car-image {
          transform: scale(1.04);
        }

        .car-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(15, 23, 42, 0.02) 0%,
            rgba(15, 23, 42, 0.24) 100%
          );
          z-index: 1;
          pointer-events: none;
        }

        .car-top-badge,
        .car-status {
          position: absolute;
          top: 12px;
          z-index: 2;
          font-size: 0.72rem;
          font-weight: 800;
          padding: 6px 10px;
          border-radius: 999px;
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
        }

        .car-top-badge {
          left: 12px;
          background: rgba(255, 255, 255, 0.95);
          color: #0f172a;
        }

        .car-status {
          right: 12px;
          background: rgba(34, 197, 94, 0.12);
          color: #15803d;
        }

        .car-content {
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }

        .car-name {
          font-size: 1rem;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.3;
          margin: 0;
        }

        .car-meta {
          color: #64748b;
          font-size: 0.9rem;
          margin: 4px 0 0;
        }

        .rating-wrap {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-weight: 800;
          color: #f59e0b;
          background: rgba(245, 158, 11, 0.08);
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 0.84rem;
          white-space: nowrap;
        }

        .rating-label {
          color: #94a3b8;
          font-size: 0.75rem;
          margin-top: 4px;
          text-align: right;
        }

        .info-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px 10px;
        }

        .info-row {
          color: #475569;
          font-size: 0.89rem;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
        }

        .action-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
          margin-top: 2px;
        }

        @media (min-width: 576px) {
          .action-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        .car-btn {
          min-height: 48px;
          border-radius: 14px;
          font-weight: 600;
          transition: all 0.25s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          text-decoration: none;
          border: 1px solid transparent;
          padding: 0 14px;
        }

        .view-btn {
          background: #ffffff;
          border-color: #d1d5db;
          color: #0f172a;
        }

        .view-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          transform: translateY(-1px);
          color: #0f172a;
        }

        .book-btn {
          background: linear-gradient(135deg, #0d6efd, #2563eb);
          border: none;
          color: #ffffff;
          box-shadow: 0 10px 20px rgba(13, 110, 253, 0.16);
        }

        .book-btn:hover {
          color: #ffffff;
          transform: translateY(-1px);
          box-shadow: 0 14px 24px rgba(13, 110, 253, 0.22);
        }

        .empty-state {
          border: 1px dashed #cbd5e1;
          background: #fff;
          border-radius: 24px;
          padding: 36px 20px;
          text-align: center;
          color: #64748b;
        }

        .empty-state strong {
          display: block;
          color: #0f172a;
          font-size: 1.05rem;
          margin-bottom: 6px;
        }

        .view-all-row {
          display: flex;
          justify-content: center;
          margin-top: 28px;
        }

        .view-all-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-height: 52px;
          padding: 0 22px;
          border-radius: 16px;
          font-weight: 800;
          color: #fff;
          background: linear-gradient(135deg, #0d6efd, #2563eb);
          border: none;
          box-shadow: 0 14px 30px rgba(13, 110, 253, 0.22);
          text-decoration: none;
          transition: all 0.25s ease;
        }

        .view-all-btn:hover {
          color: #fff;
          transform: translateY(-1px);
          box-shadow: 0 18px 36px rgba(13, 110, 253, 0.28);
        }
      `}</style>

      <div className="cars-shell">
        <div className="hero-box">
          <div className="text-center">
            <span className="section-pill mb-3">
              <BadgeCheck size={16} />
              Featured Fleet
            </span>

            <h1 className="cars-title fw-bold text-dark mb-3">
              Choose Your Next Ride
            </h1>

            <p className="cars-subtitle mb-0">
              Browse clean, reliable, and affordable cars for city travel,
              airport transfers, family trips, and out-of-city bookings.
            </p>
          </div>

          <div className="filter-box">
            <div className="filter-head">
              <p className="filter-title">
                <SlidersHorizontal size={17} />
                Search & Filter
              </p>
              <button type="button" className="filter-reset" onClick={clearFilters}>
                Reset filters
              </button>
            </div>

            <div className="search-grid">
              <div>
                <label className="field-label">Search Car</label>
                <div className="input-wrap">
                  <Search size={16} className="input-icon" />
                  <input
                    type="text"
                    className="search-input"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by car name, city or type"
                  />
                </div>
              </div>

              <div>
                <label className="field-label">Car Type</label>
                <select
                  className="search-select"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  {carTypes.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="field-label">Seats</label>
                <select
                  className="search-select"
                  value={seats}
                  onChange={(e) => setSeats(e.target.value)}
                >
                  {seatOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="d-flex align-items-end">
                <button type="button" className="search-btn">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="results-bar">
          <div>
            Showing <span className="results-count">{loading ? 0 : filteredCars.length}</span>{" "}
            car{filteredCars.length !== 1 ? "s" : ""}
          </div>
          <div>{type === "All Types" ? "All categories" : type}</div>
        </div>

        {loading ? (
          <div className="empty-state">
            <strong>Loading cars...</strong>
            Admin panel se cars fetch ho rahi hain.
          </div>
        ) : (
          <div className="cars-grid">
            {filteredCars.map((car) => (
              <div key={car.id} className="car-card">
                <div className="car-image-wrap">
                  <img
                    src={
                      car.image ||
                      "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1200"
                    }
                    alt={car.name}
                    className="car-image"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1200";
                    }}
                  />
                  <div className="car-overlay" />
                  <span className="car-top-badge">{car.type}</span>
                  <span className="car-status">{car.status}</span>
                </div>

                <div className="car-content">
                  <div className="d-flex justify-content-between align-items-start gap-3">
                    <div>
                      <h3 className="car-name">{car.name}</h3>
                      <p className="car-meta">{car.year} Model</p>
                    </div>

                    <div className="text-end">
                      <div className="rating-wrap">
                        <Star size={14} fill="currentColor" />
                        {car.rating.toFixed(1)}
                      </div>
                      <div className="rating-label">Customer rating</div>
                    </div>
                  </div>

                  <div className="info-grid">
                    <span className="info-row">
                      <MapPin size={15} className="text-primary" />
                      {car.location}
                    </span>
                    <span className="info-row">
                      <Users size={15} className="text-primary" />
                      {car.seats} Seats
                    </span>
                    <span className="info-row">
                      <Cog size={15} className="text-primary" />
                      {car.transmission}
                    </span>
                    <span className="info-row">
                      <Fuel size={15} className="text-primary" />
                      {car.fuel}
                    </span>
                  </div>

                  <div className="mt-auto">
                    <div className="action-grid">
                      <Link to={`/cars/${car.id}`} className="btn car-btn view-btn">
                        View Details
                      </Link>
                      <Link to={`/book-now/${car.id}`} className="btn car-btn book-btn">
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredCars.length === 0 && (
          <div className="empty-state mt-4">
            <strong>No cars found</strong>
            Apna search ya filters reset karke dobara try karein.
          </div>
        )}

        <div className="view-all-row">
          <Link to="/" className="view-all-btn">
            Back to Home
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

const styles = {
  pageWrap: {
    background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
    minHeight: "100vh",
  },
};

export default Cars;