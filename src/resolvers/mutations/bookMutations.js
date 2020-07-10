const Book = require("../../models/book")
const User = require("../../models/user")
const {UserInputError, AuthenticationError, PubSub} = require('apollo-server');
const pubsub = new PubSub()

const addBook = async (root, args, context) => {
    if (!context.currentUser)
        throw new AuthenticationError("not authenticated")
    if(context.currentUser.username!=='admin')
        throw new AuthenticationError("not authorized")
    let book = await new Book({...args, borrower: null})
    let savedBook = await book.save()
        .catch(async error => {
                console.log("ERROR", error)
                throw new UserInputError(error.message, {invalidArgs: args})
            }
        )
    await pubsub.publish('BOOK_ADDED', {bookAdded: savedBook})
    return savedBook
}

const deleteBook = async (root, args, context) => {
    if(context.currentUser.username!=='admin')
        throw new AuthenticationError("not authorized")
    if (!context.currentUser)
        throw new AuthenticationError("not authenticated")
    await Book.findByIdAndDelete(args.id)
    return args.id
}

const reserveBook = async (root, args, context) => {
    if (!context.currentUser)
        throw new AuthenticationError("not authenticated")
    const book = await Book.findById(args.id)
    book.borrower = context.currentUser._id
    const user = await User.find(context.currentUser._id)
    user.borrowedBooks = user.borrowedBooks.concat(book._id)
    await user.save()
    return book.save()
}

const bookAdded = {
    subscribe: () => {
        return pubsub.asyncIterator(['BOOK_ADDED'])
    }
}

module.exports = {addBook, bookAdded, deleteBook, reserveBook}
