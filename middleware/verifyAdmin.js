const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

module.exports = { verifyAdmin };
