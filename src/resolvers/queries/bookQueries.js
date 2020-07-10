const Book = require("../../models/book")

const bookCount = () => Book.collection.countDocuments()
// noinspection JSUnresolvedVariable
const allBooks = async (root, args) => {
    if (args.author) return Book.find({author: args.author})
        .populate('author')
        .populate('borrower')
        .exec()
    if (args.genre) return Book.find({genres: {$in: [args.genre]}})
        .populate('author')
        .populate('borrower')
        .exec()
    return await Book.find({})
        .populate('author')
        .populate('borrower')
        .exec()
}

const bookById = (root, args) => {
    if (args.id) return Book.findById(args.id)
        .populate('author')
        .populate('borrower')
        .exec()
}

module.exports = {bookCount, allBooks, bookById}
