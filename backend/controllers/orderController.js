const mongoose = require('mongoose');
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Product = require("../models/Product");

/**
 * Créer une commande
 */
exports.createOrder = async (req, res) => {
  try {
    const { items, paymentMethod } = req.body;
    const userId = req.user._id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "La commande doit contenir au moins un produit"
      });
    }

    // Vérification des produits
    const productIds = items.map(item => item.product);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== items.length) {
      const missingIds = items.filter(
        item => !products.some(p => p._id.equals(item.product))
      ).map(item => item.product);
      return res.status(404).json({
        success: false,
        message: "Certains produits n'existent pas",
        missingProducts: missingIds
      });
    }

    // Vérifier que tous les produits appartiennent au même producteur
    const producerIds = [...new Set(products.map(p => p.producer.toString()))];
    if (producerIds.length > 1) {
      return res.status(400).json({
        message: "Une commande ne peut contenir que les produits d'un seul producteur."
      });
    }

    // Vérification du stock et préparation des OrderItems
    const orderItemsData = [];
    const stockIssues = [];

    items.forEach(item => {
      const product = products.find(p => p._id.equals(item.product));
      if (product.stock < item.quantity) {
        stockIssues.push({
          produit: product.name,
          quantité_demandée: item.quantity,
          quantité_disponible: product.stock,
          message: `Il ne reste que ${product.stock} unité(s) de "${product.name}" en stock`
        });
      } else {
        orderItemsData.push({
          product: product._id,
          quantity: item.quantity,
          price: product.price,
          total: product.price * item.quantity
        });
      }
    });

    if (stockIssues.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Certains produits ne sont pas disponibles en quantité suffisante",
        details: stockIssues
      });
    }

    // Création des OrderItems
    const createdOrderItems = await OrderItem.create(orderItemsData);

    // Calcul du total global
    const orderTotal = orderItemsData.reduce((sum, item) => sum + item.total, 0);

    // Création de la commande
    const newOrder = await Order.create({
      user: userId,
      items: createdOrderItems.map(item => item._id),
      total: orderTotal,
      status: "pending",
      paymentMethod: paymentMethod || "delivery"
    });

    // Mise à jour des stocks
    await Promise.all(items.map(item =>
      Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } })
    ));

    // Récupération complète avec relations
    const completeOrder = await Order.findById(newOrder._id)
      .populate({
        path: 'items',
        populate: { path: 'product', select: 'name price producer' }
      })
      .populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: "Commande créée avec succès",
      order: completeOrder
    });

  } catch (error) {
    console.error("Erreur création commande:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Récupérer toutes les commandes pour l'admin ou filtrées selon le rôle
 */
exports.getOrders = async (req, res) => {
  try {
    let orders;

    if (req.user.role === "admin") {
      // Admin : toutes les commandes
      orders = await Order.find()
        .populate({
          path: 'items',
          populate: { path: 'product', select: 'name price producer' }
        })
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .lean();
    } else if (req.user.role === "producer") {
      // Producteur : commandes contenant au moins un produit qu'il possède
      const allOrders = await Order.find()
        .populate({
          path: 'items',
          populate: { path: 'product', select: 'name price producer' }
        })
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .lean();

      // Filtrer uniquement les commandes contenant ses produits
      orders = allOrders.filter(order =>
        order.items.some(item => item.product.producer?.toString() === req.user._id.toString())
      );
    } else {
      // Consommateur : uniquement ses commandes
      orders = await Order.find({ user: req.user._id })
        .populate({
          path: 'items',
          populate: { path: 'product', select: 'name price producer' }
        })
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .lean();
    }

    res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

/**
 * Récupérer les commandes de l'utilisateur connecté
 */
exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ user: userId })
      .populate({
        path: 'items',
        populate: { path: 'product', select: 'name images price category' }
      })
      .sort({ createdAt: -1 })
      .lean();

    if (!orders.length) {
      return res.status(200).json({
        success: true,
        message: "Aucune commande trouvée",
        data: [],
        meta: { count: 0, totalAmount: "0.00" }
      });
    }

    // Formater les commandes
    const formattedOrders = orders.map(order => {
      const items = order.items?.map(item => {
        const product = item.product || {};
        return {
          id: item._id?.toString() || '',
          product: {
            id: product._id?.toString() || '',
            name: product.name || 'Produit indisponible',
            image: product.images?.[0] || null,
            price: product.price?.toFixed(2) || "0.00"
          },
          quantity: item.quantity || 0,
          subtotal: (item.quantity * (product.price || 0)).toFixed(2)
        };
      }) || [];

      return {
        id: order._id?.toString(),
        date: order.createdAt?.toLocaleDateString('fr-FR') || 'Date inconnue',
        status: exports.getStatusLabel(order.status),
        paymentMethod: exports.getPaymentMethodLabel(order.paymentMethod),
        total: order.total?.toFixed(2) || "0.00",
        items
      };
    });

    const totalAmount = orders.reduce((sum, order) => sum + (order.total || 0), 0).toFixed(2);

    res.status(200).json({
      success: true,
      data: formattedOrders,
      meta: { count: orders.length, totalAmount }
    });

  } catch (error) {
    console.error('[Order Controller] Error:', error);
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue lors de la récupération de vos commandes",
      error: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        stack: error.stack
      } : undefined
    });
  }
};

// Helpers pour labels
exports.getStatusLabel = (status) => {
  const statusMap = {
    pending: "En attente",
    paid: "Payée",
    shipped: "Expédiée",
    delivered: "Livrée",
    cancelled: "Annulée",
    refunded: "Remboursée"
  };
  return statusMap[status] || status;
};

exports.getPaymentMethodLabel = (method) => {
  const methodMap = {
    stripe: "Carte bancaire",
    paypal: "PayPal",
    delivery: "Paiement à la livraison",
    transfer: "Virement bancaire",
    mobile_money: "Mobile Money"
  };
  return methodMap[method] || method;
};

/**
 * Mettre à jour le statut d'une commande
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;
    const userId = req.user._id;
    const userRole = req.user.role;

    const order = await Order.findById(orderId)
      .populate({ path: "items", populate: { path: "product", select: "producer" } });

    if (!order) return res.status(404).json({ message: "Commande non trouvée" });

    // Vérification du rôle et des droits
    if (userRole === "producer") {
      const ownsOrder = order.items.some(item => item.product.producer?.toString() === userId.toString());
      if (!ownsOrder) return res.status(403).json({ message: "Accès interdit : cette commande ne vous appartient pas" });

      const allowedStatuses = ["pending", "paid"];
      if (!allowedStatuses.includes(status)) {
        return res.status(403).json({ message: "Vous ne pouvez pas définir ce statut" });
      }
    }

    if (userRole === "admin") {
      const allowedStatuses = ["pending", "paid", "shipped", "delivered", "cancelled"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: "Statut invalide" });
      }
    }

    order.status = status;
    await order.save();

    res.json({ message: "Statut de la commande mis à jour", order });

  } catch (error) {
    console.error("[Order Controller] updateOrderStatus error:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
