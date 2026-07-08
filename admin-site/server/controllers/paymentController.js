const pool = require("../config/db");

const getPayments = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT p.*, b.customer_name, b.car_name, b.booking_date
      FROM payments p
      JOIN (
        SELECT b.id, c.name AS customer_name, cars.name AS car_name, b.booking_date
        FROM bookings b
        JOIN customers c ON b.customer_id = c.id
        JOIN cars ON b.car_id = cars.id
      ) b ON p.booking_id = b.id
      ORDER BY p.id DESC
    `);
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const allowed = ["pending", "completed", "failed"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const [payment] = await pool.execute("SELECT * FROM payments WHERE id=?", [id]);
    if (payment.length === 0) {
      return res.status(404).json({ message: "Payment not found" });
    }

    const paidAt = status === "completed" ? new Date() : null;

    await pool.execute(
      "UPDATE payments SET status=?, note=?, paid_at=? WHERE id=?",
      [status, note || null, paidAt, id]
    );

    res.json({ message: "Payment status updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

const createMyPayment = async (req, res) => {
  try {
    const customerId = req.customer.id;
    const { bookingId, method } = req.body;

    if (!bookingId || !method) {
      return res.status(400).json({ message: "Booking ID and method are required" });
    }

    if (!["easypaisa", "cash"].includes(method)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    const [booking] = await pool.execute(
      "SELECT * FROM bookings WHERE id = ? AND customer_id = ?",
      [bookingId, customerId]
    );

    if (booking.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (!booking[0].rent) {
      return res.status(400).json({ message: "Rent not yet set by admin" });
    }

    const [existing] = await pool.execute(
      "SELECT id FROM payments WHERE booking_id = ?",
      [bookingId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Payment already exists for this booking" });
    }

    await pool.execute(
      "INSERT INTO payments (booking_id, amount, method) VALUES (?, ?, ?)",
      [bookingId, booking[0].rent, method]
    );

    res.status(201).json({ message: "Payment initiated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getMyPayment = async (req, res) => {
  try {
    const customerId = req.customer.id;
    const { bookingId } = req.params;

    const [rows] = await pool.execute(
      `SELECT p.* FROM payments p
       JOIN bookings b ON p.booking_id = b.id
       WHERE b.id = ? AND b.customer_id = ?`,
      [bookingId, customerId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getPayments,
  updatePaymentStatus,
  createMyPayment,
  getMyPayment,
};