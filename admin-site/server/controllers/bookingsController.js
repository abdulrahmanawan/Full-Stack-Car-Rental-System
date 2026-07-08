const pool = require("../config/db");

const getBookings = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT
        b.id,
        b.customer_id,
        c.name AS customer_name,
        c.phone,
        b.car_id,
        cars.name AS car_name,
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
        d.name AS driver_name,
        d.phone AS driver_phone
      FROM bookings b
      LEFT JOIN customers c ON b.customer_id = c.id
      LEFT JOIN cars ON b.car_id = cars.id
      LEFT JOIN drivers d ON b.driver_id = d.id
      ORDER BY b.id DESC
    `);
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const getBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(`
      SELECT
        b.id,
        b.customer_id,
        c.name AS customer_name,
        c.phone,
        b.car_id,
        cars.name AS car_name,
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
        d.name AS driver_name,
        d.phone AS driver_phone
      FROM bookings b
      LEFT JOIN customers c ON b.customer_id = c.id
      LEFT JOIN cars ON b.car_id = cars.id
      LEFT JOIN drivers d ON b.driver_id = d.id
      WHERE b.id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const checkDateOverlap = async (carId, date, excludeBookingId = null) => {
  let query = `SELECT id FROM bookings WHERE car_id = ? AND booking_date = ? AND status = 'Confirmed'`;
  const params = [carId, date];
  if (excludeBookingId) {
    query += ` AND id != ?`;
    params.push(excludeBookingId);
  }
  const [rows] = await pool.execute(query, params);
  return rows.length > 0;
};

const createBooking = async (req, res) => {
  try {
    const {
      customer_id, car_id, trip_type, pickup_location, drop_location,
      booking_date, booking_time, passengers, message,
    } = req.body;

    if (!customer_id || !car_id || !trip_type || !pickup_location || !drop_location || !booking_date || !booking_time || !passengers) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    const today = new Date().toISOString().split('T')[0];
    if (booking_date < today) {
      return res.status(400).json({ message: "You cannot book a past date." });
    }

    const overlap = await checkDateOverlap(car_id, booking_date);
    if (overlap) {
      return res.status(409).json({ message: "This car is already booked on this date. Please choose a different date." });
    }

    const [result] = await pool.execute(
      `INSERT INTO bookings (customer_id, car_id, trip_type, pickup_location, drop_location, booking_date, booking_time, passengers, message)
      VALUES (?,?,?,?,?,?,?,?,?)`,
      [customer_id, car_id, trip_type, pickup_location, drop_location, booking_date, booking_time, passengers, message || ""]
    );

    res.status(201).json({ id: result.insertId, message: "Booking created successfully." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateBooking = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const { id } = req.params;
    const {
      customer_id, car_id, trip_type, pickup_location, drop_location,
      booking_date, booking_time, passengers, message, status,
    } = req.body;

    const [currentBooking] = await connection.execute("SELECT * FROM bookings WHERE id=?", [id]);
    if (currentBooking.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Booking not found" });
    }

    if (status === 'Confirmed') {
      const overlap = await checkDateOverlap(car_id, booking_date, id);
      if (overlap) {
        await connection.rollback();
        return res.status(409).json({ message: "This car is already booked on this date. Choose a different date." });
      }
    }

    await connection.execute(
      `UPDATE bookings SET
        customer_id=?, car_id=?, trip_type=?, pickup_location=?, drop_location=?,
        booking_date=?, booking_time=?, passengers=?, message=?, status=?
      WHERE id=?`,
      [customer_id, car_id, trip_type, pickup_location, drop_location, booking_date, booking_time, passengers, message || "", status, id]
    );

    await connection.commit();
    res.json({ message: "Booking updated successfully." });
  } catch (err) {
    await connection.rollback();
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  } finally {
    connection.release();
  }
};

const updateBookingStatus = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = ["Pending", "Confirmed", "Completed", "Cancelled"];
    if (!allowedStatus.includes(status)) {
      await connection.rollback();
      return res.status(400).json({ message: "Invalid status" });
    }

    const [booking] = await connection.execute("SELECT * FROM bookings WHERE id=?", [id]);
    if (booking.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Booking not found" });
    }

    const current = booking[0];
    const carId = current.car_id;
    const bookingDate = current.booking_date;

    if (status === 'Confirmed') {
      if (!current.customer_confirmed) {
        await connection.rollback();
        return res.status(400).json({ message: "Customer has not confirmed the booking yet." });
      }
      const overlap = await checkDateOverlap(carId, bookingDate, id);
      if (overlap) {
        await connection.rollback();
        return res.status(409).json({ message: "This car is already booked on this date." });
      }
    }

    await connection.execute("UPDATE bookings SET status=? WHERE id=?", [status, id]);

    await connection.commit();
    res.json({ message: "Booking status updated successfully." });
  } catch (err) {
    await connection.rollback();
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  } finally {
    connection.release();
  }
};

const deleteBooking = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const { id } = req.params;

    const [booking] = await connection.execute("SELECT * FROM bookings WHERE id=?", [id]);
    if (booking.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Booking not found" });
    }

    await connection.execute("DELETE FROM bookings WHERE id=?", [id]);

    await connection.commit();
    res.json({ message: "Booking deleted successfully." });
  } catch (err) {
    await connection.rollback();
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  } finally {
    connection.release();
  }
};

const updateRent = async (req, res) => {
  try {
    const { id } = req.params;
    const { rent } = req.body;

    if (rent === undefined || rent === null || isNaN(rent) || Number(rent) < 0) {
      return res.status(400).json({ message: "Valid rent amount is required." });
    }

    const [booking] = await pool.execute("SELECT * FROM bookings WHERE id = ?", [id]);
    if (booking.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    await pool.execute("UPDATE bookings SET rent = ? WHERE id = ?", [Number(rent), id]);
    res.json({ message: "Rent updated successfully." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const confirmByCustomer = async (req, res) => {
  try {
    const customerId = req.customer.id;
    const { id } = req.params;

    const [booking] = await pool.execute("SELECT * FROM bookings WHERE id = ? AND customer_id = ?", [id, customerId]);
    if (booking.length === 0) {
      return res.status(404).json({ message: "Booking not found or access denied." });
    }

    if (booking[0].customer_confirmed) {
      return res.status(400).json({ message: "Booking already confirmed by you." });
    }

    await pool.execute("UPDATE bookings SET customer_confirmed = 1 WHERE id = ?", [id]);
    res.json({ message: "Booking confirmed successfully." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  updateBookingStatus,
  deleteBooking,
  updateRent,
  confirmByCustomer,
};