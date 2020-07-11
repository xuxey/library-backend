const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Log', schema)
