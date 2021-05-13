const mongoose  = require('mongoose');
const { Schema } = mongoose;

const ShopProduct =  new Schema({
    userId: String,
    timestamp: Date,
    productId: String,
    name: String,
    weight: Number,
    price: Number,
    quantity: Number,
    category: String,
    description: String,
    unit: Number,
    image: {
        filename: String,
        path: String,
        originalname: String,
        mimetype: String,
        size: Number
    }
}); 

module.exports = mongoose.model('shop', ShopProduct);