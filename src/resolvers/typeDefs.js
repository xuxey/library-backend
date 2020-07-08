const {gql} = require('apollo-server')

const typeDefs = gql`
    type Author {
        name: String!
        _id: ID!
        born: Int
        bookCount: Int
    }
    type Book {
        price: Int!
        title: String!
        borrower: User!
        author: Author!
        _id: ID!
        genres: [String!]!
        available: Boolean
    }
    type Query {
        bookCount: Int!
        authorCount: Int!
        allBooks(author: String, genre: String): [Book!]!
        allAuthors: [Author!]!
        me: User
    }
    type User {
        phoneNumber: String!
        apartmentWing: String!
        apartmentNumber: Int!
        username: String!
        password: String!
        borrowedBooks: [Book!]!
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
        editAuthor(
            name: String!
            setBornTo: Int!
        ) : Author
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
    }
    type Subscription {
        bookAdded: Book!
    }
`

module.exports = typeDefs
