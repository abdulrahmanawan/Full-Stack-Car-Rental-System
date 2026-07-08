import React from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock3,
  Send,
  MessageCircle,
  ArrowRight,
} from "lucide-react";

const Contact = () => {
  return (
    <div style={styles.pageWrap}>
      <style>{`
        .contact-title {
          font-size: clamp(1.9rem, 3vw, 2.7rem);
          line-height: 1.12;
          letter-spacing: -0.03em;
        }

        .contact-subtitle {
          color: #64748b;
          max-width: 720px;
          margin: 0 auto;
          font-size: 0.98rem;
          line-height: 1.7;
        }

        .contact-pill {
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

        .contact-card,
        .form-card {
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.08);
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.05);
          border-radius: 24px;
          height: 100%;
        }

        .contact-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0d6efd, #2563eb);
          color: #fff;
          box-shadow: 0 10px 20px rgba(13, 110, 253, 0.16);
          flex-shrink: 0;
        }

        .contact-label {
          color: #0f172a;
          font-weight: 800;
          margin-bottom: 3px;
          font-size: 0.98rem;
        }

        .contact-text {
          color: #64748b;
          margin-bottom: 0;
          line-height: 1.65;
          font-size: 0.95rem;
        }

        .mini-title {
          font-size: 1rem;
          font-weight: 800;
          color: #0f172a;
        }

        .mini-text {
          color: #64748b;
          margin-bottom: 0;
          font-size: 0.95rem;
          line-height: 1.7;
        }

        .form-control,
        .form-select {
          border-radius: 14px !important;
          border: 1px solid #dbe3ef !important;
          box-shadow: none !important;
          min-height: 48px;
          font-size: 0.96rem;
        }

        textarea.form-control {
          min-height: 130px;
          resize: vertical;
        }

        .form-control:focus,
        .form-select:focus {
          border-color: #0d6efd !important;
          box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.10) !important;
        }

        .send-btn {
          min-height: 50px;
          border-radius: 14px !important;
          border: none !important;
          background: linear-gradient(135deg, #0d6efd, #2563eb) !important;
          box-shadow: 0 12px 24px rgba(13, 110, 253, 0.18);
          font-weight: 800;
          color: #fff !important;
        }

        .send-btn:hover {
          color: #fff !important;
        }

        .quick-box {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
        }

        .quick-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 14px;
          border-radius: 14px;
          background: rgba(255,255,255,0.06);
          color: #fff;
          text-decoration: none;
          font-weight: 700;
          border: 1px solid rgba(255,255,255,0.08);
          transition: all 0.25s ease;
        }

        .quick-link:hover {
          color: #fff;
          transform: translateY(-1px);
          background: rgba(255,255,255,0.09);
        }

        .map-box {
          background: linear-gradient(135deg, #0b1220 0%, #10294d 100%);
          color: #fff;
          overflow: hidden;
          border-radius: 24px;
          height: 100%;
        }

        .map-placeholder {
          min-height: 190px;
          border-radius: 18px;
          background:
            radial-gradient(circle at 20% 20%, rgba(255,255,255,0.14), transparent 24%),
            radial-gradient(circle at 80% 30%, rgba(255,255,255,0.12), transparent 20%),
            linear-gradient(135deg, rgba(13,110,253,0.18), rgba(37,99,235,0.08));
          border: 1px solid rgba(255,255,255,0.08);
        }

        @media (max-width: 575.98px) {
          .contact-icon {
            width: 44px;
            height: 44px;
            border-radius: 13px;
          }
        }
      `}</style>

      <section className="container py-4 py-lg-5">
        <div className="text-center mb-4 mb-lg-5">
          <span className="contact-pill mb-3">
            <MessageCircle size={16} />
            Contact Awan Rent a Car
          </span>
          <h1 className="contact-title fw-bold text-dark mb-3">
            We are here to help you book your ride
          </h1>
          <p className="contact-subtitle mb-0">
            Reach out for bookings, airport transfers, out-of-city trips, or any question about our cars and services.
          </p>
        </div>

        <div className="row g-4 align-items-stretch">
          {/* Contact Info */}
          <div className="col-12 col-lg-4 d-flex">
            <div className="contact-card p-4 w-100">
              <h2 className="mini-title mb-3">Contact Information</h2>
              <p className="mini-text mb-4">
                Call, message, or visit us anytime. We usually respond quickly and guide you with the best available car.
              </p>

              <div className="d-flex align-items-start gap-3 mb-4">
                <div className="contact-icon">
                  <Phone size={20} />
                </div>
                <div>
                  <div className="contact-label">Phone</div>
                  <p className="contact-text">+92 3165040247</p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3 mb-4">
                <div className="contact-icon">
                  <Mail size={20} />
                </div>
                <div>
                  <div className="contact-label">Email</div>
                  <p className="contact-text">info@awanrent.com</p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3 mb-4">
                <div className="contact-icon">
                  <MapPin size={20} />
                </div>
                <div>
                  <div className="contact-label">Location</div>
                  <p className="contact-text">Islamabad, Pakistan</p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3">
                <div className="contact-icon">
                  <Clock3 size={20} />
                </div>
                <div>
                  <div className="contact-label">Working Hours</div>
                  <p className="contact-text">24/7 booking support available</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="col-12 col-lg-8 d-flex">
            <div className="form-card p-4 p-md-4 w-100">
              <h2 className="mini-title mb-3">Send Us a Message</h2>
              <p className="mini-text mb-4">
                Tell us your travel date, pickup point, and car requirement. We will reply with the best option.
              </p>

              <form>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-dark">Your Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-dark">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="03xx xxxxxxx"
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold text-dark">Subject</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Booking inquiry, airport pickup, out of city..."
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold text-dark">Message</label>
                    <textarea
                      className="form-control"
                      placeholder="Write your requirements here..."
                    ></textarea>
                  </div>

                  <div className="col-12 d-grid mt-1">
                    <button type="submit" className="btn send-btn">
                      <Send size={18} className="me-2" />
                      Send Message
                    </button>
                  </div>
                </div>
              </form>
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

export default Contact;