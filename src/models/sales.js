const mongoose  = require('mongoose');
const { Schema } = mongoose;

const salesProduct =  new Schema({
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

const salesSummary = new Schema({
    totalAmount: Number,

})

const salesSchema = new Schema({
    userId: String,
    timestamp: Date,
    products: [salesProduct]   
});

module.exports = mongoose.model('sale', salesSchema);