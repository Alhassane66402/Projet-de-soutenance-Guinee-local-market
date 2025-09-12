const User = require('../models/User');

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
