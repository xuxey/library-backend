const Book = require("../../models/book")

const bookCount = () => Book.collection.countDocuments()
// noinspection JSUnresolvedVariable
const allBooks = async (root, args) => {
    if (args.author) return Book.find({author: args.author})
        .populate('borrower')
        .exec()
    if (args.genre) return Book.find({genres: {$in: [args.genre]}})
        .populate('borrower')
        .exec()
    return await Book.find({})
        .populate('borrower')
        .exec()
}

const bookById = (root, args) => {
    if (args.id) return Book.findById(args.id)
        .populate('borrower')
        .exec()
}

module.exports = {bookCount, allBooks, bookById}
