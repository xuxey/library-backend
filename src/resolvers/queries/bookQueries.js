const Book = require("../../models/book")

const bookCount = () => Book.collection.countDocuments()
// noinspection JSUnresolvedVariable
const allBooks = async (root, args) => {
    if (args.author) return Book.find({author: args.author})
        .populate('author')
    if (args.genre) return Book.find({genres: {$in: [args.genre]}})
        .populate('author')
    return Book.find({})
        .populate('author').exec()
}
module.exports = {bookCount, allBooks}
