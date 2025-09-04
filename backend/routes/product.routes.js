const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const { authenticate } = require("../middlewares/auth");
const productController = require("../Controllers/productController");

// Créer un produit
router.post("/", authenticate("producer"), upload.single("image"), productController.createProduct);

// Lire tous les produits
router.get("/", productController.getAllProducts);

// Lire un produit par ID
router.get("/:id", productController.getProductById);

// Modifier un produit
router.put("/:id", authenticate("producer"), upload.single("image"), productController.updateProduct);

// Supprimer un produit
router.delete("/:id", authenticate("producer"), productController.deleteProduct);

module.exports = router;
