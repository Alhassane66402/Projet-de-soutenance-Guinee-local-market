const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const negotiationSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Reference to the Product model
    required: true,
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  producer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  messages: [messageSchema],
  status: {
    type: String,
    enum: ['ongoing', 'agreed', 'cancelled'],
    default: 'ongoing',
  },
  agreedPrice: {
    type: Number,
  },
  agreedQuantity: {
    type: Number,
  },
}, { timestamps: true });

const Negotiation = mongoose.model('Negotiation', negotiationSchema);
module.exports = Negotiation;
