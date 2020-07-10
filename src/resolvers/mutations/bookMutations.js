const Book = require("../../models/book")
const Author = require("../../models/author")
const {UserInputError, AuthenticationError, PubSub} = require('apollo-server');
const pubsub = new PubSub()

const addBook = async (root, args, context) => {
    if (!context.currentUser)
        throw new AuthenticationError("not authenticated")
    if(context.currentUser.username!=='admin')
        throw new AuthenticationError("not authorized")
    let author = await Author.findOne({name: args.author})
    if (!author) {
        const newAuthor = new Author({name: args.author})
        author = await newAuthor.save()
            .catch(error => {
                throw new UserInputError(error.message, {
                    invalidArgs: args,
                })
            })
    }
    let book = await new Book({...args, author: author._id, borrower: null})

    let savedBook = await book.save()
        .catch(async error => {
                console.log("ERROR", error)
                await Author.findByIdAndDelete(author._id)
                throw new UserInputError(error.message, {invalidArgs: args})
            }
        )
    savedBook.author = author
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

const setBorrower = (root, args, context) => {
    if (!context.currentUser)
        throw new AuthenticationError("not authenticated")

}

const bookAdded = {
    subscribe: () => {
        return pubsub.asyncIterator(['BOOK_ADDED'])
    }
}

module.exports = {addBook, bookAdded, deleteBook, setBorrower}
