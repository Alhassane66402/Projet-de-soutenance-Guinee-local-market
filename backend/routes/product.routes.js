// src/routes/product.routes.js
const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/auth");
const { uploadProductImage } = require("../middlewares/upload");
const productController = require("../controllers/productController");

// =============================
// 🔹 Routes Produits
// =============================

// Créer un produit (avec upload image)
router.post(
  "/",
  authenticate("producer"),
  uploadProductImage,
  productController.createProduct
);

// ✅ Routes statiques et spécifiques en premier
// Lire tous les produits validés (public)
router.get("/validated", productController.getValidatedProducts);

// Lire tous les produits (public)
router.get("/", productController.getAllProducts);

// ⚠️ Routes dynamiques après les routes statiques
// Modifier un produit (avec upload image)
router.put(
  "/:id",
  authenticate("producer"),
  uploadProductImage,
  productController.updateProduct
);

// Supprimer un produit
router.delete(
  "/:id",
  authenticate("producer"),
  productController.deleteProduct
);

// Toggle disponibilité produit
router.patch(
  "/:id/availability",
  authenticate("producer"),
  productController.toggleProductAvailability
);

// ✅ Lire un produit par ID (public)
router.get("/:id", productController.getProductById);


module.exports = router;