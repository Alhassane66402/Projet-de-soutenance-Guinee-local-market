const express = require("express");
const router = express.Router();
const { authenticate, isAdmin } = require('../middlewares/auth');
const {
  createOrder,
  getOrders,
  getMyOrders,
  updateOrderStatus,
} = require("../Controllers/orderController");

// 🛒 Créer une commande (tout utilisateur connecté)
router.post("/", authenticate(), createOrder);

// 📋 Récupérer toutes les commandes
// - Admin : toutes les commandes
// - Producteur : commandes contenant au moins un de ses produits
// - Consommateur : uniquement ses commandes
router.get("/", authenticate(), getOrders);

// 👤 Voir uniquement les commandes de l'utilisateur connecté
router.get("/my-orders", authenticate(), getMyOrders);

// 🔧 Modifier le statut d'une commande
// - Admin : peut tout changer
// - Producteur : peut changer uniquement ses produits (pending/paid)
router.patch("/:id/status", authenticate(), updateOrderStatus);

module.exports = router;
