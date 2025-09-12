const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom est requis"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "L'email est requis"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    telephone: {
      type: String,
      required: [true, "Le téléphone est requis"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Le mot de passe est requis"],
      minlength: [6, "Le mot de passe doit contenir au moins 6 caractères"],
    },
    role: {
      type: String,
      enum: ["consumer", "producer", "admin"],
      default: "consumer",
    },
    isValidated: {
      type: Boolean,
      default: false,
    },
    adresse: {
      type: String,
      required: [true, "L'adresse est requise"],
      trim: true,
    },
    ville: {
      type: String,
      required: [true, "La ville est requise"],
      trim: true,
    },
    region: {
      type: String,
      required: [true, "La région est requise"],
      trim: true,
    },
    bio: {
      type: String,
      default: "",
      trim: true,
    },

    // ✅ NOUVEAUX CHAMPS
    avatar: {
      type: String,
      default: "/default-avatar.png", // image par défaut
    },
    cover: {
      type: String, // photo de couverture uniquement pour producteurs
      default: null,
    },
    groupName: {
      type: String, // nom du groupe / entreprise (facultatif)
      default: "",
      trim: true,
    },
    categories: {
      type: [String], // tableau de catégories pour les producteurs
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password; // masquer le mot de passe
        return ret;
      },
    },
  }
);

// 🔐 Hachage du mot de passe avant la sauvegarde
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

// 🔐 Méthode statique de login
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("Email incorrect");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Mot de passe incorrect");

  return user;
};

// 🔐 Méthode d’instance de comparaison de mot de passe
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
