const productService = require('../services/productService');

// Controller function to handle adding a new product
async function addProduct(req, res) {
  try {
    const product = req.body; // Get product data from request body
    const newProduct = await productService.addProduct(product); // Add product to database
    res.status(201).json(newProduct); // Respond with the newly added product
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle errors
  }
}

// Controller function to handle deleting a product
async function deleteProduct(req, res) {
    try {
      const productId = req.params.id; // Get product ID from request parameters
      await productService.deleteProduct(productId); // Delete product from database
      res.status(204).send(); // Respond with no content for successful deletion
    } catch (error) {
      res.status(500).json({ error: error.message }); // Handle errors
    }
  }


  // Controller function to handle updating a product
async function updateProduct(req, res) {
    try {
      const productId = req.params.id; // Get product ID from request parameters
      const updatedProductData = req.body; // Get updated product data from request body
      const updatedProduct = await productService.updateProduct(productId, updatedProductData); // Update product in database
      res.json(updatedProduct); // Respond with the updated product
    } catch (error) {
      res.status(500).json({ error: error.message }); // Handle errors
    }
  }


  // Controller function to handle retrieving all products
async function getAllProducts(req, res) {
  try {
    const products = await productService.getAllProducts(); // Retrieve all products from database
    console.log("GETTING ALL PRODUCTSSSSS");
    res.json(products); // Respond with the list of products
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle errors
  }
}

// Controller function to handle retrieving information for a specific product
async function getProductById(req, res) {
  try {
    const productId = req.params.id; // Get product ID from request parameters
    const product = await productService.getProductById(productId); // Retrieve product by ID from database
    if (!product) {
      return res.status(404).json({ error: 'Product not found' }); // Handle case where product is not found
    }
    res.json(product); // Respond with the product information
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle errors
  }
}


// Controller function to handle searching for products
async function searchProducts(req, res) {
  try {
    const query = req.query.q; // Get search query from request query parameters
    console.log('Search query:', query); // Log the search query
    const products = await productService.searchProducts(query); // Search for products
    res.json(products); // Respond with the search results
  } catch (error) {
    ;
   res.status(500).json({ error: error.message }); // Handle errors
  }
}

module.exports = {
  addProduct,
  deleteProduct,
  updateProduct,
  getAllProducts,
  getProductById,
  searchProducts
};