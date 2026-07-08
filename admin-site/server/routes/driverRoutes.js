const express = require("express");
const router = express.Router();
const {
  getDrivers,
  createDriver,
  updateDriver,
  deleteDriver,
  setupPassword,
  loginDriver,
  getDriverBookings,
  assignDriver,
} = require("../controllers/driversController");

const verifyAdmin = require("../middleware/authMiddleware");
const verifyDriver = require("../middleware/driverAuth");

router.get("/", verifyAdmin, getDrivers);
router.post("/", verifyAdmin, createDriver);
router.put("/:id", verifyAdmin, updateDriver);
router.delete("/:id", verifyAdmin, deleteDriver);
router.post("/assign", verifyAdmin, assignDriver);   

router.post("/setup-password", setupPassword);
router.post("/login", loginDriver);

router.get("/bookings", verifyDriver, getDriverBookings);

module.exports = router;