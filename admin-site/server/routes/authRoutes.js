const express = require("express");
const { loginAdmin, loginDriver, getMe } = require("../controllers/authController");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();


router.post("/login", loginAdmin);
router.get("/me", verifyToken, getMe);

router.post("/driver/login", loginDriver);

module.exports = router;