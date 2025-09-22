const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/auth");
const {
  getAllProducers,
  validateProducer,
  getPendingProducers,
  getAllUsers, // ✅ importer la nouvelle fonction
  getUserDetail,
  blockUser,
  deleteProducer,
  validateProduct,
  refuseProduct,
  getAllProducts,
  deleteRefusedProduct
} = require("../controllers/adminController");

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

// Récupérer le détail d'un utilisateur
router.get("/users/:id", authenticate("admin"), getUserDetail);

// Bloquer / Débloquer un utilisateur
router.put("/users/:id/block", authenticate("admin") ,blockUser);

// Bloquer / Débloquer un utilisateur
router.delete('/delete-producer/:id', authenticate("admin"), deleteProducer);

//  Récupérer tous les produits
router.get("/products", authenticate("admin"), getAllProducts);

//  Validation des produits
router.put("/validate-product/:id", authenticate("admin"), validateProduct);

//  Refus des produits
router.put("/refuse-product/:id", authenticate("admin"), refuseProduct);

// 🔹 Supprimer un produit refusé
router.delete("/delete-product/:id", authenticate("admin"), deleteRefusedProduct);

module.exports = router;
