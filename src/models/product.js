const mongoose  = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    name: String,
    weight: Number,
    unit: Number,    
    price: Number,    
    stock: Number,
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
