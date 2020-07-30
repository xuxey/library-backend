const Book = require("../../models/book")
const User = require("../../models/user")
const Log = require("../../models/log")
const {UserInputError, AuthenticationError, PubSub} = require('apollo-server');
const pubsub = new PubSub()

const addBook = async (root, args, context) => {
    if (!context.currentUser)
        throw new AuthenticationError("You must be logged in")
    if(context.currentUser.username!=='admin')
        throw new AuthenticationError("You are not authorized")
    let book = await new Book({...args, borrower: null})
    let savedBook = await book.save()
        .catch(async error => {
                console.log("ERROR", error)
                throw new UserInputError(error.message, {invalidArgs: args})
            }
        )
    const log = new Log({
        book: book._id,
        user: context.currentUser._id,
        type: "NEW_BOOK",
        time: String(Date.now())
    })
    await log.save()
    await pubsub.publish('BOOK_ADDED', {bookAdded: savedBook})
    return savedBook
}

const deleteBook = async (root, args, context) => {
    if (!context.currentUser)
        throw new AuthenticationError("You must be logged in")
    if(context.currentUser.username!=='admin')
        throw new AuthenticationError("You are not authorized")
    await Book.findByIdAndDelete(args.id)
    return args.id
}

const reserveBook = async (root, args, context) => {
    if (!context.currentUser)
        throw new AuthenticationError("You must be logged in")
    const book = await Book.findById(args.id)
    book.borrower = context.currentUser._id
    const user = context.currentUser
    user.borrowedBooks = user.borrowedBooks.concat(book._id)
    const log = new Log({
        book: book._id,
        user: user._id,
        type: "BOOK_RESERVE",
        time: String(Date.now())
    })
    await user.save()
    await book.save()
    await log.save()
    return Book.findById(args.id)
        .populate('borrower').exec()
}

const setAvailable = async (root, {id}, context) => {
    if (!context.currentUser)
        throw new AuthenticationError("You must be logged in")
    if(context.currentUser.username!=='admin')
        throw new AuthenticationError("You are not authorized")
    const book = await Book.findById(id)
    const user = await User.findById(book.borrower._id)
    book.borrower=null
    user.borrowedBooks = user.borrowedBooks.filter(id => id === book._id)
    const log = new Log({
        book: book._id,
        user: user._id,
        type: "SET_AVAILABLE",
        time: String(Date.now())
    })
    await user.save()
    await book.save()
    await log.save()
    return Book.findById(id)
        .populate('borrower')
}
const toggleWishlist = async (root, args, context) => {
    if (!context.currentUser)
        throw new AuthenticationError("You must be logged in")
    const book = await Book.findById(args.id)
    const user = context.currentUser
    let returnVal
    if(user.wishlist.includes(book._id)) {
        user.wishlist = user.wishlist.filter(id => id === book._id)
        returnVal = 'Removed'
    }
    else {
        user.wishlist.push(book._id)
        returnVal = 'Added'
    }
    await user.save()
    return returnVal
}

const bookAdded = {
    subscribe: () => {
        return pubsub.asyncIterator(['BOOK_ADDED'])
    }
}

module.exports = {addBook, bookAdded, deleteBook, reserveBook, setAvailable, toggleWishlist}
