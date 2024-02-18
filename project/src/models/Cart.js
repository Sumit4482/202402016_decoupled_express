const mongoose = require('mongoose');

// Define Cart schema
const cartSchema = new mongoose.Schema({
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number
  }]
});

// Create Cart model
const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
