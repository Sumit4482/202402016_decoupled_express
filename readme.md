# Decoupled_Express 🛒

Decoupled_Express is a versatile e-commerce API built using Node.js and Express.js. It offers the flexibility to switch between MongoDB and a custom database seamlessly by toggling a single boolean variable.

## Features

- **Product Management:** Retrieve a list of available products, view details of specific products, and search for products based on various criteria.
  
- **Shopping Cart:** Add products to the shopping cart, view the contents of the cart, and remove products from the cart.
  
- **Order Management:** Create orders by processing checkout, view a list of all orders, and retrieve details of specific orders.
  
- **Seller Inventory:** Manage inventory by adding new products, updating information for existing products, and removing products from the inventory.

## Endpoints

### Product Requests

- `GET /products`: Retrieve a list of available products.
  
- `GET /products/getbyid/{id}`: Retrieve details of a specific product.
  
- `GET /products/search`: Search for products based on certain criteria.
  
- `POST /products`: Add a new product to the inventory.
  
- `PUT /products/{id}`: Update information for a specific product.
  
- `DELETE /products/{id}`: Remove a product from the inventory.

### Shopping Cart Requests

- `GET /cart`: Retrieve the contents of the shopping cart.
  
- `POST /cart/add`: Add a product to the shopping cart.
  
- `DELETE /cart/{id}`: Remove a product from the shopping cart.
  
- `POST /cart/checkout`: Process the checkout and create an order.

### Order Requests

- `GET /orders`: Retrieve a list of all orders.
  
- `GET /orders/{id}`: Retrieve details of a specific order.
  
- `DELETE /orders/{id}`: Cancel a specific order.

## Switching Between MongoDB and Custom Database

To switch between MongoDB and a custom database in the Decoupled_Express API, follow these steps:

1. Set the `useMongo` boolean variable to `true` or `false` in the configuration file to choose between MongoDB and a custom database, respectively.
  
2. Configure the database connection settings accordingly in the `dbConfig.js` file based on the selected database type.
  
3. Run the application, and it will automatically use the specified database based on the value of the `useMongo` variable.

## Adding a New Endpoint

To add a new endpoint to the Decoupled_Express API, follow these steps:

1. Define the route and HTTP method in the appropriate route file (e.g., `productRoutes.js`, `cartRoutes.js`, etc.).
  
2. Create a corresponding controller function in the `controllers` directory to handle the logic for the new endpoint.
  
3. Implement any necessary services or helper functions in the `services` directory.
  
4. Test the new endpoint thoroughly to ensure it functions as expected.
  
5. Update the README.md file to document the new endpoint, including its route, purpose, and any required parameters or payloads.
