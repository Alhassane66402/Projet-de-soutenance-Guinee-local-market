const Negotiation = require("../models/Negotiation");
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Product = require("../models/Product");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

// @desc    Create a new negotiation
// @route   POST /api/negotiations
// @access  Private (for buyers)
const createNegotiation = asyncHandler(async (req, res) => {
  const { productId, message } = req.body;
  const buyerId = req.user._id;

  if (!productId) {
    res.status(400);
    throw new Error("L'ID du produit est requis.");
  }

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Produit introuvable.");
  }

  const producerId = product.user;

  // Check if an ongoing negotiation already exists for this product and buyer
  const existingNegotiation = await Negotiation.findOne({
    productId,
    buyer: buyerId,
    status: 'ongoing',
  });

  if (existingNegotiation) {
    res.status(400);
    throw new Error("Une négociation est déjà en cours pour ce produit.");
  }

  // Create the new negotiation
  const negotiation = await Negotiation.create({
    productId,
    buyer: buyerId,
    producer: producerId,
    messages: [{ sender: buyerId, text: message || "Début de la négociation." }],
  });

  res.status(201).json({
    message: "Négociation créée avec succès.",
    negotiation,
  });
});

// @desc    Get all negotiations for the logged-in user
// @route   GET /api/negotiations
// @access  Private (for buyers and producers)
const getNegotiations = asyncHandler(async (req, res) => {
  const query = {};
  if (req.user.role === "producer") {
    query.producer = req.user._id;
  } else if (req.user.role === "client") {
    query.buyer = req.user._id;
  } else {
    // Admins can see all negotiations
  }

  const negotiations = await Negotiation.find(query)
    .populate("productId", "name price image")
    .populate("buyer", "name email")
    .populate("producer", "name email");

  res.json({ negotiations });
});

// @desc    Send a new message in a negotiation
// @route   POST /api/negotiations/:negotiationId/messages
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
  const { negotiationId } = req.params;
  const { text } = req.body;

  const negotiation = await Negotiation.findById(negotiationId);

  if (!negotiation) {
    res.status(404);
    throw new Error("Négociation introuvable.");
  }

  // Ensure the user is a participant
  if (
    negotiation.buyer.toString() !== req.user._id.toString() &&
    negotiation.producer.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error("Accès refusé.");
  }

  negotiation.messages.push({
    sender: req.user._id,
    text,
  });

  await negotiation.save();

  res.json({
    message: "Message envoyé avec succès.",
    negotiation,
  });
});

// @desc    Confirm an agreement and create an order (for producer)
// @route   POST /api/negotiations/:negotiationId/confirm
// @access  Private (for producers only)
const confirmAgreement = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { negotiationId } = req.params;
    const { agreedPrice, agreedQuantity } = req.body;

    const negotiation = await Negotiation.findById(negotiationId)
      .populate("productId")
      .session(session);

    if (!negotiation) {
      res.status(404);
      throw new Error("Négociation introuvable.");
    }

    if (negotiation.producer.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Seul le producteur peut valider cet accord.");
    }

    if (negotiation.status === 'agreed') {
        res.status(400);
        throw new Error("Cette négociation est déjà terminée.");
    }

    // Update the negotiation
    negotiation.agreedPrice = agreedPrice;
    negotiation.agreedQuantity = agreedQuantity;
    negotiation.status = "agreed";
    await negotiation.save({ session });

    // Create the order item
    const orderItem = new OrderItem({
      product: negotiation.productId,
      quantity: agreedQuantity,
      price: agreedPrice,
      total: agreedPrice * agreedQuantity,
    });
    await orderItem.save({ session });

    // Create the order
    const order = new Order({
      user: negotiation.buyer,
      items: [orderItem._id],
      total: orderItem.total,
      status: "pending",
      paymentMethod: "delivery", // Default payment method
    });
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    // Respond with success
    return res.status(200).json({
      message: "Accord validé et commande créée automatiquement.",
      negotiation,
      order,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error; // Let asyncHandler handle it
  }
});

module.exports = {
  createNegotiation,
  getNegotiations,
  sendMessage,
  confirmAgreement,
};
