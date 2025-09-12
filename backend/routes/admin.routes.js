const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/auth");
const {
  getAllProducers,
  validateProducer,
  getPendingProducers,
  getAllUsers // ✅ importer la nouvelle fonction
} = require("../Controllers/adminController");

// ============================
// Routes Admin
// ============================

// 🔹 Récupérer tous les producteurs en attente de validation
router.get("/pending-producers", authenticate("admin"), getPendingProducers);

// 🔹 Valider un producteur par ID
router.put("/validate-producer/:id", authenticate("admin"), validateProducer);

// 🔹 Récupérer tous les producteurs
router.get("/producers", authenticate("admin"), getAllProducers);

// 🔹 Récupérer tous les utilisateurs (producteurs + consommateurs)
router.get("/users", authenticate("admin"), getAllUsers);

module.exports = router;
