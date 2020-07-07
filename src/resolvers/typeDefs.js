const {gql} = require('apollo-server')

const typeDefs = gql`
    type Author {
        name: String!
        _id: ID!
        born: Int
        bookCount: Int
    }
    type Book {
        title: String!
        published: Int!
        author: Author!
        _id: ID!
        genres: [String!]!
    }
    type Query {
        bookCount: Int!
        authorCount: Int!
        allBooks(author: String, genre: String): [Book!]!
        allAuthors: [Author!]!
        me: User
    }
    type User {
        username: String!
        favoriteGenre: String!
        password: String!
        id: ID!
        token: String
    }
    type Mutation {
        addBook(
            title: String!
            author: String!
            published: Int!
            genres: [String!]!
        ): Book
        editAuthor(
            name: String!
            setBornTo: Int!
        ) : Author
        createUser(
            username: String!
            password: String!
            favoriteGenre: String!
        ): User
        login(
            username: String!
            password: String!
        ): User
    }
    type Subscription {
        bookAdded: Book!
    }
`

module.exports = typeDefs
