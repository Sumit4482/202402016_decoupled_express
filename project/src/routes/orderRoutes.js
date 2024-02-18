    

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Route to retrieve all orders
router.get('/', orderController.getAllOrders);

// Route to retrieve details for a specific order by its ID
router.get('/:orderId', orderController.getOrderById);


// Route to delete a specific order by its ID
router.delete('/:orderId', orderController.deleteOrderById);

module.exports = router;
