const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 4
    },
    passwordHash: {
        type: String,
        required: true,
    },
    apartmentWing: {
        type: String,
        required: true
    },
    apartmentNumber: {
        type: Number,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('User', schema)
