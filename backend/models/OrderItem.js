const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "La quantité doit être au moins 1"],
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Le prix doit être positif"],
  },
  total: {
    type: Number,
    required: true,
    min: [0, "Le total doit être positif"],
  },
});

// ✅ Middleware Mongoose pour calculer automatiquement le total avant d'enregistrer
orderItemSchema.pre("save", function (next) {
  this.total = this.quantity * this.price;
  next();
});

module.exports = mongoose.model("OrderItem", orderItemSchema);
