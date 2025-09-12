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

// Lire tous les produits (public)
router.get("/", productController.getAllProducts);

// Lire un produit par ID (public)
router.get("/:id", productController.getProductById);

// Modifier un produit (avec upload image)
router.put(
  "/:id",
  authenticate("producer"),
  uploadProductImage,
  productController.updateProduct
);

// Supprimer un produit
router.delete("/:id", authenticate("producer"), productController.deleteProduct);

module.exports = router;
