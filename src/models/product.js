const { boolean } = require('joi');
const mongoose  = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    name: String,
    weight: Number,
    unit: String,    
    price: Number,    
    quantity: Number,
    isKilogram: Boolean,
    category: String,
    description: String,
    image: {
        filename: String,
        path: String,
        originalname: String,
        mimetype: String,
        size: Number
    }
});

module.exports = mongoose.model('product', productSchema);
