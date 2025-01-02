const mongoose = require('mongoose');

const addressSchema = mongoose.Schema({
    country: String,
    city: String,
    locality: String,
});

const profileSchema = mongoose.Schema({
    bio: String,
    contact: String,
    address: addressSchema,
});

module.exports = mongoose.model('Profile', profileSchema);
