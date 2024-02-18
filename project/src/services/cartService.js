const fs = require("fs").promises; // Import the 'fs' module for file operations
const path = require("path");
// Path to the carts JSON file
const cartsFilePath = path.join(__dirname, "../database/carts.json");
const ordersFilePath = path.join(__dirname, "../database/order.json");

// Service function to read cart data from the JSON file
async function readCartData() {
  try {
    const data = await fs.readFile(cartsFilePath);
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist or there's an error reading it, return an empty array
    return [];
  }
}

async function readOrderData() {
    try {
      const data = await fs.readFile(ordersFilePath);
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }
  
  async function writeOrderData(data) {
    try {
      await fs.writeFile(ordersFilePath, JSON.stringify(data, null, 2));
    } catch (error) {
      throw new Error('Failed to write order data to file');
    }
  }
  
// Service function to get all contents of the cart
async function getAllCartContents() {
  try {
    const cartContents = await readCartData(); // Read cart data from the JSON file
    return cartContents; // Return the cart contents
  } catch (error) {
    throw new Error("Failed to get cart contents");
  }
}

// Service function to write cart data to the JSON file
async function writeCartData(data) {
  try {
    await fs.writeFile(cartsFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    throw new Error("Failed to write cart data to file");
  }
}

// Service function to add a product to the shopping cart
async function addToCart(productId) {
  try {
    let cart = await readCartData(); // Read cart data from the JSON file

    // Check if the product is already in the cart
    const existingProductIndex = cart.findIndex(
      (item) => item.productId === productId
    );

    if (existingProductIndex !== -1) {
      // If the product is already in the cart, increase its quantity
      cart[existingProductIndex].quantity++;
    } else {
      // If the product is not in the cart, add it with quantity 1
      cart.push({ productId, quantity: 1 });
    }

    await writeCartData(cart); // Write updated cart data to the JSON file

    // Return the added product or relevant information (e.g., updated cart)
    return { productId, quantity: 1 }; // Example response (you can modify this as needed)
  } catch (error) {
    throw new Error("Failed to add product to cart");
  }
}

// Service function to remove a product from the shopping cart by its ID
async function removeFromCart(productId) {
  try {
    let cart = await readCartData(); // Read cart data from the JSON file

    // Find the index of the product in the cart
    const productIndex = cart.findIndex((item) => item.productId === productId);

    if (productIndex !== -1) {
      // Remove the product from the cart
      cart.splice(productIndex, 1);
      await writeCartData(cart); // Write updated cart data to the JSON file
      return { success: true };
    } else {
      throw new Error("Product not found in the cart");
    }
  } catch (error) {
    throw new Error("Failed to remove product from cart");
  }
}

async function checkout() {
  try {
    let cart = await readCartData();
    if (cart.length === 0) {
      throw new Error("Cart is empty");
    }

    const orderId = generateOrderId();
    const order = { orderId, items: cart };

    let orders = await readOrderData();
    orders.push(order);

    await writeOrderData(orders);
    await writeCartData([]);

    return order;
  } catch (error) {
    throw new Error("Failed to checkout");
  }
}
function generateOrderId() {
  return Math.random().toString(36).substring(2, 10); // Generate a random alphanumeric string
}

// Export the addToCart function
module.exports = {
  addToCart,
  getAllCartContents,
  removeFromCart,
  checkout,
};
