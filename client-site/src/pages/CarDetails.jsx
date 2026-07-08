import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  MapPin,
  Users,
  Cog,
  Fuel,
  Star,
  BadgeCheck,
  CheckCircle2,
  ShieldCheck,
  Clock3,
  CarFront,
  ArrowLeft,
  MessageCircle,
} from "lucide-react";

const API = "https://full-stack-car-rental-system.vercel.app";

const getFallbackType = (seats) => {
  const s = Number(seats || 5);
  if (s >= 7) return "SUV";
  if (s <= 4) return "Hatchback";
  return "Sedan";
};

const normalizeCar = (data) => {
  const type = data?.type || getFallbackType(data?.seats);
  const status =
    data?.status === "available"
      ? "Available"
      : data?.status === "booked"
      ? "Booked"
      : data?.status === "maintenance"
      ? "Maintenance"
      : data?.status || "Available";

  return {
    id: data?.id,
    name: data?.name || "Car Details",
    year: data?.year || "",
    location: data?.location || "Islamabad",
    seats: data?.seats || 5,
    transmission: data?.transmission || "Automatic",
    fuel: data?.fuel_type || "Petrol",
    price: data?.daily_price || 0,
    rating: Number(data?.rating || (data?.featured ? 4.8 : 4.5)),
    badges:
      Array.isArray(data?.badges) && data.badges.length > 0
        ? data.badges
        : ["Clean Interior", "Family Ride", "Driver Included"],
    type,
    status,
    image: data?.image_url ? `${API}${data.image_url}` : "",
    description:
      data?.description ||
      "A comfortable and reliable car for family trips, airport transfers, city travel, and out-of-city journeys.",
  };
};

const CarDetails = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API}/api/cars/public/${id}`);
        const data = await res.json();

        if (!res.ok) {
          setCar(null);
          return;
        }

        setCar(normalizeCar(data));
      } catch (error) {
        console.error("Car details fetch error:", error);
        setCar(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  if (loading) {
    return (
      <div style={styles.pageWrap}>
        <div className="container py-5">
          <div className="text-center py-5">
            <h1 className="fw-bold mb-2" style={{ fontSize: "2rem" }}>
              Loading car details...
            </h1>
            <p className="text-muted mb-4">Please wait while we fetch data.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div style={styles.pageWrap}>
        <div className="container py-5">
          <div className="text-center py-5">
            <h1 className="fw-bold mb-2" style={{ fontSize: "2rem" }}>
              Car not found
            </h1>
            <p className="text-muted mb-4">
              The car you are looking for is not available.
            </p>
            <Link to="/cars" className="btn btn-primary px-4 py-2 rounded-4">
              Back to Cars
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageWrap}>
      <style>{`
        .details-title {
          font-size: clamp(1.45rem, 2.3vw, 2rem);
          line-height: 1.14;
          letter-spacing: -0.03em;
        }

        .details-card,
        .info-card {
          background: #fff;
          border: 1px solid rgba(15, 23, 42, 0.08);
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.05);
          border-radius: 22px;
        }

        .car-image {
          width: 100%;
          height: 100%;
          min-height: 270px;
          object-fit: cover;
          border-radius: 18px;
          display: block;
        }

        .pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 11px;
          border-radius: 999px;
          background: rgba(13, 110, 253, 0.08);
          color: #0d6efd;
          font-weight: 700;
          font-size: 0.8rem;
        }

        .meta-row {
          color: #475569;
          font-size: 0.88rem;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-right: 12px;
          margin-bottom: 6px;
          white-space: nowrap;
        }

        .rating-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(245, 158, 11, 0.08);
          color: #f59e0b;
          padding: 6px 10px;
          border-radius: 999px;
          font-weight: 800;
          font-size: 0.84rem;
        }

        .action-btn {
          min-height: 44px;
          border-radius: 12px;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-decoration: none;
        }

        .book-btn {
          background: linear-gradient(135deg, #0d6efd, #2563eb);
          color: #fff;
          border: none;
          box-shadow: 0 10px 20px rgba(13, 110, 253, 0.16);
        }

        .book-btn:hover {
          color: #fff;
        }

        .back-btn {
          background: #fff;
          color: #0f172a;
          border: 1px solid #d1d5db;
        }

        .back-btn:hover {
          color: #0f172a;
        }

        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          color: #334155;
          margin-bottom: 8px;
          font-size: 0.92rem;
        }

        .feature-dot {
          margin-top: 3px;
          color: #0d6efd;
          flex-shrink: 0;
        }

        .small-card {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          height: 100%;
        }

        .section-heading {
          font-size: 0.92rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 10px;
        }

        @media (max-width: 991.98px) {
          .car-image {
            min-height: 240px;
          }
        }

        @media (max-width: 575.98px) {
          .car-image {
            min-height: 210px;
            border-radius: 16px;
          }
        }
      `}</style>

      <section className="container py-3 py-lg-4">
        <div className="mb-3">
          <Link to="/cars" className="btn back-btn action-btn">
            <ArrowLeft size={17} />
            Back to Cars
          </Link>
        </div>

        <div className="row g-4 align-items-start">
          <div className="col-12 col-lg-6">
            <div className="details-card p-3 p-md-3 h-100">
              <img
                src={
                  car.image ||
                  "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1200"
                }
                alt={car.name}
                className="car-image"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1200";
                }}
              />

              <div className="row g-3 mt-3">
                <div className="col-12 col-md-4">
                  <div className="info-card p-3">
                    <div className="d-flex align-items-center gap-2 mb-1 fw-bold text-dark">
                      <ShieldCheck size={16} className="text-primary" />
                      Service Promise
                    </div>
                    <p className="text-muted mb-0 small" style={{ lineHeight: 1.6 }}>
                      Clean car, polite driver, and on-time pickup.
                    </p>
                  </div>
                </div>

                <div className="col-12 col-md-4">
                  <div className="info-card p-3">
                    <div className="d-flex align-items-center gap-2 mb-1 fw-bold text-dark">
                      <Clock3 size={16} className="text-primary" />
                      Booking Info
                    </div>
                    <p className="text-muted mb-0 small" style={{ lineHeight: 1.6 }}>
                      Confirmation and driver details shared after booking.
                    </p>
                  </div>
                </div>

                <div className="col-12 col-md-4">
                  <div className="info-card p-3">
                    <div className="d-flex align-items-center gap-2 mb-1 fw-bold text-dark">
                      <CarFront size={16} className="text-primary" />
                      Travel Types
                    </div>
                    <p className="text-muted mb-0 small" style={{ lineHeight: 1.6 }}>
                      Airport, city, family, and out-of-city rides.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="details-card p-4 p-md-4 h-100">
              <div className="d-flex flex-wrap gap-2 mb-3">
                <span className="pill">
                  <BadgeCheck size={15} />
                  {car.type}
                </span>
                <span
                  className="pill"
                  style={{ background: "rgba(34,197,94,0.12)", color: "#15803d" }}
                >
                  {car.status}
                </span>
              </div>

              <h1 className="details-title fw-bold text-dark mb-2">
                {car.name}
              </h1>

              <p className="text-muted mb-3" style={{ lineHeight: 1.65 }}>
                {car.description}
              </p>

              <div className="d-flex flex-wrap align-items-center mb-3">
                <span className="rating-pill me-2 mb-2">
                  <Star size={14} fill="currentColor" />
                  {car.rating.toFixed(1)}
                </span>
                <span className="meta-row">
                  <MapPin size={15} className="text-primary" />
                  {car.location}
                </span>
                <span className="meta-row">
                  <Users size={15} className="text-primary" />
                  {car.seats} Seats
                </span>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-6">
                  <div className="small-card p-3">
                    <div className="d-flex align-items-center gap-2 mb-1 fw-bold text-dark">
                      <Cog size={15} className="text-primary" />
                      Transmission
                    </div>
                    <div className="text-muted small">{car.transmission}</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="small-card p-3">
                    <div className="d-flex align-items-center gap-2 mb-1 fw-bold text-dark">
                      <Fuel size={15} className="text-primary" />
                      Fuel
                    </div>
                    <div className="text-muted small">{car.fuel}</div>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="section-heading">Included Features</div>
                {(car.badges || []).map((item, index) => (
                  <div key={index} className="feature-item">
                    <CheckCircle2 size={16} className="feature-dot" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="d-grid gap-2 d-sm-flex">
                <Link
                  to={`/book-now/${car.id}`}
                  className="btn action-btn book-btn flex-grow-1"
                >
                  Book Now
                </Link>

                <a
                  href="https://wa.me/923000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn action-btn back-btn flex-grow-1"
                >
                  <MessageCircle size={17} />
                  Chat on WhatsApp
                </a>
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
  },
};

export default CarDetails;