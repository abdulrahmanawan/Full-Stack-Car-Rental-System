import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  CalendarDays, Clock3, MapPin, Phone, User, Mail, CarFront,
  BadgeCheck, ArrowLeft, Users, MessageSquareText, Fuel, Cog,
  Star, CheckCircle2, Loader2, X, AlertCircle,
} from "lucide-react";

const API = "http://localhost:5000";

const initialFormData = {
  name: "",
  phone: "",
  email: "",
  pickupLocation: "",
  dropLocation: "",
  date: "",
  time: "",
  tripType: "Airport Transfer",
  passengers: "",
  message: "",
};

const BookNow = () => {
  const { id } = useParams();

  const [cars, setCars] = useState([]);
  const [carsLoading, setCarsLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState({ visible: false, type: "success", message: "" });
  const [loggedInCustomer, setLoggedInCustomer] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("customerToken");
    const customerStr = localStorage.getItem("customer");
    if (token && customerStr) {
      try {
        const customer = JSON.parse(customerStr);
        setLoggedInCustomer(customer);
        setFormData(prev => ({
          ...prev,
          name: customer.name || "",
          phone: customer.phone || "",
          email: customer.email || "",
        }));
      } catch (e) { }
    }
  }, []);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch(`${API}/api/cars/public`);
        if (!res.ok) throw new Error("Failed to fetch cars");
        const data = await res.json();
        if (Array.isArray(data)) {
          setCars(data);
          const found = data.find((car) => String(car.id) === String(id));
          setSelectedCar(found || data[0] || null);
        }
      } catch (err) {
        showNotification("error", "Could not load cars.");
      } finally {
        setCarsLoading(false);
      }
    };
    fetchCars();
  }, [id]);

  useEffect(() => {
    if (notification.visible) {
      const timer = setTimeout(() => setNotification(prev => ({ ...prev, visible: false })), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification.visible]);

  const showNotification = (type, message) => {
    setNotification({ visible: true, type, message });
  };

  const handleChange = (e) => {
    if (loggedInCustomer && (e.target.name === "name" || e.target.name === "phone" || e.target.name === "email")) {
      return;
    }
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let customerId;

      if (loggedInCustomer) {
        customerId = loggedInCustomer.id;
      } else {
        const customerRes = await fetch(`${API}/api/customers/public`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
          }),
        });
        if (!customerRes.ok) throw new Error("Customer creation failed");
        const customer = await customerRes.json();
        customerId = customer.id;
      }

      const bookingRes = await fetch(`${API}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: customerId,
          car_id: selectedCar?.id,
          trip_type: formData.tripType,
          pickup_location: formData.pickupLocation,
          drop_location: formData.dropLocation,
          booking_date: formData.date,
          booking_time: formData.time,
          passengers: formData.passengers,
          message: formData.message,
        }),
      });

      if (!bookingRes.ok) {
        const errData = await bookingRes.json().catch(() => ({}));
        throw new Error(errData.message || "Booking failed");
      }

      const booking = await bookingRes.json();
      showNotification("success", `Booking #${booking.id} confirmed successfully!`);

      if (!loggedInCustomer) {
        setFormData(initialFormData);
      } else {
        setFormData(prev => ({
          ...prev,
          pickupLocation: "",
          dropLocation: "",
          date: "",
          time: "",
          tripType: "Airport Transfer",
          passengers: "",
          message: "",
        }));
      }
    } catch (err) {
      showNotification("error", err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (carsLoading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!selectedCar) {
    return (
      <div className="container py-5 text-center">
        <h3>Car not found.</h3>
        <Link to="/cars" className="btn btn-primary mt-3">Back to Cars</Link>
      </div>
    );
  }

  const carType = selectedCar.type || selectedCar.car_type || "N/A";
  const carFuel = selectedCar.fuel_type || "N/A";
  const carRating = selectedCar.rating || 0;
  const carSeats = selectedCar.seats || "N/A";
  const carTransmission = selectedCar.transmission || "N/A";
  const carName = selectedCar.name || "Unknown Car";

  return (
    <div style={styles.pageWrap}>
      {notification.visible && (
        <div style={styles.toastWrapper}>
          <div
            style={{
              ...styles.toast,
              background: notification.type === "success" ? "#065f46" : "#991b1b",
            }}
          >
            <div style={styles.toastContent}>
              {notification.type === "success" ? (
                <CheckCircle2 size={20} style={{ flexShrink: 0 }} />
              ) : (
                <AlertCircle size={20} style={{ flexShrink: 0 }} />
              )}
              <span style={styles.toastMessage}>{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(prev => ({ ...prev, visible: false }))}
              style={styles.toastClose}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        .book-title {
          font-size: clamp(1.8rem, 4vw, 3rem);
          line-height: 1.1;
          letter-spacing: -0.03em;
        }
        .book-subtitle {
          color: #64748b;
          max-width: 760px;
          margin: 0 auto;
          font-size: 1rem;
        }
        .page-card {
          background: #fff;
          border: 1px solid rgba(15, 23, 42, 0.08);
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
        }
        .form-control,
        .form-select {
          min-height: 52px;
          border-radius: 14px !important;
          border: 1px solid #dbe3ef !important;
          box-shadow: none !important;
        }
        textarea.form-control {
          min-height: 140px;
          resize: vertical;
        }
        .book-btn {
          min-height: 52px;
          border-radius: 14px !important;
          border: none !important;
          background: linear-gradient(135deg, #0d6efd, #2563eb) !important;
          box-shadow: 0 12px 24px rgba(13, 110, 253, 0.18);
          font-weight: 800;
          color: #fff !important;
        }
        .book-btn:hover {
          color: #fff !important;
        }
        .back-btn {
          min-height: 44px;
          border-radius: 12px;
          background: #fff;
          color: #0f172a;
          border: 1px solid #d1d5db;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
        }
        .summary-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 999px;
          background: rgba(13, 110, 253, 0.08);
          color: #0d6efd;
          font-weight: 700;
          font-size: 0.88rem;
        }
        .mini-card {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
        }
        .mini-label {
          color: #0f172a;
          font-weight: 800;
          font-size: 0.92rem;
          margin-bottom: 4px;
        }
        .mini-value {
          color: #64748b;
          font-size: 0.95rem;
          margin-bottom: 0;
        }
        .check-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          color: #334155;
          margin-bottom: 12px;
          font-size: 0.95rem;
        }
        .check-dot {
          margin-top: 3px;
          color: #0d6efd;
          flex-shrink: 0;
        }
        @keyframes slideInRight {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @media (max-width: 575.98px) {
          .price-value {
            font-size: 1.6rem;
          }
        }
      `}</style>

      <section className="container py-4 py-lg-5">
        <div className="mb-3 mb-lg-4">
          <Link to="/cars" className="back-btn px-3 py-2">
            <ArrowLeft size={17} />
            Back to Cars
          </Link>
        </div>

        <div className="text-center mb-4 mb-lg-5">
          <span className="summary-badge mb-3">
            <BadgeCheck size={16} />
            Simple Booking Form
          </span>
          <h1 className="book-title fw-bold text-dark mb-3">
            Book Your Ride in a Few Easy Steps
          </h1>
          <p className="book-subtitle mb-0">
            Fill in your details and we will contact you quickly with booking
            confirmation and driver allocation.
          </p>
        </div>

        <div className="row g-4 align-items-start">
          <div className="col-lg-7">
            <div className="page-card rounded-4 p-4 p-md-5">
              <h2 className="h5 fw-bold text-dark mb-3">Booking Details</h2>

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-dark">
                      <User size={16} className="me-2 text-primary" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter your name"
                      required
                      readOnly={!!loggedInCustomer}
                      style={loggedInCustomer ? { backgroundColor: "#f1f5f9", cursor: "not-allowed" } : {}}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-dark">
                      <Phone size={16} className="me-2 text-primary" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="03xx xxxxxxx"
                      required
                      readOnly={!!loggedInCustomer}
                      style={loggedInCustomer ? { backgroundColor: "#f1f5f9", cursor: "not-allowed" } : {}}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-dark">
                      <Mail size={16} className="me-2 text-primary" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="your@email.com"
                      required
                      readOnly={!!loggedInCustomer}
                      style={loggedInCustomer ? { backgroundColor: "#f1f5f9", cursor: "not-allowed" } : {}}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-dark">
                      <CarFront size={16} className="me-2 text-primary" />
                      Trip Type
                    </label>
                    <select
                      name="tripType"
                      value={formData.tripType}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option>Airport Transfer</option>
                      <option>City Ride</option>
                      <option>Out of City</option>
                      <option>Family Trip</option>
                      <option>One Way</option>
                      <option>Round Trip</option>
                    </select>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-dark">
                      <MapPin size={16} className="me-2 text-primary" />
                      Pickup Location
                    </label>
                    <input
                      type="text"
                      name="pickupLocation"
                      value={formData.pickupLocation}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Islamabad Airport, Blue Area..."
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-dark">
                      <MapPin size={16} className="me-2 text-primary" />
                      Drop Location
                    </label>
                    <input
                      type="text"
                      name="dropLocation"
                      value={formData.dropLocation}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Destination location"
                      required
                    />
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold text-dark">
                      <CalendarDays size={16} className="me-2 text-primary" />
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="form-control"
                      required
                      min={new Date().toISOString().split('T')[0]}   
                    />
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold text-dark">
                      <Clock3 size={16} className="me-2 text-primary" />
                      Time
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold text-dark">
                      <Users size={16} className="me-2 text-primary" />
                      Passengers
                    </label>
                    <input
                      type="number"
                      name="passengers"
                      value={formData.passengers}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Number"
                      min="1"
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold text-dark">
                      <MessageSquareText size={16} className="me-2 text-primary" />
                      Additional Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Write your special request here..."
                    ></textarea>
                  </div>

                  <div className="col-12 d-grid mt-2">
                    <button
                      type="submit"
                      className="btn book-btn"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={18} className="me-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Confirm Booking"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="page-card rounded-4 p-4 p-md-4 h-100">
              <div className="summary-badge mb-3">
                <BadgeCheck size={16} />
                Selected Car
              </div>

              <h2 className="h5 fw-bold text-dark mb-2">{carName}</h2>
              <p className="text-muted mb-3" style={{ lineHeight: 1.7 }}>
                {carType} • Suitable for clean and comfortable travel
              </p>

              <div className="row g-3 mb-3">
                <div className="col-6">
                  <div className="mini-card p-3 h-100">
                    <div className="mini-label d-flex align-items-center gap-2">
                      <Star size={15} className="text-warning" />
                      Rating
                    </div>
                    <p className="mini-value">
                      {carRating ? Number(carRating).toFixed(1) : "N/A"} / 5
                    </p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="mini-card p-3 h-100">
                    <div className="mini-label d-flex align-items-center gap-2">
                      <Users size={15} className="text-primary" />
                      Seats
                    </div>
                    <p className="mini-value">{carSeats}</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="mini-card p-3 h-100">
                    <div className="mini-label d-flex align-items-center gap-2">
                      <Cog size={15} className="text-primary" />
                      Transmission
                    </div>
                    <p className="mini-value">{carTransmission}</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="mini-card p-3 h-100">
                    <div className="mini-label d-flex align-items-center gap-2">
                      <Fuel size={15} className="text-primary" />
                      Fuel
                    </div>
                    <p className="mini-value">{carFuel}</p>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <h3 className="h6 fw-bold text-dark mb-3">What happens next?</h3>
                <div className="check-item">
                  <CheckCircle2 size={17} className="check-dot" />
                  <span>We receive your booking request.</span>
                </div>
                <div className="check-item">
                  <CheckCircle2 size={17} className="check-dot" />
                  <span>We confirm car availability and driver.</span>
                </div>
                <div className="check-item">
                  <CheckCircle2 size={17} className="check-dot" />
                  <span>We contact you with final confirmation.</span>
                </div>
              </div>

              <div className="mini-card p-3">
                <div className="d-flex align-items-center gap-2 mb-2 fw-bold text-dark">
                  <Phone size={16} className="text-primary" />
                  Need fast booking?
                </div>
                <p className="mini-value mb-0">
                  Call or message us directly for quick booking support.
                </p>
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
  toastWrapper: {
    position: "fixed",
    top: "24px",
    right: "24px",
    zIndex: 9999,
    maxWidth: "380px",
    width: "calc(100% - 48px)",
    animation: "slideInRight 0.45s ease",
  },
  toast: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    borderRadius: "16px",
    color: "#fff",
    boxShadow: "0 16px 40px rgba(0,0,0,0.2)",
    backdropFilter: "blur(10px)",
  },
  toastContent: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flex: 1,
  },
  toastMessage: {
    fontSize: "0.95rem",
    lineHeight: 1.4,
    fontWeight: 500,
  },
  toastClose: {
    background: "transparent",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    padding: "4px",
    marginLeft: "12px",
    opacity: 0.8,
    transition: "opacity 0.2s",
    flexShrink: 0,
  },
};

export default BookNow;