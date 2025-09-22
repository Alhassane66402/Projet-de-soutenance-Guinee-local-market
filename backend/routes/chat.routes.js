const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/auth");
const chatController = require("../controllers/chatController");

// =============================
// 🔹 Routes Chat
// =============================

// 1. Créer ou récupérer un chat entre client et producteur pour un produit
router.post("/:productId", authenticate(), chatController.createOrGetChat);

// 2. Envoyer un message dans un chat
router.post("/:chatId/messages", authenticate(), chatController.sendMessage);

// 3. Récupérer l’historique des messages d’un chat
router.get("/:chatId/messages", authenticate(), chatController.getMessages);

module.exports = router;
