const User = require("../models/User");
const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");
// 🔹 Récupérer tous les utilisateurs (admin uniquement)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // on enlève le mot de passe

    if (users.length === 0) {
      return res.status(200).json({ message: "Aucun utilisateur trouvé" });
    }

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la récupération des utilisateurs",
      error: err.message,
    });
  }
};

// 🔹 Récupérer et afficher tous les producteurs en attente de validation
exports.getPendingProducers = async (req, res) => {
  try {
    const pendingProducers = await User.find({
      role: "producer",
      isValidated: false,
    }).select("-password");

    if (pendingProducers.length === 0) {
      return res
        .status(200)
        .json({ message: "Aucun producteur en attente de validation" });
    }

    res.status(200).json(pendingProducers);
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la récupération des producteurs en attente",
      error: err.message,
    });
  }
};

// 🔹 Valider un producteur (admin uniquement)
exports.validateProducer = async (req, res) => {
  try {
    const producer = await User.findById(req.params.id);
    if (!producer) {
      return res.status(404).json({ message: "Producteur non trouvé" });
    }

    producer.isValidated = true;
    await producer.save();

    res
      .status(200)
      .json({ message: "Producteur validé avec succès", producer });
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la validation du producteur",
      error: err.message,
    });
  }
};

// 🔹 Afficher tous les producteurs (admin uniquement)
exports.getAllProducers = async (req, res) => {
  try {
    const producers = await User.find({ role: "producer" }).select("-password");

    if (producers.length === 0) {
      return res.status(200).json({ message: "Aucun producteur trouvé" });
    }

    res.status(200).json(producers);
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la récupération des producteurs",
      error: err.message,
    });
  }
};

// 🔹 Bloquer / Débloquer un utilisateur (admin uniquement)
exports.blockUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Vérifier que l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Inverser le statut de blocage
    user.isBlocked = !user.isBlocked;
    await user.save();

    // 🔹 Déterminer le rôle à afficher
    let roleLabel = "Utilisateur";
    if (user.role === "consumer") roleLabel = "Consommateur";
    else if (user.role === "admin") roleLabel = "Administrateur";
    else if (user.role === "producer") roleLabel = "Producteur";

    res.status(200).json({
      message: user.isBlocked
        ? `${roleLabel} bloqué avec succès`
        : `${roleLabel} débloqué avec succès`,
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors du blocage/déblocage de l'utilisateur",
      error: err.message,
    });
  }
};

// 🔹 Récupérer les informations d'un utilisateur par ID (admin uniquement)
exports.getUserDetail = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la récupération des détails de l'utilisateur",
      error: err.message,
    });
  }
};

// Valider un produit
exports.validateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status: "valide" },
      { new: true }
    );
    if (!product)
      return res.status(404).json({ message: "Produit non trouvé" });
    res.json({ message: "Produit validé avec succès ✅", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Refuser un produit (admin uniquement)
exports.refuseProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status: "refuse" },
      { new: true }
    );
    if (!product)
      return res.status(404).json({ message: "Produit non trouvé" });
    res.json({ message: "Produit refusé ❌", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Supprimer un producteur (admin uniquement)

exports.deleteProducer = async (req, res) => {
  try {
    const producer = await User.findById(req.params.id);

    if (!producer) {
      return res.status(404).json({ message: "Producteur non trouvé" });
    }

    if (producer.role !== "producer") {
      return res
        .status(403)
        .json({ message: "Accès réservé uniquement aux producteurs" });
    }

    // ✅ Supprimer les fichiers images (avatar + cover si dispo)
    const filesToDelete = [];
    if (producer.avatar && !producer.avatar.includes("default-avatar.png")) {
      filesToDelete.push(
        path.join(__dirname, "..", producer.avatar.replace(/^\//, ""))
      );
    }
    if (producer.cover) {
      filesToDelete.push(
        path.join(__dirname, "..", producer.cover.replace(/^\//, ""))
      );
    }

    filesToDelete.forEach((filePath) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Erreur suppression fichier :", filePath, err.message);
        }
      });
    });

    // ❌ Supprimer le producteur de la base
    await User.findByIdAndDelete(producer._id);

    return res.status(200).json({
      message: "Producteur et ses images supprimés avec succès",
      producerId: producer._id,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Erreur lors de la suppression du producteur",
      error: err.message,
    });
  }
};

// ✅ NOUVELLE MÉTHODE : Récupérer tous les produits avec les informations du producteur
exports.getAllProducts = async (req, res, next) => {
  try {
    // Le champ 'producer' est peuplé pour afficher son nom
    const products = await Product.find().populate("producer", "name");

    if (products.length === 0) {
      return res.status(200).json({ message: "Aucun produit trouvé." });
    }

    res.status(200).json({
      message: "Produits récupérés avec succès.",
      products: products,
    });
  } catch (err) {
    console.error("Erreur lors de la récupération de tous les produits :", err);
    res.status(500).json({
      message: "Erreur serveur lors de la récupération des produits.",
      error: err.message,
    });
  }
};

// 🔹 Supprimer un produit (uniquement si refusé)
exports.deleteRefusedProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    // Vérification du statut
    if (product.status !== "refuse") {
      return res.status(403).json({
        message: "Seul un produit refusé peut être supprimé",
      });
    }

    // Supprimer l'image si elle existe
    if (product.image) {
      const imagePath = path.join(
        __dirname,
        "..",
        product.image.replace(/^\//, "")
      );
      fs.unlink(imagePath, (err) => {
        if (err) console.warn("Impossible de supprimer l'image :", err.message);
      });
    }

    await Product.findByIdAndDelete(productId);

    return res.status(200).json({
      message: "Produit refusé supprimé avec succès",
      productId: product._id,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Erreur lors de la suppression du produit",
      error: err.message,
    });
  }
};
