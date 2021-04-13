const mongoose  = require('mongoose');
const bcrypt  = require('bcrypt-nodejs');
const { Schema } = mongoose;

const userSchema = new Schema({
    email: String,
    password: String,
    isAdmin: false,
});

userSchema.method('encryptPassword', function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
});

userSchema.method('validPassword', function(password) {
    return bcrypt.compareSync(password, this.password);
});

module.exports = mongoose.model('users', userSchema);