const jwt = require("jsonwebtoken");
const User = require("../models/User");
const fs = require("fs");
const path = require("path");

// ==================== INSCRIPTION ====================
exports.register = async (req, res) => {
  try {
    const {
      name, email, password, role,
      adresse, ville, region, telephone,
      groupName, categories
    } = req.body;

    if (!name || !email || !password || !telephone || !adresse || !ville || !region) {
      return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    // Gestion des fichiers uploadés
    const avatar = req.files?.avatar ? `/uploads/${req.files.avatar[0].filename}` : "/default-avatar.png";
    const cover = role === "producer" && req.files?.cover ? `/uploads/${req.files.cover[0].filename}` : null;

    // ✅ Validation automatique si consumer
    const isValidated = role === "consumer";

    const user = new User({
      name: name.trim(),
      email: email.trim(),
      password,
      role,
      adresse: adresse.trim(),
      ville: ville.trim(),
      region: region.trim(),
      telephone: telephone.trim(),
      avatar,
      cover,
      groupName: role === "producer" ? groupName?.trim() || "" : "",
      categories: role === "producer" ? categories || [] : [],
      isValidated, // ✅ ajouté
    });

    await user.save();

    res.status(201).json({ message: "Inscription réussie", user });
  } catch (err) {
    console.error("Erreur serveur :", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// ==================== CONNEXION ====================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.login(email, password);

    // ✅ Vérifier si le compte est validé
    if (!user.isValidated) {
      return res.status(403).json({ message: "Votre compte n'est pas encore validé." });
    }

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

// ==================== PROFIL UTILISATEUR ====================
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "_id name email telephone role adresse ville region bio avatar cover groupName categories isValidated createdAt"
    );
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    res.json(user);
  } catch (error) {
    console.error("Erreur lors de la récupération du profil :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ==================== MISE À JOUR PROFIL ====================
exports.updateProfile = async (req, res) => {
  try {
    const {
      name, email, telephone, oldPassword, newPassword,
      adresse, ville, region, groupName, categories, bio
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    // Gestion des fichiers uploadés (si tu utilises upload.fields)
    const avatar = req.files?.avatar ? `/uploads/${req.files.avatar[0].filename}` : null;
    const cover = req.files?.cover ? `/uploads/${req.files.cover[0].filename}` : null;

    // Fonction suppression d’ancienne image
    const deleteFile = (filePath) => {
      if (filePath && !filePath.includes("default-avatar.png")) {
        const path = require("path");
        const fs = require("fs");
        const fullPath = path.join(__dirname, "..", filePath.replace(/^\//, ""));
        fs.unlink(fullPath, (err) => {
          if (err) console.error("Erreur suppression fichier :", fullPath, err.message);
        });
      }
    };

    // Supprimer l’ancienne si une nouvelle arrive
    if (avatar) deleteFile(user.avatar);
    if (cover) deleteFile(user.cover);

    // Mise à jour des champs
    if (name) user.name = name.trim();
    if (email) user.email = email.trim();
    if (telephone) user.telephone = telephone.trim();
    if (adresse) user.adresse = adresse.trim();
    if (ville) user.ville = ville.trim();
    if (region) user.region = region.trim();
    if (bio) user.bio = bio.trim();
    if (avatar) user.avatar = avatar;
    if (user.role === "producer") {
      if (cover) user.cover = cover;
      if (groupName) user.groupName = groupName.trim();
      if (categories) user.categories = categories;
    }

    // Changement de mot de passe
    if (newPassword) {
      if (!oldPassword) {
        return res.status(400).json({ message: "Veuillez fournir votre ancien mot de passe." });
      }
      const isMatch = await user.comparePassword(oldPassword);
      if (!isMatch) return res.status(400).json({ message: "Ancien mot de passe incorrect." });

      user.password = newPassword;
    }

    await user.save();

    res.status(200).json({
      message: "Profil mis à jour avec succès",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        telephone: user.telephone,
        role: user.role,
        adresse: user.adresse,
        ville: user.ville,
        region: user.region,
        bio: user.bio,
        avatar: user.avatar,
        cover: user.cover,
        groupName: user.groupName,
        categories: user.categories,
        isValidated: user.isValidated,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Erreur mise à jour profil :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};



// ==================== SUPPRESSION COMPTE CONSUMER ====================
exports.deleteConsumerAccount = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    if (user.role !== "consumer") {
      return res.status(403).json({ message: "Accès réservé uniquement aux consommateurs" });
    }

    // ✅ Supprimer les fichiers images (avatar + cover si dispo)
    const filesToDelete = [];
    if (user.avatar && !user.avatar.includes("default-avatar.png")) {
      filesToDelete.push(path.join(__dirname, "..", user.avatar.replace(/^\//, "")));
    }
    if (user.cover) {
      filesToDelete.push(path.join(__dirname, "..", user.cover.replace(/^\//, "")));
    }

    filesToDelete.forEach((filePath) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Erreur suppression fichier :", filePath, err.message);
        }
      });
    });

    // ❌ Supprimer l'utilisateur de la base
    await User.findByIdAndDelete(user._id);

    return res.status(200).json({
      message: "Votre compte consommateur et vos images ont été supprimés avec succès",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Erreur lors de la suppression du compte",
      error: err.message,
    });
  }
};
