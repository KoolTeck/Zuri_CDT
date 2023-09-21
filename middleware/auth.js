const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  // validate token
  if (!token) {
    res.status(403).json({ error: "A token is required for Authentication" });
  } else {
    try {
      const decodedToken = jwt.verify(token, JWT_SECRET);
      req.user = decodedToken;
      return next();
    } catch (error) {
      res
        .status(401)
        .json({ error: "Invalid token supplied, login to get a new token" });
    }
  }
};

module.exports = verifyToken;
