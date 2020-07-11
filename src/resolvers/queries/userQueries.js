const User = require("../../models/user")
const jwt = require('jsonwebtoken')
const config = require('../../utils/config')

const me = (root, args, context) => {
    return User.findById(context.currentUser._id)
        .populate('borrowedBooks')
        .populate('wishlist').exec()
}

const getContext = async ({req}) => {
    let auth = req ? req.headers.authorization : null
    if (!auth) return null;
    if (auth.toLowerCase().startsWith('bearer '))
        auth = auth.substring(7)
    const decodedToken = jwt.verify(auth, config.SECRET)
    const currentUser = await User.findById(decodedToken._id)
    return {currentUser}
}

module.exports = {me, getContext}
