// const fs = require("fs"); // Import the 'fs' module for file operations
// const path = require("path");
// // Path to the carts JSON file
// const cartsFilePath = path.join(__dirname, "../database/cart.json");
// const ordersFilePath = path.join(__dirname, "../database/order.json");
// const Product = require('../models/Product');
// let useMongo = true;
// const Cart = require('../models/Cart');



// // Service function to read cart data from the JSON file
// async function readCartData() {
//   if (useMongo) {
//       try {
//           const carts = await Cart.find(); // Assuming Cart is the Mongoose model for carts
//           return carts;
//       } catch (error) {
//           throw new Error('Failed to retrieve cart data');
//       }
//   } else {
      
//       try {
//           const cartData= JSON.parse(fs.readFileSync(cartsFilePath));
//           console.log("Path in readCArt :",cartData)
//           return cartData
//       } catch (error) {
//           // If the file doesn't exist or there's an error reading it, return an empty array
//           return [];
//       }
//   }
// }

// async function readOrderData() {
//     try {
//       const data = await fs.readFile(ordersFilePath);
//       return JSON.parse(data);
//     } catch (error) {
//       return [];
//     }
//   }
  
//   async function writeOrderData(data) {
//     try {
//       await fs.writeFile(ordersFilePath, JSON.stringify(data, null, 2));
//     } catch (error) {
//       throw new Error('Failed to write order data to file');
//     }
//   }
  
// // Service function to get all contents of the cart
// async function getAllCartContents() {
//   if (useMongo) {
//     console.log("USING MONGO");
//     try {
//       const existingCart = await Cart.findOne({});
//       if (existingCart) {
//         return existingCart.items; // Return the items from the cart
//       } else {
//         return []; // Return an empty array if the cart doesn't exist
//       }
//     } catch (error) {
//       throw new Error('Failed to get cart contents: ' + error.message);
//     }
//   } else {
//     console.log("USING CUSTOM");
//     const filePath = cartsFilePath;
//     try {
//       const cartContents = JSON.parse(fs.readFileSync(filePath));
//       return cartContents; // Return the cart contents
//     } catch (error) {
//       throw new Error("Failed to get cart contents");
//     }
//   }
// }
// // Service function to write cart data to the JSON file
// async function writeCartData(data) {
//   try {
//     await fs.writeFile(cartsFilePath, JSON.stringify(data, null, 2));
//   } catch (error) {
//     throw new Error("Failed to write cart data to file");
//   }
// }

// async function addToCart(cartId, productId, quantity) {
//   try {
//     // Find the product
//     const product = await Product.findById(productId);
//     if (!product) {
//       throw new Error('Product not found');
//     }

//     // Find the cart
//     let cart = await Cart.findById(cartId);
//     if (!cart) {
//       // If cart doesn't exist, create a new one
//       cart = new Cart({ items: [] });
//     }

//     // Check if the product is already in the cart
//     const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
//     if (existingItemIndex !== -1) {
//       // If the product already exists in the cart, update its quantity
//       cart.items[existingItemIndex].quantity += quantity;
//     } else {
//       // If the product is not in the cart, add it
//       cart.items.push({ productId, name: product.name, quantity });
//     }

//     // Save the updated cart
//     await cart.save();
//     return cart;
//   } catch (error) {
//     throw new Error('Failed to add product to cart: ' + error.message);
//   }
// }


// // Service function to remove a product from the shopping cart by its ID
// async function removeFromCart(productId) {
//   console.log("USING MONGO");
//   const existingCart = await Cart.findOne({});
//   if (!existingCart) {
//     throw new Error("Cart not found");
//   }
//   const productIndex = existingCart.items.findIndex(item => item.productId.toString() === productId);
//   if (productIndex === -1) {
//     throw new Error("Product not found in the cart");
//   }
//   existingCart.items.splice(productIndex, 1);
//   await existingCart.save();
//   return { success: true };
// }

// async function checkout() {
//   try {
//     let cart = await readCartData();
//     if (cart.length === 0) {
//       throw new Error("Cart is empty");
//     }

//     const orderId = generateOrderId();
//     const order = { orderId, items: cart };

//     let orders = await readOrderData();
//     orders.push(order);

//     await writeOrderData(orders);
//     await writeCartData([]);

//     return order;
//   } catch (error) {
//     throw new Error("Failed to checkout");
//   }
// }


// function generateOrderId() {
//   return Math.random().toString(36).substring(2, 10); // Generate a random alphanumeric string
// }

// // Export the addToCart function
// module.exports = {
//   addToCart,
//   getAllCartContents,
//   removeFromCart,
//   checkout,
// };
