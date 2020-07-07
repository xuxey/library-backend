const {ApolloServer} = require('apollo-server')
const typeDefs = require('./resolvers/typeDefs')
const bookMutations = require("./resolvers/mutations/bookMutations")
const authorMutations = require("./resolvers/mutations/authorMutations")
const userMutations = require("./resolvers/mutations/userMutations")
const bookQueries = require("./resolvers/queries/bookQueries")
const authorQueries = require("./resolvers/queries/authorQueries")
const userQueries = require("./resolvers/queries/userQueries")
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')

mongoose.connect(config.LIBRARY_MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => logger.info('connected to MongoDB - Blogs - ' + config.LIBRARY_MONGO_URI))
    .catch((error) => logger.error('error connection to MongoDB:', error.message))

const resolvers = {
    Mutation: {
        addBook: bookMutations.addBook,
        editAuthor: authorMutations.editAuthor,
        createUser: userMutations.createUser,
        login: userMutations.login
    },
    Query: {
        bookCount: bookQueries.bookCount,
        allBooks: bookQueries.allBooks,
        authorCount: authorQueries.authorCount,
        allAuthors: authorQueries.allAuthors,
        me: userQueries.me
    },
    Subscription: {
        bookAdded: bookMutations.bookAdded
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: userQueries.getContext
})

server.listen().then(({url, subscriptionsUrl}) => {
    console.log(`Server ready at ${url}`)
    console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})
