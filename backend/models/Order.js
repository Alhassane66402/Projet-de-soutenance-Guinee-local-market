const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: "OrderItem" }],
    total: Number,
    status: {
      type: String,
      enum: ["pending", "paid", "delivered"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["stripe", "delivery"],
      default: "delivery",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
