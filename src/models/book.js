const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        minlength: 2
    },
    price: {
        type: Number,
        required: true
    },
    author: {
        required: true,
        type: String,
        minlength: 4
    },
    genres: [
        {type: String}
    ],
    borrower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
})

module.exports = mongoose.model('Book', schema)
