const mongoose = require('mongoose');

// Define Product schema
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  stock: Number,
  keywords: [String]
});

// Create Product model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
