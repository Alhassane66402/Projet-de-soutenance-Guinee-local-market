const express = require("express");
const router = express.Router();

// 🔹 Vérifie bien que ton dossier est en minuscule : ../controllers/authController
const { 
  register, 
  login, 
  getProfile, 
  updateProfile 
} = require("../Controllers/authController");

const { authenticate } = require("../middlewares/auth");

// =============================
// 🔐 Auth routes
// =============================

// Inscription
router.post("/register", register);

// Connexion
router.post("/login", login);

// Récupérer son profil (nécessite token)
router.get("/me", authenticate(), getProfile);

// Modifier son profil (nécessite token)
router.put("/me", authenticate(), updateProfile);

// 🔌 (Optionnel) Déconnexion : côté serveur on ne gère pas vraiment les JWT,
// mais ça peut aider côté client à avoir une route propre.
router.post("/logout", (req, res) => {
  res.json({ message: "Déconnexion réussie, supprimez le token côté client." });
});

module.exports = router;
