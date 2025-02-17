const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    image: String,
    name: String,
    price: Number,
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'owner' 
    }
    
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
