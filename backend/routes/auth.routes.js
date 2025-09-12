const express = require("express");
const router = express.Router();
const { register, login, getProfile, updateProfile, deleteConsumerAccount } = require("../Controllers/authController");
const { authenticate } = require("../middlewares/auth");
const { uploadUserImages } = require("../middlewares/upload");

// =============================
// 🔐 Auth routes
// =============================

// Inscription avec avatar et cover
router.post("/register", uploadUserImages, register);

// Connexion
router.post("/login", login);

// Récupérer son profil (nécessite token)
router.get("/me", authenticate(), getProfile);

// Modifier son profil (nécessite token)
router.put("/me", authenticate(), uploadUserImages, updateProfile);

// ❌ Supprimer son compte consommateur
router.delete("/me", authenticate("consumer"), deleteConsumerAccount);

// Déconnexion (optionnel)
router.post("/logout", (req, res) => {
  res.json({ message: "Déconnexion réussie, supprimez le token côté client." });
});

module.exports = router;
