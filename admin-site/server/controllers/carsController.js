const fs = require("fs");
const path = require("path");
const pool = require("../config/db");

const removeOldImage = (imageUrl) => {
  if (!imageUrl) return;
  if (imageUrl.startsWith("http")) return;
  const fullPath = path.join(
    __dirname,
    "..",
    imageUrl.replace("/uploads", "uploads")
  );
  if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
};

const parseBadges = (badges) => {
  if (!badges) return [];
  if (Array.isArray(badges)) return badges;
  if (typeof badges === "string") {
    try {
      const parsed = JSON.parse(badges);
      if (Array.isArray(parsed)) return parsed;
    } catch (err) {
      return badges
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }
  return [];
};

const mapCarRow = (row) => {
  return {
    ...row,
    type: row.car_type,
    badges: parseBadges(row.badges),
  };
};

const getAllCars = async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM cars ORDER BY id DESC");
    res.json(rows.map(mapCarRow));
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getPublicCars = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM cars WHERE status = 'available' ORDER BY id DESC"
    );
    res.json(rows.map(mapCarRow));
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getSingleCar = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      "SELECT * FROM cars WHERE id = ? LIMIT 1",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.json(mapCarRow(rows[0]));
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createCar = async (req, res) => {
  try {
    const {
      name,
      brand,
      model,
      year,
      location,
      type,
      car_type,
      seats,
      transmission,
      fuel_type,
      daily_price,
      weekly_price,
      rating,
      status,
      featured,
      badges,
      description,
      image_url,
    } = req.body;

    let finalImage = null;
    if (image_url && image_url.trim() !== "") {
      finalImage = image_url.trim();
    } else if (req.file) {
      finalImage = `/uploads/cars/${req.file.filename}`;
    }

    const carType = type || car_type || "Sedan";
    const badgesValue = JSON.stringify(parseBadges(badges));
    const finalRating = rating ? Number(rating) : 4.5;

    const [result] = await pool.execute(
      `INSERT INTO cars
      (name, brand, model, year, location, car_type, seats, transmission, fuel_type, daily_price, weekly_price, rating, status, featured, badges, description, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        brand,
        model,
        year,
        location || "Islamabad",
        carType,
        seats || 5,
        transmission || "Automatic",
        fuel_type || "Petrol",
        daily_price,
        weekly_price || null,
        finalRating,
        status || "available",
        ["1", 1, true, "true"].includes(featured) ? 1 : 0,
        badgesValue,
        description || null,
        finalImage,
      ]
    );

    const [rows] = await pool.execute("SELECT * FROM cars WHERE id = ?", [
      result.insertId,
    ]);

    res.status(201).json({
      message: "Car created successfully",
      car: mapCarRow(rows[0]),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    const [existingRows] = await pool.execute(
      "SELECT * FROM cars WHERE id = ?",
      [id]
    );
    if (existingRows.length === 0) {
      return res.status(404).json({ message: "Car not found" });
    }
    const existingCar = existingRows[0];

    const {
      name,
      brand,
      model,
      year,
      location,
      type,
      car_type,
      seats,
      transmission,
      fuel_type,
      daily_price,
      weekly_price,
      rating,
      status,
      featured,
      badges,
      description,
      image_url,
    } = req.body;

    let finalImage = existingCar.image_url;
    if (image_url !== undefined && image_url !== null) {
      if (image_url.trim() !== "") {
        if (existingCar.image_url && !existingCar.image_url.startsWith("http")) {
          removeOldImage(existingCar.image_url);
        }
        finalImage = image_url.trim();
      } else {
        if (existingCar.image_url && !existingCar.image_url.startsWith("http")) {
          removeOldImage(existingCar.image_url);
        }
        finalImage = null;
      }
    } else if (req.file) {
      if (existingCar.image_url && !existingCar.image_url.startsWith("http")) {
        removeOldImage(existingCar.image_url);
      }
      finalImage = `/uploads/cars/${req.file.filename}`;
    }

    const carType = type || car_type || "Sedan";
    const badgesValue = JSON.stringify(parseBadges(badges));
    const finalRating = rating ? Number(rating) : 4.5;

    await pool.execute(
      `UPDATE cars SET
        name = ?, brand = ?, model = ?, year = ?, location = ?, car_type = ?, seats = ?,
        transmission = ?, fuel_type = ?, daily_price = ?, weekly_price = ?, rating = ?,
        status = ?, featured = ?, badges = ?, description = ?, image_url = ?
      WHERE id = ?`,
      [
        name,
        brand,
        model,
        year,
        location || "Islamabad",
        carType,
        seats || 5,
        transmission || "Automatic",
        fuel_type || "Petrol",
        daily_price,
        weekly_price || null,
        finalRating,
        status || "available",
        ["1", 1, true, "true"].includes(featured) ? 1 : 0,
        badgesValue,
        description || null,
        finalImage,
        id,
      ]
    );

    const [updatedRows] = await pool.execute(
      "SELECT * FROM cars WHERE id = ?",
      [id]
    );

    res.json({
      message: "Car updated successfully",
      car: mapCarRow(updatedRows[0]),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteCar = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute("SELECT * FROM cars WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Car not found" });
    }
    removeOldImage(rows[0].image_url);
    await pool.execute("DELETE FROM cars WHERE id = ?", [id]);
    res.json({ message: "Car deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getAllCars,
  getPublicCars,
  getSingleCar,
  createCar,
  updateCar,
  deleteCar,
};