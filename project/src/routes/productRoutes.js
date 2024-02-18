const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productController');

// Route to add a new product
router.post('/', productsController.addProduct);

router.delete('/:id', productsController.deleteProduct);

// Route to update an existing product
router.put('/:id', productsController.updateProduct);

// Route to retrieve all products
router.get('/', productsController.getAllProducts);

// Route to retrieve information for a specific product
router.get('/getbyid/:id', productsController.getProductById);

// Route to search for products
router.get('/search', productsController.searchProducts);

module.exports = router;