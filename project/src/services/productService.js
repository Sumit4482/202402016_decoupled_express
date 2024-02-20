const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');
const Product = require('../models/Product');
const dataFilePath = path.join(__dirname, '../database/products.json');
// Path to the carts JSON file
const cartsFilePath = path.join(__dirname, "../database/cart.json");
const ordersFilePath = path.join(__dirname, "../database/order.json");
const { v4: uuidv4 } = require('uuid');
const Cart = require('../models/Cart');
const Order = require('../models/Order')

//To Switch Between Databases
let useMongo = true ;


/**
 * Adds a new product to the inventory.
 * @param {Object} productData - The data of the product to be added.
 * @param {string} productData.name - The name of the product.
 * @param {string} productData.description - The description of the product.
 * @param {number} productData.price - The price of the product.
 * @param {string} productData.category - The category of the product.
 * @param {string} productData.image - The URL of the product image.
 * @param {number} productData.stock - The stock quantity of the product.
 * @param {Array<string>} productData.keywords - The keywords associated with the product.
 * @returns {Promise<Object>} A promise that resolves to the added product object.
 * @throws {Error} If there's an error while adding the product.
 */
async function addProduct(productData) {
  if (useMongo) {
      console.log("USING MONGO");
      try {
          const newProduct = await Product.create(productData);
          return newProduct;
      } catch (error) {
          throw new Error('Failed to add product');
      }
  } else {
      console.log("USING CUSTOM");
      const filePath = dataFilePath;
      let existingData = [];
      try {
          existingData = JSON.parse(fs.readFileSync(filePath));
      } catch (error) {
          // File doesn't exist or is empty, ignore error
      }
      
      // Generate UUID for the new product
      const newProductId = uuidv4();
      const newProduct = { _id: newProductId, ...productData }; // Include generated _id in product data
      existingData.push(newProduct);
      
      fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
      return newProduct; // Return the newly added product
  }
}

/**
 * Deletes a product from the inventory.
 * @param {string} productId - The ID of the product to be deleted.
 * @returns {Promise<void>} A promise that resolves when the product is successfully deleted.
 * @throws {Error} If the product with the specified ID is not found or if there's an error while deleting the product.
 */
async function deleteProduct(productId) {
  if (useMongo) {
    console.log("USING MONGO");
    try {
      const deletedProduct = await Product.findByIdAndDelete(productId);
      if (!deletedProduct) {
        throw new Error('Product not found');
      }
      console.log('Product deleted successfully');
      return deletedProduct;
    } catch (error) {
      throw new Error('Failed to delete product');
    }
  } else {
    console.log("USING CUSTOM");
    const filePath = dataFilePath;
    let existingData = [];
    try {
      existingData = JSON.parse(fs.readFileSync(filePath));
    } catch (error) {
      // File doesn't exist or is empty, ignore error
    }
    
    // Find the index of the product to delete
    const productIndex = existingData.findIndex(product => String(product._id) === String(productId));
    if (productIndex === -1) {
      throw new Error('Product not found');
    }
    
    // Remove the product from the array
    const deletedProduct = existingData.splice(productIndex, 1)[0];
    
    // Write updated data back to the file
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
    
    console.log('Product deleted successfully');
    return deletedProduct; // Return the deleted product
  }
}

/**
 * Retrieves a list of all available products.
 * @returns {Promise<Array>} A promise that resolves to an array containing all products.
 * @throws {Error} If there's an error while retrieving the products.
 */
async function getAllProducts() {
  if (useMongo) {
    console.log("USING MONGO");
    try {
      const products = await Product.find(); // Retrieve all products from MongoDB
      return products; // Return the list of products
    } catch (error) {
      throw new Error('Failed to retrieve products');
    }
  } else {
    console.log("USING CUSTOM");
    const filePath = dataFilePath;
    try {
      const products = JSON.parse(fs.readFileSync(filePath)); // Read current products from file
      return products; // Return the list of products
    } catch (error) {
      throw new Error('Failed to retrieve products');
    }
  }
}

/**
 * Updates information for an existing product in the inventory.
 * @param {string} productId - The ID of the product to be updated.
 * @param {Object} updatedProductData - The updated data of the product.
 * @param {string} [updatedProductData.name] - The updated name of the product.
 * @param {string} [updatedProductData.description] - The updated description of the product.
 * @param {number} [updatedProductData.price] - The updated price of the product.
 * @param {string} [updatedProductData.category] - The updated category of the product.
 * @param {string} [updatedProductData.image] - The updated URL of the product image.
 * @param {number} [updatedProductData.stock] - The updated stock quantity of the product.
 * @param {Array<string>} [updatedProductData.keywords] - The updated keywords associated with the product.
 * @returns {Promise<Object>} A promise that resolves to the updated product object.
 * @throws {Error} If the product with the specified ID is not found or if there's an error while updating the product.
 */
async function updateProduct(productId, updatedProductData) {
  if (useMongo) {
    try {
      console.log("Updating product with ID:", productId);
      console.log("Updated product data:", updatedProductData);
      
      const updatedProduct = await Product.findByIdAndUpdate(productId, updatedProductData, { new: true }); // Update product in MongoDB
      
      console.log("Product updated:", updatedProduct);
      
      return updatedProduct; // Return the updated product
    } catch (error) {
      console.error('Failed to update product:', error);
      throw new Error('Failed to update product');
    }
  } else {
    console.log("USING CUSTOM");
const filePath = dataFilePath;
try {
  console.log("File Path:", filePath);
  
  let existingData = JSON.parse(fs.readFileSync(filePath)); // Read current products from file
  // console.log("Existing Data:", existingData);
  
  const updatedProducts = existingData.map(product => {
    if (String(product._id) === String(productId)) {
      return { ...product, ...updatedProductData }; // Update product data
    }
    return product;
  });
  
  console.log("Updated Products:", updatedProducts);
  
  fs.writeFileSync(filePath, JSON.stringify(updatedProducts, null, 2)); // Write updated products back to file
  
  const updatedProduct = updatedProducts.find(product => String(product.id) === String(productId));
  return updatedProduct; // Return the updated product
} catch (error) {
  console.error('Failed to update product:', error);
  throw new Error('Failed to update product');
}
  }
}
  
/**
 * Retrieves details of a specific product by its ID.
 * @param {string} productId - The ID of the product to retrieve.
 * @returns {Promise<Object|null>} A promise that resolves to the product object if found, or null if not found.
 * @throws {Error} If there's an error while retrieving the product.
 */
  async function getProductById(productId) {
    if (useMongo) {
      console.log("USING MONGO");
      try {
        const product = await Product.findById(productId); // Find product by ID in MongoDB
        return product; // Return the product information
      } catch (error) {
        throw new Error('Failed to retrieve product');
      }
    } else {
      console.log("USING CUSTOM");
      const filePath = dataFilePath;
      try {
        const products = JSON.parse(fs.readFileSync(filePath)); // Read current products from file
        const product = products.find(product => String(product._id) === String(productId)); // Find product by ID
        return product; // Return the product information
      } catch (error) {
        throw new Error('Failed to retrieve product');
      }
    }
  }

/**
 * Searches for products based on their names.
 * @param {string} name - The name of the product to search for.
 * @returns {Promise<Array>} A promise that resolves to an array of products matching the search criteria.
 * @throws {Error} If there's an error while searching for products.
 */
async function searchProducts(query) {
  if (useMongo) {
    console.log("USING MONGO");
    try {
      const filteredProducts = await Product.find({
        $or: [
          { name: { $regex: query, $options: 'i' } }, // Case-insensitive search by name
          { keywords: { $in: [query.toLowerCase()] } } // Search by keywords
        ]
      });
      console.log(filteredProducts); // Log the filtered products
      return filteredProducts; // Return the search results
    } catch (error) {
      throw new Error('Failed to search products');
    }
  } else {
    console.log("USING CUSTOM");
    const filePath = dataFilePath;
    try {
      const products = JSON.parse(fs.readFileSync(filePath)); // Read current products from file
      // Filter products based on name
      const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.keywords.includes(query.toLowerCase())
      );
      console.log(filteredProducts); // Log the filtered products
      return filteredProducts; // Return the search results
    } catch (error) {
      throw new Error('Failed to search products');
    }
  }
}



//---------------CART SERVICES--------------


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
      
      try {
        const data = await fsp.readFile(cartsFilePath);
        return JSON.parse(data);
      } catch (error) {
        // If the file doesn't exist or there's an error reading it, return an empty array
        return [];
      }
    
  }
}

// async function readOrderData() {
//   try {
//     const data = await fs.readFile(ordersFilePath);
//     return JSON.parse(data);
//   } catch (error) {
//     return [];
//   }
// }
//To write order data in the JSON file
async function writeOrderData(data) {
  try {
    await fsp.writeFile(ordersFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    throw new Error('Failed to write order data to file');
  }
}

/**
 * Retrieves the contents of the shopping cart.
 * @returns {Promise<Array>} A promise that resolves to an array containing all products in the cart.
 * @throws {Error} If there's an error while retrieving the cart contents.
 */
async function getAllCartContents() {
if (useMongo) {

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
    await fsp.writeFile(cartsFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    throw new Error("Failed to write cart data to file");
  }
}

/**
 * Adds a product to the shopping cart.
 * @param {string} productId - The ID of the product to add to the cart.
 * @returns {Promise<Object>} A promise that resolves to the added product in the cart.
 * @throws {Error} If the product is not found or there's an error while adding it to the cart.
 */
async function addToCart(productId) {
  if (useMongo) {
    try {
      console.log("Adding product to cart (MongoDB):", productId);
  
      // Find the product
      const product = await Product.findById(productId);
      console.log("Product found:", product);
  
      if (!product) {
        throw new Error('Product not found');
      }
  
      // Find the cart
      let cart = await Cart.findOne(); // Assuming there's only one cart
      console.log("Cart found:", cart);
  
      if (!cart) {
        // If cart doesn't exist, create a new one
        cart = new Cart({ items: [] });
        console.log("New cart created:", cart);
      }
  
      // Check if the product is already in the cart
      const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
      console.log("Existing item index in cart:", existingItemIndex);
  
      if (existingItemIndex !== -1) {
        // If the product already exists in the cart, update its quantity
        cart.items[existingItemIndex].quantity++;
        console.log("Product already in cart. Increased quantity:", productId);
      } else {
        // If the product is not in the cart, add it
        cart.items.push({ productId, name: product.name, quantity: 1 });
        console.log("Product added to cart:", productId);
      }
  
      // Save the updated cart
      await cart.save();
      console.log("Cart saved:", cart);
  
      return { productId, quantity: 1 }; // Return the added product
    } catch (error) {
      console.error("Failed to add product to cart (MongoDB):", error);
      throw new Error("Failed to add product to cart (MongoDB)");
    }
  }
   else {
    try {
      console.log("Adding product to cart:", productId);

      let cart = await readCartData(); // Read cart data from the JSON file
      console.log("Current cart data:", cart);

      // Check if the product is already in the cart
      const existingProductIndex = cart.findIndex((item) => item._id === productId);

      if (existingProductIndex !== -1) {
        // If the product is already in the cart, increase its quantity
        cart[existingProductIndex].quantity++;
        console.log("Product already in cart. Increased quantity:", productId);
      } else {
        // If the product is not in the cart, add it with quantity 1
        cart.push({ _id: productId, quantity: 1 });
        console.log("Product added to cart:", productId);
      }

      await writeCartData(cart); // Write updated cart data to the JSON file
      console.log("Cart data updated:", cart);

      // Return the added product or relevant information (e.g., updated cart)
      return { productId, quantity: 1 }; // Example response (you can modify this as needed)
    } catch (error) {
      console.error("Failed to add product to cart:", error);
      throw new Error("Failed to add product to cart");
    }
  }
}

/**
 * Removes a product from the shopping cart.
 * @param {string} productId - The ID of the product to remove from the cart.
 * @returns {Promise<Object>} A promise that resolves to the removed product from the cart.
 * @throws {Error} If the product is not found in the cart or there's an error while removing it.
 */

async function removeFromCart(productId) {
  if (useMongo) {
    try {
      console.log("Removing product from cart (MongoDB):", productId);

      // Find the cart
      let cart = await Cart.findOne(); // Assuming there's only one cart
      console.log("Current cart data:", cart);

      // Find the index of the product in the cart
      const productIndex = cart.items.findIndex(item => item.productId.toString() === productId); // Updated to use productId
      console.log("Product index in cart:", productIndex);

      if (productIndex !== -1) {
        // Remove the product from the cart
        cart.items.splice(productIndex, 1);
        console.log("Product removed from cart:", productId);

        // Save the updated cart
        await cart.save();
        console.log("Cart saved:", cart);

        return { success: true };
      } else {
        console.log("Product not found in the cart:", productId);
        throw new Error("Product not found in the cart");
      }
    } catch (error) {
      console.error("Failed to remove product from cart (MongoDB):", error);
      throw new Error("Failed to remove product from cart (MongoDB): " + error.message);
    }
  } else {
    try {
      console.log("Removing product from cart:", productId);

      let cart = await readCartData(); // Read cart data from the JSON file
      console.log("Current cart data:", cart);

      // Find the index of the product in the cart
      const productIndex = cart.findIndex((item) => item._id === productId); // Updated to use _id property
      console.log("Product index in cart:", productIndex);

      if (productIndex !== -1) {
        // Remove the product from the cart
        cart.splice(productIndex, 1);
        console.log("Product removed from cart:", productId);

        await writeCartData(cart); // Write updated cart data to the JSON file
        console.log("Cart data updated:", cart);

        return { success: true };
      } else {
        console.log("Product not found in the cart:", productId);
        throw new Error("Product not found in the cart");
      }
    } catch (error) {
      console.error("Failed to remove product from cart:", error);
      throw new Error("Failed to remove product from cart: " + error.message);
    }
  }
}

/**
 * Processes the checkout and creates an order from the items in the cart.
 * @returns {Promise<Object>} A promise that resolves to the created order object.
 * @throws {Error} If the cart is empty or there's an error during the checkout process.
 */
async function checkout() {
  if (useMongo) {
    try {
      console.log("Starting checkout process (MongoDB)");

      // Find the cart
      let cart = await Cart.findOne(); // Assuming there's only one cart
      console.log("Cart data:", cart);

      // Check if cart is empty
      if (!cart || cart.items.length === 0) {
        console.log("Cart is empty");
        throw new Error("Cart is empty");
      }

      // Generate order ID
      const orderId = generateOrderId();
      console.log("Generated order ID:", orderId);

      // Create order object
      const order = { orderId, items: cart.items };
      console.log("Order created:", order);

      // Create a new order document
      await Order.create(order);
      console.log("Order saved to MongoDB");

      // Clear cart
      cart.items = [];
      await cart.save();
      console.log("Cart data cleared");

      console.log("Checkout process completed");

      // Return the created order
      return order;
    } catch (error) {
      console.error("Error during checkout process (MongoDB):", error);
      throw new Error("Failed to checkout");
    }
  } else {
    try {
      console.log("Starting checkout process (Custom)");

      // Read cart data
      let cart = await readCartData();
      console.log("Cart data:", cart);

      // Check if cart is empty
      if (cart.length === 0) {
        console.log("Cart is empty");
        throw new Error("Cart is empty");
      }

      // Generate order ID
      const orderId = generateOrderId();
      console.log("Generated order ID:", orderId);

      // Create order object
      const order = { orderId, items: cart };
      console.log("Order created:", order);

      // Read existing order data
      let orders = await readOrderData();
      console.log("Existing orders:", orders);

      // Add new order to orders array
      orders.push(order);
      console.log("Orders after adding new order:", orders);

      // Write updated order data
      await writeOrderData(orders);
      console.log("Order data written to storage");

      // Clear cart
      await writeCartData([]);
      console.log("Cart data cleared");

      console.log("Checkout process completed");

      // Return the created order
      return order;
    } catch (error) {
      console.error("Error during checkout process (Custom):", error);
      throw new Error("Failed to checkout");
    }
  }
}
//It generates unqiue orderId for every order
function generateOrderId() {
return Math.random().toString(36).substring(2, 10); // Generate a random alphanumeric string
}

//----------------------Order Services----------------

async function readOrderData() {
  try {
    console.log("reading data");
    const orderdata = await fsp.readFile(ordersFilePath);
    return JSON.parse(orderdata);
  } catch (error) {
    return [];
  }
}

/**
 * Retrieves a list of all orders.
 * @returns {Promise<Array>} A promise that resolves to an array containing all orders.
 * @throws {Error} If there's an error while retrieving the orders.
 */
async function getAllOrders() {
  if (useMongo) {
    try {
      console.log("Getting all orders (MongoDB)");

      // Retrieve all orders from the database
      const orders = await Order.find();
      console.log("All orders:", orders);

      return orders;
    } catch (error) {
      console.error("Error while getting all orders (MongoDB):", error);
      throw new Error("Failed to get orders");
    }
  } else {
    try {
      console.log("Getting all orders (Custom)");

      // Read order data from custom storage
      const orders = await readOrderData();
      console.log("All orders:", orders);

      return orders;
    } catch (error) {
      console.error("Error while getting all orders (Custom):", error);
      throw new Error("Failed to get orders");
    }
  }
}

/**
 * Retrieves details of a specific order by its ID.
 * @param {string} orderId - The ID of the order to retrieve.
 * @returns {Promise<Object|null>} A promise that resolves to the order object if found, or null if not found.
 * @throws {Error} If there's an error while retrieving the order.
 */
async function getOrderById(orderId) {
  if (useMongo) {
    try {
      // Find the order by its ID in the MongoDB database
      const order = await Order.findById(orderId).populate('items.productId', 'name'); // Populate the product details in the items array
  
      if (!order) {
        console.log("Order not found");
        throw new Error("Order not found");
      }
  
      console.log("Order:", order);
      return order;
    } catch (error) {
      console.error("Error while getting order by ID:", error);
      throw new Error("Failed to get order details");
    }
  } else {
    try {
      console.log("Getting order by ID (Custom):", orderId);

      // Read order data from custom storage
      const orders = await readOrderData();
      console.log("All orders:", orders);

      // Find the order by its ID
      const order = orders.find((order) => order.orderId === orderId);
      console.log("Order:", order);

      if (!order) {
        console.log("Order not found");
        throw new Error("Order not found");
      }

      return order;
    } catch (error) {
      console.error("Error while getting order by ID (Custom):", error);
      throw new Error("Failed to get order details");
    }
  }
}

/**
 * Deletes an order by its ID.
 * @param {string} orderId - The ID of the order to delete.
 * @returns {Promise<void>} A promise that resolves when the order is successfully deleted.
 * @throws {Error} If the order with the specified ID is not found or if there's an error while deleting the order.
 */
async function deleteOrderById(orderId) {
  if (useMongo) {
    try {
      // Find and delete the order by its ID in the MongoDB database
      const result = await Order.deleteOne({ _id: orderId });

      if (result.deletedCount === 0) {
        console.log("Order not found");
        throw new Error("Order not found");
      }

      console.log("Order deleted successfully");
    } catch (error) {
      console.error("Error while deleting order by ID:", error);
      throw new Error("Failed to delete order");
    }
  } else {
    try {
      let orders = await readOrderData();
      const index = orders.findIndex((order) => order.orderId === orderId);
      if (index === -1) {
        console.log("Order not found");
        throw new Error("Order not found");
      }
      orders.splice(index, 1);
      await writeOrderData(orders);
      console.log("Order deleted successfully");
    } catch (error) {
      console.error("Error while deleting order by ID:", error);
      throw new Error("Failed to delete order");
    }
  }
}



module.exports = {
  addProduct,
  deleteProduct,
  updateProduct,
  getAllProducts,
  getProductById,
  searchProducts,
  addToCart,
  getAllCartContents,
  removeFromCart,
  checkout,
  getAllOrders,
  getOrderById,
  deleteOrderById,
  getAllOrders,
  getOrderById,
  deleteOrderById,
};