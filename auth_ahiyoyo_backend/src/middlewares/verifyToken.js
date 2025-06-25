const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

// Middleware pour vérifier le token JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ message: "Token d'accès requis." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error("❌ Erreur vérification token :", error);
    return res.status(401).json({ message: "Token invalide." });
  }
};

module.exports = { verifyToken };