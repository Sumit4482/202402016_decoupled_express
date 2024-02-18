
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController'); // Import CartController

// Route to add a product to the shopping cart
router.post('/add', cartController.addToCart);

// Route to retrieve all contents of the cart
router.get('/', cartController.getAllCartContents)

// Route to remove a product from the cart by its ID
router.delete('/:productId', cartController.removeFromCart);


router.post('/checkout', cartController.checkout);
// Other cart routes
// Add other cart routes as needed...

module.exports = router;
