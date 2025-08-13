const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ 
        success: false, 
        message: "Access token missing" 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY); // make sure to use the same secret used during signing
    req.user = decoded; // attach user data to request
    next(); // pass to next middleware/route
  } catch (err) {
    return res.status(401).json({ 
        success: false, 
        message: "Invalid or expired access token" 
    });
  }
};

module.exports = authenticateUser;