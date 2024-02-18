const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const dataFilePath = path.join(__dirname, '../database/products.json');

// Service function to add a new product to the database
async function addProduct(productData) {
  try {
    // Create a new product using the provided data
    const newProduct = await Product.create(productData);
    return newProduct;
  } catch (error) {
    throw new Error('Failed to add product');
  }
}
// Service function to delete a product from the database
async function deleteProduct(productId) {
    try {
      console.log('Deleting product with ID:', productId);
  
      // Read current products from file
      const products = await readDataFromFile();
      console.log('Products before deletion:', products);
  
      // Remove product with specified ID
      const updatedProducts = products.filter(product => String(product.id) !== String(productId));
      console.log('Updated products after deletion:', updatedProducts);
  
      // Write updated products back to file
      await writeDataToFile(updatedProducts);
      console.log('Product deleted successfully');
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw new Error('Failed to delete product');
    }
  }

// Service function to retrieve all products from the database
async function getAllProducts() {
  try {
    const products = await readDataFromFile(); // Read current products from file
    return products; // Return the list of products
  } catch (error) {
    throw new Error('Failed to retrieve products');
  }
}

// Service function to update an existing product in the database
async function updateProduct(productId, updatedProductData) {
    try {
      const products = await readDataFromFile(); // Read current products from file
      const updatedProducts = products.map(product => {
        if (product.id === productId) {
          return { ...product, ...updatedProductData }; // Update product data
        }
        return product;
      });
      await writeDataToFile(updatedProducts); // Write updated products back to file
      const updatedProduct = updatedProducts.find(product => product.id === productId);
      return updatedProduct; // Return the updated product
    } catch (error) {
      throw new Error('Failed to update product');
    }
  }
  
  // Service function to retrieve information for a specific product from the database
async function getProductById(productId) {
  try {
    const products = await readDataFromFile(); // Read current products from file
    const product = products.find(product => product.id === productId); // Find product by ID
    return product; // Return the product information
  } catch (error) {
    throw new Error('Failed to retrieve product');
  }
}

// Service function to search for products based on name and keywords
async function searchProducts(query) {
  try {
    const products = await readDataFromFile(); // Read current products from file
    // Filter products based on name
    const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    
    console.log(filteredProducts); // Log the filtered products
    
    return filteredProducts; // Return the search results
  } catch (error) {
    throw new Error('Failed to search products');
  }
}


// Helper function to read data from the JSON file
function readDataFromFile() {
  return new Promise((resolve, reject) => {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
}

// Helper function to write data to the JSON file
function writeDataToFile(data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8', (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

// Helper function to generate a unique product ID
function generateProductId() {
    // Generate a random number between 100000 and 999999
    const productId = Math.floor(Math.random() * 900000) + 100000;
    return productId.toString();
  }

module.exports = {
  addProduct,
  deleteProduct,
  updateProduct,
  getAllProducts,
  getProductById,
  searchProducts
};