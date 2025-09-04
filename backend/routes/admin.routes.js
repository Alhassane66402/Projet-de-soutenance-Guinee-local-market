const express = require("express");
const router = express.Router();
const { authenticate, isAdmin } = require("../middlewares/auth");
const { getAllProducers, validateProducer, getPendingProducers } = require("../Controllers/adminController");
const User = require("../models/User"); // <-- à ajouter si tu utilises User directement

// ✅ Route : Récupérer les producteurs en attente de validation
router.get("/pending-producers", authenticate("admin"), getPendingProducers);

// ✅ Route : Valider un producteur (admin uniquement)
router.put("/validate-producer/:id", authenticate("admin"), validateProducer);

// ✅ Route : Voir tous les producteurs (admin uniquement)
router.get("/producers", isAdmin, getAllProducers);

module.exports = router;
