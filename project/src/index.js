const express = require('express');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes')
const orderRoutes = require('./routes/orderRoutes')
const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());


const useMongo = true;
module.exports = {
    useMongo
};


// Routes
app.use('/products', productRoutes);
app.use('/cart',cartRoutes)
app.use('/orders', orderRoutes);

//------------------------------------------------------------------------------
const mongoose = require('mongoose');

// Connection URI
const uri = 'mongodb+srv://root:root@cluster0.6zztuof.mongodb.net/ecom_data?retryWrites=true&w=majority';

// Connect to MongoDB Atlas
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Error connecting to MongoDB Atlas', err));


//  ------------------------------------------------------------------------------

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
