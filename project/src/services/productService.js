const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');
const dataFilePath = path.join(__dirname, '../database/products.json');
const { v4: uuidv4 } = require('uuid');
let useMongo = true ;


// Service function to add a new product to the database
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

// Service function to delete a product from the database
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

// Service function to retrieve all products from the database
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

// Service function to update an existing product in the database
async function updateProduct(productId, updatedProductData) {
  if (useMongo) {
    console.log("USING MONGO");
    try {
      const updatedProduct = await Product.findByIdAndUpdate(productId, updatedProductData, { new: true }); // Update product in MongoDB
      return updatedProduct; // Return the updated product
    } catch (error) {
      throw new Error('Failed to update product');
    }
  } else {
    console.log("USING CUSTOM");
    const filePath = dataFilePath;
    try {
      let existingData = JSON.parse(fs.readFileSync(filePath)); // Read current products from file
      const updatedProducts = existingData.map(product => {
        if (String(product.id) === String(productId)) {
          return { ...product, ...updatedProductData }; // Update product data
        }
        return product;
      });
      fs.writeFileSync(filePath, JSON.stringify(updatedProducts, null, 2)); // Write updated products back to file
      const updatedProduct = updatedProducts.find(product => String(product.id) === String(productId));
      return updatedProduct; // Return the updated product
    } catch (error) {
      throw new Error('Failed to update product');
    }
  }
}
  
  // Service function to retrieve information for a specific product from the database
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
        const product = products.find(product => String(product.id) === String(productId)); // Find product by ID
        return product; // Return the product information
      } catch (error) {
        throw new Error('Failed to retrieve product');
      }
    }
  }

// Service function to search for products based on name and keywords
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


module.exports = {
  addProduct,
  deleteProduct,
  updateProduct,
  getAllProducts,
  getProductById,
  searchProducts
};