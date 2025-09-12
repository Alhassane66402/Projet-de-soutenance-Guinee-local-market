const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/auth");
const {
  getValidatedProducers,
  getProducerById,
  getProducerProfile,
  updateProducerProfile,
  deleteProducerProfile,
} = require("../controllers/producerController");

// ============================
// Routes producteur
// ============================

// 🟢 Obtenir tous les producteurs validés (PUBLIC)
router.get("/", getValidatedProducers);

// 🔒 Obtenir son propre profil (AUTH "producer")
router.get("/me", authenticate("producer"), getProducerProfile);

// ✏️ Mettre à jour son profil producteur (AUTH "producer")
router.put("/me", authenticate("producer"), updateProducerProfile);

// ❌ Supprimer son compte producteur
router.delete("/me", authenticate("producer"), deleteProducerProfile);

// 🔍 Obtenir un producteur validé par ID (PUBLIC)
router.get("/:id", getProducerById);

module.exports = router;
