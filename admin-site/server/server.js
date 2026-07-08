require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const carsRoutes = require("./routes/carsRoutes");
const customersRoutes = require("./routes/customersRoutes");
const bookingsRoutes = require("./routes/bookingsRoutes");
const driverRoutes = require("./routes/driverRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

app.use(
  cors({
    origin: [
      "https://awanrentacar.vercel.app",
      "https://awancarrentalmanagement.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Car Rental API Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/cars", carsRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/payments", paymentRoutes);

module.exports = app;   