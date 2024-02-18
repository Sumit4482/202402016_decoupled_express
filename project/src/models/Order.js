const mongoose = require('mongoose');

// Define Order schema
const orderSchema = new mongoose.Schema({
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number
  }]
});

// Create Order model
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
