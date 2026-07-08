require("dotenv").config();
const bcrypt = require("bcryptjs");
const pool = require("./config/db");

const createAdmin = async () => {
  try {
    const name = "Super Admin";
    const email = "admin@example.com";
    const plainPassword = "123456";
    const role = "superadmin";

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const [result] = await pool.execute(
      "INSERT INTO admins (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role]
    );

    console.log("Admin created:", result.insertId);
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
};

createAdmin();