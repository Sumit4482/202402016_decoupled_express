const mongoose = require('mongoose');

// Define Cart schema
const cartSchema = new mongoose.Schema({
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 }
  }]
});

// Create Cart model
const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
