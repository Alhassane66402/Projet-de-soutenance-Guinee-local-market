const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    producer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Le producteur est requis"],
    },
    name: {
      type: String,
      required: [true, "Le nom du produit est requis"],
      trim: true,
      minlength: [2, "Le nom doit contenir au moins 2 caractères"],
      maxlength: [100, "Le nom ne doit pas dépasser 100 caractères"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    price: {
      type: Number,
      required: [true, "Le prix est requis"],
      min: [0, "Le prix ne peut pas être négatif"],
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Le stock ne peut pas être négatif"],
    },
    category: {
      type: String,
      trim: true,
      default: "",
      enum: {
        values: ["Fruits", "Légumes", "Artisanat", "Textiles", "Autres", ""],
        message: "Catégorie non valide",
      },
    },
    image: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// ✅ AJOUT ICI : méthode statique pour la recherche avancée
productSchema.statics.searchProducts = function (filters = {}) {
  const query = {};

  if (filters.name) {
    query.name = { $regex: filters.name, $options: "i" }; // recherche insensible à la casse
  }

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.producerId) {
    query.producer = filters.producerId;
  }

  return this.find(query).populate("producer", "name email");
};

// ✅ Export final
module.exports = mongoose.model("Product", productSchema);
