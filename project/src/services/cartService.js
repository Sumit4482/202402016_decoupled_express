const fs = require("fs"); // Import the 'fs' module for file operations
const path = require("path");
// Path to the carts JSON file
const cartsFilePath = path.join(__dirname, "../database/cart.json");
const ordersFilePath = path.join(__dirname, "../database/order.json");
let useMongo = false;
const Cart = require('../models/Cart');
// Service function to read cart data from the JSON file
async function readCartData() {
  if (useMongo) {
      try {
          const carts = await Cart.find(); // Assuming Cart is the Mongoose model for carts
          return carts;
      } catch (error) {
          throw new Error('Failed to retrieve cart data');
      }
  } else {
      const filePath = cartsFilePath;
      try {
          const data = await fs.readFile(filePath);
          return JSON.parse(data);
      } catch (error) {
          // If the file doesn't exist or there's an error reading it, return an empty array
          return [];
      }
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
  if (useMongo) {
    console.log("USING MONGO");
    try {
      const existingCart = await Cart.findOne({});
      if (existingCart) {
        return existingCart.items; // Return the items from the cart
      } else {
        return []; // Return an empty array if the cart doesn't exist
      }
    } catch (error) {
      throw new Error('Failed to get cart contents: ' + error.message);
    }
  } else {
    console.log("USING CUSTOM");
    const filePath = cartsFilePath;
    try {
      const cartContents = JSON.parse(fs.readFileSync(filePath));
      return cartContents; // Return the cart contents
    } catch (error) {
      throw new Error("Failed to get cart contents");
    }
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
async function addToCart(id) {
  if (useMongo) {
    console.log("USING MONGO");
    try {
      const existingCart = await Cart.findOne({});
      
      if (existingCart) {
        // Check if the product is already in the cart
        const existingProductIndex = existingCart.items.findIndex(item => item.productId === id);
        
        if (existingProductIndex !== -1) {
          // If the product is already in the cart, do nothing
          return existingCart.items[existingProductIndex];
        } else {
          // If the product is not in the cart, add it with quantity 1
          existingCart.items.push({ productId: id, quantity: 1 });
          await existingCart.save();
          return existingCart.items[existingCart.items.length - 1]; // Return the last item (added product)
        }
      } else {
        // If the cart doesn't exist, create a new one with the product
        const newCart = new Cart({
          items: [{ productId: id, quantity: 1 }]
        });
        await newCart.save();
        return newCart.items[0]; // Return the added product from the new cart
      }
    } catch (error) {
      throw new Error('Failed to add product to cart: ' + error.message);
    }
  }else {
    console.log("USING CUSTOM");
    const filePath = cartsFilePath;
    let existingData = [];
    try {
      existingData = JSON.parse(fs.readFileSync(filePath));
    } catch (error) {
      // File doesn't exist or is empty, ignore error
    }
    
    // Check if the product is already in the cart
    const existingProductIndex = existingData.findIndex(item => item.productId === id);

    if (existingProductIndex !== -1) {
      // If the product is already in the cart, increase its quantity
      existingData[existingProductIndex].quantity++;
    } else {
      // If the product is not in the cart, add it with quantity 1
      existingData.push({ productId: id, quantity: 1 });
    }

    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));

    // Find the added product in the cart
    const addedProduct = existingData.find(item => item.productId === id);
    return addedProduct;
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
