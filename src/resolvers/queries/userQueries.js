const {AuthenticationError} = require('apollo-server');

const User = require("../../models/user")
const jwt = require('jsonwebtoken')
const config = require('../../utils/config')

const me = (root, args, context) => {
    console.log("context ", context)
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

const allUsers = async (root, args, context) => {
    if (!context.currentUser)
        throw new AuthenticationError("You must be logged in")
    if(context.currentUser.username!=='admin')
        throw new AuthenticationError("You are not authorized")
    return User.find({})
        .populate('borrowedBooks')
        .populate('wishlist').exec()
}

const nameExists = async (root, {name}, context) => {
    const users = await User.find({username: name})
    if(users.length>0)
        return "exists"
    else
        return "available"
}

module.exports = {me, getContext, allUsers, nameExists}
