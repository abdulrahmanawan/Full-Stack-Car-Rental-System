const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");


const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const [rows] = await pool.execute(
      "SELECT * FROM admins WHERE email = ? LIMIT 1",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const admin = rows[0];

    if (admin.status !== "active") {
      return res.status(403).json({ message: "Account is blocked" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login successful",
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


const loginDriver = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: "Phone and password are required" });
    }

    const [rows] = await pool.execute(
      "SELECT * FROM drivers WHERE phone = ? LIMIT 1",
      [phone]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const driver = rows[0];

    if (!driver.password_hash) {
      return res.status(401).json({ message: "Password not set yet. Use your invite link to set a password." });
    }

    const isMatch = await bcrypt.compare(password, driver.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: driver.id,
        name: driver.name,
        phone: driver.phone,
        role: "driver",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login successful",
      token,
      driver: {
        id: driver.id,
        name: driver.name,
        phone: driver.phone,
        role: "driver",
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


const getMe = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT id, name, email, role, status, created_at FROM admins WHERE id = ? LIMIT 1",
      [req.admin.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  loginAdmin,
  loginDriver,
  getMe,
};