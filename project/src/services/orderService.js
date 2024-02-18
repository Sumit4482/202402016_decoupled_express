

const fs = require("fs").promises;
const path = require("path");

const ordersFilePath = path.join(__dirname, "../database/order.json");

async function readOrderData() {
  try {
    const data = await fs.readFile(ordersFilePath);
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function getAllOrders() {
  try {
    const orders = await readOrderData();
    return orders;
  } catch (error) {
    throw new Error("Failed to get orders");
  }
}

async function getOrderById(orderId) {
  try {
    const orders = await readOrderData();
    const order = orders.find((order) => order.orderId === orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    return order;
  } catch (error) {
    throw new Error("Failed to get order details");
  }
}

async function deleteOrderById(orderId) {
  try {
    let orders = await readOrderData();
    const index = orders.findIndex((order) => order.orderId === orderId);
    if (index === -1) {
      throw new Error("Order not found");
    }
    orders.splice(index, 1);
    await writeOrderData(orders);
  } catch (error) {
    throw new Error("Failed to delete order");
  }
}

module.exports = {
  getAllOrders,
  getOrderById,
  deleteOrderById,
};
