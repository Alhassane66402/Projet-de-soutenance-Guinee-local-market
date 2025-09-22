const Chat = require("../models/Chat");
const Product = require("../models/Product");

// =============================
// ✅ Créer ou récupérer un chat
// =============================
exports.createOrGetChat = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;

  try {
    const product = await Product.findById(productId).populate("producer");
    if (!product) return res.status(404).json({ message: "Produit non trouvé" });

    // Vérifier si un chat existe déjà
    let chat = await Chat.findOne({
      product: productId,
      buyer: userId,
      producer: product.producer._id,
    });

    // Si non, on le crée
    if (!chat) {
      chat = await Chat.create({
        product: productId,
        buyer: userId,
        producer: product.producer._id,
        messages: [],
      });
    }

    return res.json(chat);
  } catch (err) {
    console.error("Erreur création chat :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// =============================
// ✅ Envoyer un message
// =============================
exports.sendMessage = async (req, res) => {
  const { chatId } = req.params;
  const { content } = req.body;

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat non trouvé" });

    // Vérifier que l'utilisateur est bien participant
    if (
      chat.buyer.toString() !== req.user._id.toString() &&
      chat.producer.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Accès interdit" });
    }

    // Ajouter le message
    const message = {
      sender: req.user._id,
      content,
    };
    chat.messages.push(message);
    await chat.save();

    return res.json({ message: "Message envoyé", chat });
  } catch (err) {
    console.error("Erreur envoi message :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// =============================
// ✅ Récupérer les messages
// =============================
exports.getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const chat = await Chat.findById(chatId)
      .populate("messages.sender", "name email")
      .populate("product", "name price");

    if (!chat) return res.status(404).json({ message: "Chat non trouvé" });

    // Vérifier que l'utilisateur est bien participant
    if (
      chat.buyer.toString() !== req.user._id.toString() &&
      chat.producer.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Accès interdit" });
    }

    return res.json(chat.messages);
  } catch (err) {
    console.error("Erreur récupération messages :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
