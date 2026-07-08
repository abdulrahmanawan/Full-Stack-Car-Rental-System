const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const registerCustomer = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    if (!name || !phone || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const [existing] = await pool.execute("SELECT id FROM customers WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const [result] = await pool.execute(
      "INSERT INTO customers (name, phone, email, password_hash) VALUES (?,?,?,?)",
      [name, phone, email, password_hash]
    );

    res.status(201).json({ id: result.insertId, message: "Registration successful." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const [rows] = await pool.execute("SELECT * FROM customers WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: "No account found with this email." });
    }

    const customer = rows[0];

    if (password) {
      if (!customer.password_hash) {
        return res.status(401).json({
          message: "You haven't set a password yet. Please login without password or register first.",
        });
      }
      const validPassword = await bcrypt.compare(password, customer.password_hash);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid password." });
      }
    } else {
      if (customer.password_hash) {
        return res.status(401).json({
          message: "This account has a password. Please enter your password to login.",
        });
      }
    }

    const token = jwt.sign(
      { id: customer.id, email: customer.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      customer: {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const changePassword = async (req, res) => {
  try {
    const customerId = req.customer.id;
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters." });
    }

    const [rows] = await pool.execute("SELECT * FROM customers WHERE id = ?", [customerId]);
    const customer = rows[0];

    if (customer.password_hash) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password is required." });
      }
      const valid = await bcrypt.compare(currentPassword, customer.password_hash);
      if (!valid) {
        return res.status(401).json({ message: "Current password is incorrect." });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    await pool.execute("UPDATE customers SET password_hash = ? WHERE id = ?", [newHash, customerId]);

    res.json({ message: "Password updated successfully." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const createCustomer = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;
    if (!name || !phone || !email) {
      return res.status(400).json({ message: "Name, phone and email are required." });
    }

    let password_hash = null;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      password_hash = await bcrypt.hash(password, salt);
    }

    const [existing] = await pool.execute(
      "SELECT id FROM customers WHERE phone = ? OR email = ?",
      [phone, email]
    );

    if (existing.length > 0) {
      const [cust] = await pool.execute("SELECT * FROM customers WHERE id = ?", [existing[0].id]);
      return res.json(cust[0]);
    }

    const [result] = await pool.execute(
      "INSERT INTO customers (name, phone, email, password_hash) VALUES (?,?,?,?)",
      [name, phone, email, password_hash]
    );

    const [newCustomer] = await pool.execute("SELECT * FROM customers WHERE id = ?", [result.insertId]);
    res.status(201).json(newCustomer[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const getCustomers = async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT id, name, phone, email, created_at FROM customers ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const getCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute("SELECT * FROM customers WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, email, password } = req.body;

    const [customer] = await pool.execute("SELECT * FROM customers WHERE id = ?", [id]);
    if (customer.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    let password_hash = customer[0].password_hash;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      password_hash = await bcrypt.hash(password, salt);
    }

    await pool.execute(
      "UPDATE customers SET name = ?, phone = ?, email = ?, password_hash = ? WHERE id = ?",
      [
        name || customer[0].name,
        phone || customer[0].phone,
        email || customer[0].email,
        password_hash,
        id,
      ]
    );

    res.json({ message: "Customer updated successfully." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const [customer] = await pool.execute("SELECT * FROM customers WHERE id = ?", [id]);
    if (customer.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    await pool.execute("DELETE FROM customers WHERE id = ?", [id]);
    res.json({ message: "Customer deleted successfully." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const customerId = req.customer.id;

    const [rows] = await pool.execute(`
      SELECT
        b.id,
        b.trip_type,
        b.pickup_location,
        b.drop_location,
        DATE_FORMAT(b.booking_date, '%Y-%m-%d') AS booking_date,
        b.booking_time,
        b.passengers,
        b.rent,
        b.customer_confirmed,
        b.message,
        b.status,
        b.created_at,
        cars.name AS car_name,
        cars.image_url AS car_image,
        d.name AS driver_name,
        d.phone AS driver_phone
      FROM bookings b
      LEFT JOIN cars ON b.car_id = cars.id
      LEFT JOIN drivers d ON b.driver_id = d.id
      WHERE b.customer_id = ?
      ORDER BY b.id DESC
    `, [customerId]);

    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateMyBooking = async (req, res) => {
  try {
    const customerId = req.customer.id;
    const { id } = req.params;
    const { trip_type, pickup_location, drop_location, booking_date, booking_time, passengers, message } = req.body;

    const [booking] = await pool.execute(
      "SELECT * FROM bookings WHERE id = ? AND customer_id = ?",
      [id, customerId]
    );
    if (booking.length === 0) {
      return res.status(404).json({ message: "Booking not found or access denied." });
    }

    const carId = booking[0].car_id;
    const currentStatus = booking[0].status;

    if (["Confirmed", "Completed", "Cancelled"].includes(currentStatus)) {
      return res.status(403).json({ message: "You cannot edit a confirmed, completed, or cancelled booking." });
    }

    if (booking_date !== booking[0].booking_date) {
      const [overlap] = await pool.execute(
        `SELECT id FROM bookings WHERE car_id = ? AND booking_date = ? AND status = 'Confirmed' AND id != ?`,
        [carId, booking_date, id]
      );
      if (overlap.length > 0) {
        return res.status(409).json({ message: "This car is already booked on this date. Please choose a different date." });
      }
    }

    await pool.execute(
      `UPDATE bookings SET
        trip_type = ?, pickup_location = ?, drop_location = ?,
        booking_date = ?, booking_time = ?, passengers = ?, message = ?
      WHERE id = ?`,
      [trip_type, pickup_location, drop_location, booking_date, booking_time, passengers, message || "", id]
    );

    res.json({ message: "Booking updated." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  registerCustomer,
  loginCustomer,
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  getMyBookings,
  updateMyBooking,
  changePassword,
};
