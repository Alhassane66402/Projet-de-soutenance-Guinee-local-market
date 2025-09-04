const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Inscription
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, adresse, ville, region } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    const user = new User({
      name,
      email,
      password,
      role,
      adresse,
      ville,
      region,
    });

    await user.save();

    res.status(201).json({ message: "Inscription réussie", user });
  } catch (err) {
    console.error("Erreur serveur :", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Connexion
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.login(email, password);

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Utilisateur connecté", token, user });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

// Profil utilisateur connecté
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "_id name email role adresse ville region"
    );
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json(user);
  } catch (error) {
    console.error("Erreur lors de la récupération du profil :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Mise à jour profil
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, oldPassword, newPassword, adresse, ville, region } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    if (name) user.name = name.trim();
    if (email) user.email = email.trim();
    if (adresse) user.adresse = adresse.trim();
    if (ville) user.ville = ville.trim();
    if (region) user.region = region.trim();

    if (newPassword) {
      if (!oldPassword) {
        return res.status(400).json({ message: "Veuillez fournir votre ancien mot de passe." });
      }

      const isMatch = await user.comparePassword(oldPassword);
      if (!isMatch) {
        return res.status(400).json({ message: "Ancien mot de passe incorrect." });
      }

      user.password = newPassword;
    }

    await user.save();

    res.status(200).json({
      message: "Profil mis à jour avec succès",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        adresse: user.adresse,
        ville: user.ville,
        region: user.region,
      },
    });
  } catch (error) {
    console.error("Erreur mise à jour profil :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
