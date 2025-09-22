// controllers/productController.js
const Product = require("../models/Product");
const User = require("../models/User");
const Order = require("../models/Order");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// ============================
// 🔧 Helper pour gérer les erreurs
// ============================
const handleError = (res, err, message = "Erreur serveur") => {
  console.error(err);
  return res.status(500).json({
    message,
    error: err.message,
  });
};

// 🔧 Helper pour convertir isUnavailable en booléen
const parseBoolean = (value) => {
  if (Array.isArray(value)) {
    value = value[0]; // prendre le premier élément si tableau
  }
  return value === "true" || value === true;
};

// ============================
// ✅ Créer un produit
// ============================
exports.createProduct = async (req, res) => {
  try {
    const { name, price, category = "", description = "" } = req.body;

    if (!name || !price) {
      return res
        .status(400)
        .json({ message: "Le nom et le prix sont obligatoires" });
    }

    const user = await User.findById(req.user._id);
    if (!user)
      return res.status(404).json({ message: "Utilisateur introuvable" });

    if (user.role !== "producer")
      return res.status(403).json({ message: "Accès réservé aux producteurs" });

    if (!user.isValidated)
      return res
        .status(403)
        .json({ message: "Votre compte producteur n'est pas encore validé" });

    if (user.isBlocked)
      return res.status(403).json({
        message:
          "Votre compte est bloqué, vous ne pouvez pas ajouter de produit",
      });

    const isUnavailable = parseBoolean(req.body.isUnavailable);

    const product = new Product({
      name: name.trim(),
      price: Number(price),
      category: category.trim(),
      description: description.trim(),
      image: req.file ? `/uploads/${req.file.filename}` : null,
      producer: req.user._id,
      isUnavailable,
    });

    await product.save();

    return res.status(201).json({
      message: "Produit créé avec succès",
      product,
    });
  } catch (err) {
    return handleError(res, err, "Erreur création produit");
  }
};

// ============================
// ✅ Lire tous les produits (filtres + tri + pagination) - exclut producteurs bloqués
// ============================
exports.getAllProducts = async (req, res) => {
  try {
    const {
      name,
      category,
      producer,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    if (name) query.name = { $regex: name, $options: "i" };
    if (category) query.category = category;
    if (producer && mongoose.Types.ObjectId.isValid(producer))
      query.producer = producer;
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

    const productsQuery = Product.find(query)
      .populate({
        path: "producer",
        select: "name email avatar isBlocked",
        match: { isBlocked: false },
      })
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const products = await productsQuery.exec();
    const filteredProducts = products.filter((p) => p.producer !== null);

    return res.json({
      total: filteredProducts.length,
      page: Number(page),
      pages: Math.ceil(filteredProducts.length / limit),
      products: filteredProducts,
    });
  } catch (err) {
    return handleError(res, err, "Erreur chargement produits");
  }
};

// ============================
// ✅ Lire un seul produit
// ============================
exports.getProductById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "ID invalide" });

  try {
    const product = await Product.findById(id).populate(
      "producer",
      "name email avatar"
    );
    if (!product)
      return res.status(404).json({ message: "Produit non trouvé" });

    return res.json(product);
  } catch (err) {
    return handleError(res, err, "Erreur chargement produit");
  }
};

// ============================
// ✅ Lire tous les produits validés - exclut producteurs bloqués et produits indisponibles
// ============================
exports.getValidatedProducts = async (req, res) => {
  try {
    // 🔍 Recherche des produits avec le champ 'status'
    const products = await Product.find({
      status: "valide",
      isUnavailable: { $ne: true },
    })
      .populate({
        path: "producer",
        select: "name avatar isBlocked isValidated",
        // ✅ FILTRAGE : Le producteur doit avoir le champ 'isValidated'
        match: { isBlocked: false, isValidated: true },
      })
      .exec();

    // 🧹 Nettoyer la liste pour exclure les produits sans producteur valide
    const filteredProducts = products.filter((p) => p.producer !== null);

    return res.json({
      message: "Produits validés récupérés avec succès",
      data: filteredProducts,
      total: filteredProducts.length,
    });
  } catch (err) {
    return handleError(
      res,
      err,
      "Erreur lors de la récupération des produits validés"
    );
  }
};

// ============================
// ✅ Modifier un produit
// ============================
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "ID invalide" });

  try {
    const product = await Product.findById(id);
    if (!product)
      return res.status(404).json({ message: "Produit non trouvé" });

    if (product.producer.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "Accès refusé : vous n’êtes pas le propriétaire" });
    }

    const user = await User.findById(req.user._id);
    if (!user)
      return res.status(404).json({ message: "Utilisateur introuvable" });

    if (user.isBlocked)
      return res.status(403).json({
        message:
          "Votre compte est bloqué, vous ne pouvez pas modifier un produit",
      });

    const allowedFields = ["name", "price", "category", "description"];
    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] =
          typeof req.body[field] === "string"
            ? req.body[field].trim()
            : req.body[field];
      }
    });

    // ✅ Gestion du champ isUnavailable
    if (req.body.isUnavailable !== undefined) {
      updateData.isUnavailable = parseBoolean(req.body.isUnavailable);
    }

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return res.json({
      message: "Produit mis à jour avec succès",
      product: updatedProduct,
    });
  } catch (err) {
    return handleError(res, err, "Erreur mise à jour produit");
  }
};

// ============================
// ✅ Supprimer un produit (vérifie si déjà commandé)
// ============================
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "ID invalide" });

  try {
    const product = await Product.findById(id);
    if (!product)
      return res.status(404).json({ message: "Produit non trouvé" });

    if (product.producer.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "Accès refusé : vous n’êtes pas le propriétaire" });
    }

    const user = await User.findById(req.user._id);
    if (!user)
      return res.status(404).json({ message: "Utilisateur introuvable" });

    if (user.isBlocked)
      return res.status(403).json({
        message:
          "Votre compte est bloqué, vous ne pouvez pas supprimer un produit",
      });

    // 🔹 Vérification si le produit est déjà commandé
    const orderExists = await Order.exists({ "products.product": id });
    if (orderExists) {
      return res.status(400).json({
        message: "Impossible de supprimer ce produit : il a déjà été commandé",
      });
    }

    // 🔹 Supprimer l'image si elle existe
    if (product.image) {
      const imagePath = path.resolve(
        __dirname,
        "../",
        product.image.replace(/^\//, "")
      );
      fs.unlink(imagePath, (err) => {
        if (err) console.warn("Impossible de supprimer l'image :", err.message);
      });
    }

    await Product.findByIdAndDelete(id);

    return res.json({ message: "Produit et image supprimés avec succès" });
  } catch (err) {
    return handleError(res, err, "Erreur suppression produit");
  }
};

// ============================
// 🔄 Changer la disponibilité d'un produit
// ============================
exports.toggleProductAvailability = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "ID invalide" });

  try {
    const product = await Product.findById(id);
    if (!product)
      return res.status(404).json({ message: "Produit non trouvé" });

    // Vérifie que le producteur est le propriétaire
    if (product.producer.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "Accès refusé : vous n’êtes pas le propriétaire" });
    }

    const user = await User.findById(req.user._id);
    if (!user)
      return res.status(404).json({ message: "Utilisateur introuvable" });

    if (user.isBlocked)
      return res.status(403).json({
        message:
          "Votre compte est bloqué, vous ne pouvez pas modifier le produit",
      });

    // Toggle la disponibilité
    product.isUnavailable = !product.isUnavailable;
    await product.save();

    return res.json({
      message: `Produit maintenant ${
        product.isUnavailable ? "indisponible" : "disponible"
      }`,
      product,
    });
  } catch (err) {
    return handleError(res, err, "Erreur modification disponibilité produit");
  }
};

// ============================
// ✅ Lire tous les produits d’un producteur par ID (PUBLIC)
// ============================
exports.getProductsByProducer = async (req, res) => {
  try {
    const { id } = req.params;
    const producer = await User.findOne({
      _id: id,
      role: "producer",
      isValidated: true,
    }).select("_id");

    if (!producer) {
      return res.status(404).json({ message: "Producteur introuvable ou non validé" });
    }

    const products = await Product.find({ producer: id })
      .select(
        "_id name description price category image status isUnavailable createdAt"
      )
      // ✅ Correction : Ajout de la population du producteur
      .populate("producer", "_id name avatar")
      .sort({ createdAt: -1 });

    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({
      message: "Erreur lors de la récupération des produits du producteur",
      error: err.message,
    });
  }
};