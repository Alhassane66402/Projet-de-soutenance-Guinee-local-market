const User = require("../models/User");

// 🔍 Obtenir tous les producteurs validés 
exports.getValidatedProducers = async (req, res) => {
  try {
    const producers = await User.find({ role: "producer", isValidated: true })
      .select("-password");

    if (producers.length === 0) {
      return res.status(200).json({ message: "Aucun producteur validé trouvé" });
    }

    res.status(200).json(producers);
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la récupération des producteurs validés",
      error: err.message,
    });
  }
};

// 🙋 Obtenir son propre profil producteur
exports.getProducerProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Profil producteur introuvable" });
    }

    if (user.role !== "producer") {
      return res.status(403).json({ message: "Accès réservé aux producteurs" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la récupération du profil",
      error: err.message,
    });
  }
};

// 🛠️ Mettre à jour son profil producteur
exports.updateProducerProfile = async (req, res) => {
  try {
    const { bio, adresse, ville, region } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { bio, adresse, ville, region },
      { new: true, runValidators: true, context: "query" }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json({
      message: "Profil producteur mis à jour avec succès",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour du profil",
      error: err.message,
    });
  }
};
