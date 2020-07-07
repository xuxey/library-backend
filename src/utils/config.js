require('dotenv').config()

let PORT = process.env.PORT
let SECRET = process.env.SECRET
let LIBRARY_MONGO_URI = process.env.LIBRARY_MONGO_URI
if (process.env.NODE_ENV === 'test') {
    LIBRARY_MONGO_URI = process.env.TEST_LIBRARY_MONGO_URI
}

module.exports = {
    LIBRARY_MONGO_URI,
    PORT,
    SECRET
}
