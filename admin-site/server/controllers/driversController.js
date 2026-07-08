const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
require("dotenv").config();


const getDrivers = async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT id, name, phone, whatsapp, email, invite_token, created_at FROM drivers ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const createDriver = async (req, res) => {
  try {
    const { name, phone, whatsapp, email } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ message: "Name and phone are required." });
    }

    const inviteToken = crypto.randomBytes(20).toString("hex");

    const [result] = await pool.execute(
      "INSERT INTO drivers (name, phone, whatsapp, email, invite_token) VALUES (?,?,?,?,?)",
      [name, phone, whatsapp || null, email || null, inviteToken]
    );

    
    const adminBaseUrl = process.env.ADMIN_CLIENT_URL || "http://localhost:5174";
    const inviteLink = `${adminBaseUrl}/driver/invite?token=${inviteToken}`;

    res.status(201).json({
      id: result.insertId,
      name,
      phone,
      inviteLink,
      message: "Driver created. Share the invite link with the driver.",
    });
  } catch (err) {
    
  }
};

const updateDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, whatsapp, email } = req.body;

    const [driver] = await pool.execute("SELECT * FROM drivers WHERE id = ?", [id]);
    if (driver.length === 0) {
      return res.status(404).json({ message: "Driver not found" });
    }

    await pool.execute(
      "UPDATE drivers SET name = ?, phone = ?, whatsapp = ?, email = ? WHERE id = ?",
      [
        name || driver[0].name,
        phone || driver[0].phone,
        whatsapp !== undefined ? whatsapp : driver[0].whatsapp,
        email !== undefined ? email : driver[0].email,
        id,
      ]
    );

    res.json({ message: "Driver updated." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const [driver] = await pool.execute("SELECT * FROM drivers WHERE id = ?", [id]);
    if (driver.length === 0) {
      return res.status(404).json({ message: "Driver not found" });
    }

    await pool.execute("DELETE FROM drivers WHERE id = ?", [id]);
    res.json({ message: "Driver deleted." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};


const setupPassword = async (req, res) => {
  try {
    const { token, phone, email, password } = req.body;

    if (!token || !password || password.length < 6) {
      return res.status(400).json({ message: "Invite token and password (min 6 chars) are required." });
    }

    const [drivers] = await pool.execute("SELECT * FROM drivers WHERE invite_token = ?", [token]);
    if (drivers.length === 0) {
      return res.status(404).json({ message: "Invalid or expired invite link." });
    }

    const driver = drivers[0];
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    
    await pool.execute(
      "UPDATE drivers SET password_hash = ?, email = ?, phone = ?, invite_token = NULL WHERE id = ?",
      [password_hash, email || driver.email, phone || driver.phone, driver.id]
    );

    res.json({ message: "Password set successfully. You can now login." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const loginDriver = async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) {
      return res.status(400).json({ message: "Phone and password are required." });
    }

    const [rows] = await pool.execute("SELECT * FROM drivers WHERE phone = ?", [phone]);
    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const driver = rows[0];
    if (!driver.password_hash) {
      return res.status(401).json({ message: "Password not set. Use your invite link first." });
    }

    const valid = await bcrypt.compare(password, driver.password_hash);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: driver.id, phone: driver.phone },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      driver: {
        id: driver.id,
        name: driver.name,
        phone: driver.phone,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};


const getDriverBookings = async (req, res) => {
  try {
    const driverId = req.driver.id;

    const [rows] = await pool.execute(`
      SELECT
        b.id,
        b.trip_type,
        b.pickup_location,
        b.drop_location,
        DATE_FORMAT(b.booking_date, '%Y-%m-%d') AS booking_date,
        b.booking_time,
        b.passengers,
        b.message,
        b.status,
        b.created_at,
        c.name AS customer_name,
        c.phone AS customer_phone,
        cars.name AS car_name,
        cars.image_url AS car_image
      FROM bookings b
      JOIN customers c ON b.customer_id = c.id
      LEFT JOIN cars ON b.car_id = cars.id
      WHERE b.driver_id = ?
      ORDER BY b.id DESC
    `, [driverId]);

    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};


const assignDriver = async (req, res) => {
  try {
    const { bookingId, driverId } = req.body;

    if (!bookingId || !driverId) {
      return res.status(400).json({ message: "Booking ID and Driver ID are required." });
    }

    const [booking] = await pool.execute("SELECT * FROM bookings WHERE id = ?", [bookingId]);
    if (booking.length === 0) {
      return res.status(404).json({ message: "Booking not found." });
    }
    if (booking[0].status !== "Confirmed") {
      return res.status(400).json({ message: "Only confirmed bookings can be assigned." });
    }

    await pool.execute("UPDATE bookings SET driver_id = ? WHERE id = ?", [driverId, bookingId]);
    res.json({ message: "Driver assigned successfully." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getDrivers,
  createDriver,
  updateDriver,
  deleteDriver,
  setupPassword,
  loginDriver,
  getDriverBookings,
  assignDriver,
};