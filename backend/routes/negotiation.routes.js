const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/auth");
const { createNegotiation, sendMessage, confirmAgreement, getNegotiations } = require("../controllers/negotiationController");

// 🔹 Démarrer une négociation
router.post(
  "/", // La route est maintenant simplement "/"
  authenticate(),
  createNegotiation
);

// 🔹 Envoyer un message dans une négociation
router.post(
  "/:negotiationId/message",
  authenticate(),
  sendMessage
);

// 🔹 Confirmer l'accord (prix + quantité) par le producteur
router.post(
  "/:negotiationId/confirm",
  authenticate("producer"),
  confirmAgreement
);

// 🔹 Récupérer toutes mes négociations selon le rôle
router.get(
  "/me",
  authenticate(),
  getNegotiations
);

module.exports = router;
