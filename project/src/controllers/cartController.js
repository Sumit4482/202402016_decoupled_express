const cartService = require('../services/cartService');

// Controller function to handle adding a product to the shopping cart
async function addToCart(req, res) {
  try {
    const productId = req.body.productId; // Extract product ID from request body
    const addedProduct = await cartService.addToCart(productId); // Add product to cart
    res.json(addedProduct); // Respond with the added product
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle errors
  }
}

// Controller function to handle retrieving all contents of the cart
async function getAllCartContents(req, res) {
    try {
      const cartContents = await cartService.getAllCartContents(); // Get all contents of the cart
      res.json(cartContents); // Respond with the cart contents
    } catch (error) {
      res.status(500).json({ error: error.message }); // Handle errors
    }
  }


  // Controller function to handle removing a product from the cart
async function removeFromCart(req, res) {
    try {
      const productId = req.params.productId; // Get the product ID from the request parameters
      await cartService.removeFromCart(productId); // Remove the product from the cart
      res.json({ success: true }); // Respond with success message
    } catch (error) {
      res.status(500).json({ error: error.message }); // Handle errors
    }
  }

  async function checkout(req, res) {
    try {
      const order = await cartService.checkout();
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
module.exports = {
  addToCart,
  getAllCartContents,
  removeFromCart,
  checkout
};