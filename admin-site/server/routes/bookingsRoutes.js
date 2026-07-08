const express = require("express");
const router = express.Router();
const {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  updateBookingStatus,
  deleteBooking,
  updateRent,
  confirmByCustomer,
} = require("../controllers/bookingsController");

const verifyAdmin = require("../middleware/authMiddleware");
const verifyCustomer = require("../middleware/customerAuth");


router.post("/", createBooking);

router.get("/", verifyAdmin, getBookings);
router.get("/:id", verifyAdmin, getBooking);
router.put("/:id", verifyAdmin, updateBooking);
router.patch("/:id/status", verifyAdmin, updateBookingStatus);
router.put("/:id/rent", verifyAdmin, updateRent);
router.delete("/:id", verifyAdmin, deleteBooking);

router.patch("/:id/confirm", verifyCustomer, confirmByCustomer);

module.exports = router;