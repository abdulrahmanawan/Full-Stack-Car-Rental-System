import React from "react";
import { Link } from "react-router-dom";
import { FaCarSide } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row align-items-center justify-content-center">
          
          {/* Left Section */}
          <div className="col-lg-6 text-center text-lg-start mb-5 mb-lg-0">
            <span className="badge bg-warning text-dark px-3 py-2 mb-3">
              404 Error
            </span>

            <h1
              className="fw-bold display-3 mb-3"
              style={{ color: "#0B1F3A" }}
            >
              Oops!
            </h1>

            <h2 className="fw-bold mb-3">
              Page <span className="text-warning">Not Found</span>
            </h2>

            <p className="text-muted fs-5 mb-4">
              The page you're looking for doesn't exist or has been moved.
              Let's get you back on the road with Awan Rent A Car.
            </p>

            <Link
              to="/"
              className="btn btn-warning px-4 py-2 fw-semibold rounded-pill shadow-sm"
            >
              Back to Home
            </Link>
          </div>

          {/* Right Section */}
          <div className="col-lg-5 text-center">
            <div
              className="bg-white shadow-lg rounded-4 p-5"
              style={{ border: "1px solid #eee" }}
            >
              <FaCarSide
                size={90}
                className="text-warning mb-4"
              />

              <h1
                className="display-1 fw-bold"
                style={{ color: "#0B1F3A" }}
              >
                404
              </h1>

              <p className="text-muted">
                Sorry! We couldn't find the page you're looking for.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NotFound;