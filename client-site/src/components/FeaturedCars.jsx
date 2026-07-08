import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Users,
  Cog,
  Fuel,
  Star,
  ArrowRight,
  BadgeCheck,
} from "lucide-react";

const FeaturedCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = "https://full-stack-car-rental-system.vercel.app";

  const getTypeFromSeats = (seats) => {
    const count = Number(seats || 5);
    if (count >= 7) return "SUV";
    if (count <= 4) return "Hatchback";
    return "Sedan";
  };

  const getStatusLabel = (status) => {
    if (status === "available") return "Available";
    if (status === "booked") return "Booked";
    if (status === "maintenance") return "Maintenance";
    return status || "Available";
  };

  const getImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return `${API}${img}`;
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
              name: car.name || "Car",
              year: car.year || "",
              location: car.location || "Islamabad",
              seats: car.seats || 5,
              transmission: car.transmission || "Automatic",
              fuel: car.fuel_type || "Petrol",
              price: car.daily_price || 0,
              rating: Number(car.rating || (car.featured ? 4.8 : 4.5)),
              type: car.type || getTypeFromSeats(car.seats),
              status: getStatusLabel(car.status),
              image: getImageUrl(car.image_url),
              featured: Number(car.featured || 0),
            }))
          : [];

        const featuredOnly = normalized.filter((car) => car.featured === 1);

        setCars(featuredOnly.length > 0 ? featuredOnly : normalized);
      } catch (error) {
        console.error("Featured cars fetch error:", error);
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const visibleCars = useMemo(() => cars, [cars]);

  return (
    <section style={styles.sectionWrap}>
      <style>{`
        .fc-container {
          width: min(1160px, calc(100% - 28px));
          margin: 0 auto;
          padding: 48px 0;
        }

        .fc-title {
          font-size: clamp(1.7rem, 3vw, 2.5rem);
          line-height: 1.12;
          letter-spacing: -0.03em;
        }

        .fc-subtitle {
          color: #64748b;
          max-width: 720px;
          margin: 0 auto;
          font-size: 0.98rem;
          line-height: 1.7;
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
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.08);
          box-shadow: 0 10px 26px rgba(15, 23, 42, 0.06);
          transition: all 0.25s ease;
          overflow: hidden;
          border-radius: 22px;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .car-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 18px 36px rgba(15, 23, 42, 0.10);
        }

        .car-image-wrap {
          position: relative;
          overflow: hidden;
          background: #f8fafc;
        }

        .car-image {
          width: 100%;
          height: 214px;
          object-fit: cover;
          display: block;
          transition: transform 0.35s ease;
        }

        .car-card:hover .car-image {
          transform: scale(1.03);
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
          gap: 10px;
          flex: 1;
        }

        .car-name {
          font-size: 1rem;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.35;
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
          font-size: 0.88rem;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
        }

        .action-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
          margin-top: 4px;
        }

        @media (min-width: 576px) {
          .action-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        .car-btn {
          min-height: 46px;
          border-radius: 14px;
          font-weight: 600;
          transition: all 0.22s ease;
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

        .view-all-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-height: 50px;
          padding: 0 20px;
          border-radius: 16px;
          font-weight: 800;
          color: #fff;
          background: linear-gradient(135deg, #0d6efd, #2563eb);
          border: none;
          box-shadow: 0 12px 26px rgba(13, 110, 253, 0.20);
          text-decoration: none;
          transition: all 0.25s ease;
        }

        .view-all-btn:hover {
          color: #fff;
          transform: translateY(-1px);
          box-shadow: 0 16px 32px rgba(13, 110, 253, 0.25);
        }
      `}</style>

      <div className="fc-container">
        <div className="text-center mb-4 mb-lg-5">
          <span className="section-pill mb-3">
            <BadgeCheck size={16} />
            Our Featured Fleet
          </span>
          <h2 className="fc-title fw-bold mb-2 text-dark">
            Rent a Car for Every Journey
          </h2>
          <p className="fc-subtitle mb-0">
            Clean cars, reliable drivers, and practical options for city travel,
            airport transfers, family trips, and out-of-city bookings.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-5 text-muted fw-semibold">
            Loading cars...
          </div>
        ) : (
          <div className="cars-grid">
            {visibleCars.map((car) => (
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
                      <div className="rating-label">Rating</div>
                    </div>
                  </div>

                  <div className="info-grid">
                    <span className="info-row">
                      <MapPin size={14} className="text-primary" />
                      {car.location}
                    </span>
                    <span className="info-row">
                      <Users size={14} className="text-primary" />
                      {car.seats} Seats
                    </span>
                    <span className="info-row">
                      <Cog size={14} className="text-primary" />
                      {car.transmission}
                    </span>
                    <span className="info-row">
                      <Fuel size={14} className="text-primary" />
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

        <div className="text-center mt-4 mt-lg-5">
          <Link to="/cars" className="view-all-btn">
            View All Cars
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

const styles = {
  sectionWrap: {
    background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
  },
};

export default FeaturedCars;