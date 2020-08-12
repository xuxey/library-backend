const {ApolloServer} = require('apollo-server')
const typeDefs = require('./resolvers/typeDefs')
const bookMutations = require("./resolvers/mutations/bookMutations")
const userMutations = require("./resolvers/mutations/userMutations")
const bookQueries = require("./resolvers/queries/bookQueries")
const logQueries = require("./resolvers/queries/logQueries")
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
        deleteBook: bookMutations.deleteBook,
        register: userMutations.register,
        login: userMutations.login,
        changePassword: userMutations.changePassword,
        reserveBook: bookMutations.reserveBook,
        setAvailable: bookMutations.setAvailable,
        toggleBookWishlist: bookMutations.toggleWishlist,
        sendSMS: userMutations.sendSMS,
        verifySMS: userMutations.verifySMS
    },
    Query: {
        bookCount: bookQueries.bookCount,
        allBooks: bookQueries.allBooks,
        allLogs: logQueries.allLogs,
        allUsers: userQueries.allUsers,
        bookById: bookQueries.bookById,
        me: userQueries.me,
        nameExists: userQueries.nameExists,
        phoneLimitReached: userQueries.phoneLimitReached,
    },
    Subscription: {
        bookAdded: bookMutations.bookAdded
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: userQueries.getContext,
    engine: {
        reportSchema: true
    }
})

server.listen({ port: process.env.PORT || 4000 }).then(({url}) => {
    console.log(`Server ready at ${url}`)
})
