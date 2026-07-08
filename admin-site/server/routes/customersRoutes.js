const express = require("express");
const router = express.Router();

const {
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
} = require("../controllers/customersController");

const verifyCustomer = require("../middleware/customerAuth");
const verifyAdmin = require("../middleware/authMiddleware");


router.post("/register", registerCustomer);
router.post("/login", loginCustomer);
router.put("/password", verifyCustomer, changePassword);


router.get("/my-bookings", verifyCustomer, getMyBookings);
router.put("/my-bookings/:id", verifyCustomer, updateMyBooking);


router.get("/", verifyAdmin, getCustomers);
router.get("/:id", verifyAdmin, getCustomer);
router.post("/", verifyAdmin, createCustomer);
router.put("/:id", verifyAdmin, updateCustomer);
router.delete("/:id", verifyAdmin, deleteCustomer);


router.post("/public", createCustomer);

module.exports = router;