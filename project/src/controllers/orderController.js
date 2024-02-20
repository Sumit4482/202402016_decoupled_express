

const orderService = require('../services/productService');

//Controller function to Get all orders
async function getAllOrders(req, res) {
  
  try {
    const orders = await orderService.getAllOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

//Controller function to Get Specific Order by ID
async function getOrderById(req, res) {
    try {
      const orderId = req.params.orderId;
      const order = await orderService.getOrderById(orderId);
      res.json(order);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
//Controller Funciton to delete the Order by using ID
  async function deleteOrderById(req, res) {
    try {
      const orderId = req.params.orderId;
      await orderService.deleteOrderById(orderId);
      res.json({ success: true, message: 'Order deleted successfully' });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

module.exports = {
  getAllOrders,
  getOrderById,
  deleteOrderById
};
