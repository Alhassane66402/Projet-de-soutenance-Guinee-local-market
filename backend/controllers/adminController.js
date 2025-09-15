const User = require('../models/User');
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
    const pendingProducers = await User.find({ role: "producer", isValidated: false }).select("-password");

    if (pendingProducers.length === 0) {
      return res.status(200).json({ message: "Aucun producteur en attente de validation" });
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

    res.status(200).json({ message: "Producteur validé avec succès", producer });
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

    res.status(200).json({
      message: user.isBlocked
        ? "Utilisateur bloqué avec succès"
        : "Utilisateur débloqué avec succès",
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

    const user = await User.findById(userId).select(
      "-password"
    );

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
