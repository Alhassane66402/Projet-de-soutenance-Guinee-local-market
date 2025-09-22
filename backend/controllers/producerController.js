const User = require("../models/User");
const fs = require("fs");
const path = require("path");
const Product = require("../models/Product"); // si tu veux supprimer aussi ses produits

// 🔍 Obtenir tous les producteurs validés (PUBLIC)
exports.getValidatedProducers = async (req, res) => {
  try {
    const producers = await User.find({
      role: "producer",
      isValidated: true,
    }).select(
      "_id name avatar cover groupName categories adresse ville region bio telephone isBlocked createdAt"
    );

    return res.status(200).json(producers);
  } catch (err) {
    return res.status(500).json({
      message: "Erreur lors de la récupération des producteurs validés",
      error: err.message,
    });
  }
};

// 🙋 Obtenir son propre profil producteur (AUTH "producer")
exports.getProducerProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    const user = await User.findById(req.user._id).select(
      "_id name email telephone role adresse ville region bio avatar cover groupName categories createdAt"
    );

    if (!user) {
      return res.status(404).json({ message: "Profil producteur introuvable" });
    }

    if (user.role !== "producer") {
      return res.status(403).json({ message: "Accès réservé aux producteurs" });
    }

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({
      message: "Erreur lors de la récupération du profil",
      error: err.message,
    });
  }
};

// 🔍 Obtenir un producteur validé par ID (PUBLIC)
exports.getProducerById = async (req, res) => {
  try {
    const { id } = req.params;
    const producer = await User.findOne({
      _id: id,
      role: "producer",
      isValidated: true,
    }).select(
      "_id name email telephone role adresse ville region bio avatar cover groupName categories isBlocked createdAt"
    );

    if (!producer) {
      return res
        .status(404)
        .json({ message: "Producteur introuvable ou non validé" });
    }

    return res.status(200).json(producer);
  } catch (err) {
    return res.status(500).json({
      message: "Erreur lors de la récupération du producteur",
      error: err.message,
    });
  }
};

// 🛠️ Mettre à jour son profil producteur (AUTH "producer")
exports.updateProducerProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    const allowedFields = [
      "bio",
      "adresse",
      "ville",
      "region",
      "telephone",
      "avatar",
      "cover",
      "groupName",
      "categories",
    ];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
      context: "query",
    }).select(
      "_id name email telephone role adresse ville region bio avatar cover groupName categories createdAt"
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    return res.status(200).json({
      message: "Profil producteur mis à jour avec succès",
      user: updatedUser,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Erreur lors de la mise à jour du profil",
      error: err.message,
    });
  }
};

// 🔍 Obtenir tous les produits d’un producteur par ID (PUBLIC)
exports.getProductsByProducer = async (req, res) => {
  try {
    const { id } = req.params; // Vérifier que le producteur existe et est validé

    const producer = await User.findOne({
      _id: id,
      role: "producer",
      isValidated: true,
    }).select("_id"); // On n'a besoin que de l'ID ici

    if (!producer) {
      return res
        .status(404)
        .json({ message: "Producteur introuvable ou non validé" });
    } // Récupérer ses produits

    const products = await Product.find({ producer: id })
      .select(
        "_id name description price category image status isUnavailable createdAt"
      )
      .sort({ createdAt: -1 }); // tri par date décroissante // ✅ Renvoyer directement le tableau de produits

    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({
      message: "Erreur lors de la récupération des produits du producteur",
      error: err.message,
    });
  }
};

// 🗑️ Supprimer son propre compte producteur
exports.deleteProducerProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    if (user.role !== "producer") {
      return res
        .status(403)
        .json({ message: "Accès réservé uniquement aux producteurs" });
    }

    // ✅ Supprimer avatar si existe
    if (user.avatar && user.avatar.startsWith("/uploads/")) {
      const avatarPath = path.join(__dirname, "..", user.avatar);
      fs.unlink(avatarPath, (err) => {
        if (err)
          console.warn("Impossible de supprimer l'avatar :", err.message);
      });
    }

    // ✅ Supprimer cover si existe
    if (user.cover && user.cover.startsWith("/uploads/")) {
      const coverPath = path.join(__dirname, "..", user.cover);
      fs.unlink(coverPath, (err) => {
        if (err)
          console.warn("Impossible de supprimer le cover :", err.message);
      });
    }

    // ✅ Supprimer les produits associés
    await Product.deleteMany({ producer: user._id });

    // ✅ Supprimer l’utilisateur
    await User.findByIdAndDelete(user._id);

    return res.status(200).json({
      message:
        "Votre compte producteur et vos produits ont été supprimés avec succès",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Erreur lors de la suppression du compte",
      error: err.message,
    });
  }
};
