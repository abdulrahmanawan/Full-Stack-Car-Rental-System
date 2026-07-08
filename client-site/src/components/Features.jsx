import React from "react";
import {
  Shield,
  Clock4,
  CreditCard,
  MapPin,
  Headphones,
  FileBadge,
  Users,
  Zap,
  BadgeCheck,
} from "lucide-react";

const features = [
  {
    title: "Fully Insured",
    description:
      "All our vehicles are properly maintained and insured for a safer, stress-free travel experience.",
    icon: <Shield size={24} />,
  },
  {
    title: "24/7 Service",
    description:
      "We are available day and night for bookings, support, and urgent travel requirements.",
    icon: <Clock4 size={24} />,
  },
  {
    title: "Easy Payment",
    description:
      "Simple payment options with smooth confirmation for a fast and easy booking process.",
    icon: <CreditCard size={24} />,
  },
  {
    title: "Multiple Locations",
    description:
      "Pickup and drop service available in Islamabad, Rawalpindi, airport routes, and nearby areas.",
    icon: <MapPin size={24} />,
  },
  {
    title: "Expert Support",
    description:
      "Our team helps you choose the right car, package, and travel option based on your needs.",
    icon: <Headphones size={24} />,
  },
  {
    title: "Premium Quality",
    description:
      "Well-cleaned cars, professional drivers, and dependable service for every journey.",
    icon: <FileBadge size={24} />,
  },
  {
    title: "Trusted by Customers",
    description:
      "A reliable service built around family travel, airport transfers, and out-of-city bookings.",
    icon: <Users size={24} />,
  },
  {
    title: "Instant Booking",
    description:
      "Send your request quickly and get fast confirmation without a complicated process.",
    icon: <Zap size={24} />,
  },
];

const Features = () => {
  return (
    <section style={styles.section}>
      <style>{`
        .features-wrap {
          width: min(1160px, calc(100% - 28px));
          margin: 0 auto;
          padding: 48px 0;
        }

        .features-title {
          font-size: clamp(1.7rem, 3vw, 2.5rem);
          line-height: 1.12;
          letter-spacing: -0.03em;
        }

        .features-subtitle {
          max-width: 700px;
          margin: 0 auto;
          color: #64748b;
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

        .feature-card {
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.08);
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
          transition: all 0.25s ease;
          height: 100%;
          border-radius: 22px;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 34px rgba(15, 23, 42, 0.10);
        }

        .feature-icon-wrap {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0d6efd, #2563eb);
          color: #ffffff;
          box-shadow: 0 12px 22px rgba(13, 110, 253, 0.18);
          margin-bottom: 14px;
        }

        .feature-card-title {
          font-size: 1rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .feature-card-text {
          color: #64748b;
          font-size: 0.92rem;
          line-height: 1.65;
          margin-bottom: 0;
        }

        @media (max-width: 575.98px) {
          .features-wrap {
            width: min(1160px, calc(100% - 20px));
            padding: 40px 0;
          }

          .feature-card {
            padding: 18px !important;
          }

          .feature-icon-wrap {
            width: 52px;
            height: 52px;
            border-radius: 15px;
          }
        }
      `}</style>

      <div className="features-wrap">
        <div className="text-center mb-4 mb-lg-5">
          <span className="section-pill mb-3">
            <BadgeCheck size={16} />
            Why Choose Us
          </span>
          <h2 className="features-title fw-bold text-dark mb-3">
            Why Customers Trust Awan RAC
          </h2>
          <p className="features-subtitle mb-0">
            We focus on clean cars, reliable drivers, simple booking, and a smooth travel experience for every customer.
          </p>
        </div>

        <div className="row g-3 g-md-4">
          {features.map((feature, index) => (
            <div key={index} className="col-12 col-sm-6 col-lg-3">
              <div className="feature-card p-3 p-md-4 text-center">
                <div className="feature-icon-wrap">{feature.icon}</div>
                <h3 className="feature-card-title">{feature.title}</h3>
                <p className="feature-card-text">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: {
    background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
  },
};

export default Features;