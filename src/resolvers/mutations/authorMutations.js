const Author = require("../../models/author")
const {AuthenticationError} = require('apollo-server');

const editAuthor = async (root, args, context) => {
    if (!context.currentUser)
        throw new AuthenticationError("not authenticated")
    const author = await Author.findOne({name: args.name})
    if (!author) return null
    author.born = args.setBornTo
    return author.save()
        .catch(error => {
            throw new UserInputError(error.message, {
                invalidArgs: args,
            })
        })
}

module.exports = {editAuthor}
