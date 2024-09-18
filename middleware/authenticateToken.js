const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; //e bejme split me nje space sepse ka hapsire midis bearer dhe token
  //dhe shtojme [1] spese duam parametrin e 2 ne array , qe dmth eshte tokeni 

  console.log("Token:", token);

  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = verified; 
    next(); 
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = authenticateToken;
