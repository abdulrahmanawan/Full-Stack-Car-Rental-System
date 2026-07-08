const express = require("express");
const router = express.Router();
const {
  getPayments,
  updatePaymentStatus,
  createMyPayment,
  getMyPayment,
} = require("../controllers/paymentController");

const verifyAdmin = require("../middleware/authMiddleware");
const verifyCustomer = require("../middleware/customerAuth");


router.get("/", verifyAdmin, getPayments);
router.patch("/:id/status", verifyAdmin, updatePaymentStatus);

router.post("/my", verifyCustomer, createMyPayment);
router.get("/booking/:bookingId", verifyCustomer, getMyPayment);

module.exports = router;