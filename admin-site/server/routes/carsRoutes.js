const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadCarImage");
const {
  getAllCars,
  getPublicCars,
  getSingleCar,
  createCar,
  updateCar,
  deleteCar,
} = require("../controllers/carsController");

router.get("/public", getPublicCars);
router.get("/public/:id", getSingleCar);

router.get("/", verifyToken, getAllCars);
router.post("/", verifyToken, upload.single("image"), createCar);
router.put("/:id", verifyToken, upload.single("image"), updateCar);
router.delete("/:id", verifyToken, deleteCar);

module.exports = router;