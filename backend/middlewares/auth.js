const jwt = require("jsonwebtoken");

/**
 * Middleware générique d’authentification
 * @param {string|null} role - Rôle requis (admin, producer, consumer) ou null pour tous
 */
function authenticate(role = null) {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token manquant" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ message: "Token expiré" });
        }
        return res.status(403).json({ message: "Token invalide" });
      }

      // Vérification du rôle si précisé
      if (role && decoded.role !== role) {
        return res.status(403).json({ message: "Accès interdit : rôle non autorisé" });
      }

      // ✅ On stocke l’utilisateur dans req.user
      req.user = { _id: decoded.id, role: decoded.role };
      next();
    });
  };
}

/**
 * Middleware spécifique pour vérifier que l'utilisateur est admin
 */
function isAdmin(req, res, next) {
  return authenticate("admin")(req, res, next);
}

module.exports = { authenticate, isAdmin };
