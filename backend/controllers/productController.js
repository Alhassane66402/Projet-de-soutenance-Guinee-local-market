const Product = require("../models/Product");
const mongoose = require("mongoose");
const User = require("../models/User")

// Créer un produit
exports.createProduct = async (req, res) => {
  try {
    const { name, price, stock = 0, category = "", description = "" } = req.body;

    // Validation des champs
    if (!name || !price) {
      return res.status(400).json({ message: "Le nom et le prix sont obligatoires" });
    }

    // 📌 Charger l'utilisateur depuis la BDD
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    if (user.role !== "producer") {
      return res.status(403).json({ message: "Accès réservé aux producteurs" });
    }

    if (!user.isValidated) {
      return res.status(403).json({ message: "Votre compte producteur n'est pas encore validé" });
    }

    // Création du produit
    const product = new Product({
      name: name.trim(),
      price: Number(price),
      stock: Number(stock),
      category: category.trim(),
      description: description.trim(),
      image: req.file ? `/uploads/${req.file.filename}` : null,
      producer: req.user._id, // ✅ ID du producteur connecté
    });

    // Sauvegarde en base
    await product.save();

    res.status(201).json({
      message: "Produit créé avec succès",
      product
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur création produit", err });
  }
};

// Lire tous les produits
exports.getAllProducts = async (req, res) => {
  try {
    const { name, category, producer, minPrice, maxPrice, sort, page = 1, limit = 10 } = req.query;
    const query = {};

    if (name) query.name = { $regex: name, $options: "i" };
    if (category) query.category = category;
    if (producer && mongoose.Types.ObjectId.isValid(producer)) query.producer = producer;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const sortOptions = {};
    if (sort) {
      const [field, order] = sort.split(":");
      sortOptions[field] = order === "desc" ? -1 : 1;
    }

    const products = await Product.find(query)
      .populate("producer", "name email")
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Erreur chargement produits", err });
  }
};

// Lire un seul produit
exports.getProductById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID invalide" });
  }

  try {
    const product = await Product.findById(id).populate("producer", "name email");
    if (!product) return res.status(404).json({ message: "Produit non trouvé" });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Erreur chargement produit", err });
  }
};

// Modifier un produit
exports.updateProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID invalide" });
  }

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Produit non trouvé" });

    if (product.producer.toString() !== req.user._id) {
      return res.status(403).json({ message: "Accès refusé : vous n’êtes pas le propriétaire" });
    }

    const updateData = { ...req.body };

    if (req.file) updateData.image = `/uploads/${req.file.filename}`;
    if (updateData.name) updateData.name = updateData.name.trim();
    if (updateData.category) updateData.category = updateData.category.trim();
    if (updateData.description) updateData.description = updateData.description.trim();

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: "Erreur mise à jour produit", err });
  }
};

// Supprimer un produit
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID invalide" });
  }

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Produit non trouvé" });

    if (product.producer.toString() !== req.user._id) {
      return res.status(403).json({ message: "Accès refusé : vous n’êtes pas le propriétaire" });
    }

    await Product.findByIdAndDelete(id);
    res.json({ message: "Produit supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur suppression produit", err });
  }
};
