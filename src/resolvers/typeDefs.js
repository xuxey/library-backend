const {gql} = require('apollo-server')

const typeDefs = gql`    
    type Book {
        price: Int!
        title: String!
        borrower: User
        author: String!
        _id: ID!
        genres: [String!]!
    }
    type Query {
        bookCount: Int!
        bookById(id: String): Book
        allBooks(author: String, genre: String): [Book!]!
        me: User!
    }
    type User {
        phoneNumber: String!
        apartmentWing: String!
        apartmentNumber: Int!
        username: String!
        password: String!
        borrowedBooks: [Book!]!
        wishlist: [Book!]!
        id: ID! 
        token: String
    }
    type Mutation {
        addBook(
            price: Int!
            title: String!
            author: String!
            genres: [String!]!
        ): Book
        deleteBook(
            id: String!
        ): String
        login(
            username: String!
            password: String!
        ): User
        register(
            username: String!
            password: String!
            apartmentWing: String!
            apartmentNumber: Int!
            phoneNumber: String!
        ): User
        changePassword(
            username: String!
            currentPassword: String!
            newPassword: String!
        ): String
        reserveBook(
            id: String!
        ): Book
        setAvailable(
            id: String!
        ): Book
    }
    type Subscription {
        bookAdded: Book!
    }
`

module.exports = typeDefs
