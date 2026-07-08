const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyCustomer = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Access denied." });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.customer = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token." });
  }
};

module.exports = verifyCustomer;