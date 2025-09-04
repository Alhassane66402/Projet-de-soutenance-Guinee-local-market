const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/auth");
const {
  getValidatedProducers,
  getProducerProfile,
  updateProducerProfile,
} = require("../Controllers/producerController");

// 🟢 Tous les producteurs validés (public)
router.get("/producers", authenticate(), getValidatedProducers);

// 🔒 Voir son propre profil producteur
router.get("/me", authenticate("producer"), getProducerProfile);

// ✏️ Mettre à jour son profil producteur
router.put("/me", authenticate("producer"), updateProducerProfile);

module.exports = router;
