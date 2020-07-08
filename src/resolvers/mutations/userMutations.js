const User = require("../../models/user")
const {UserInputError} = require('apollo-server');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const config = require('../../utils/config')

const register = async (root, args) => {
    if (args.password.length < 5)
        throw new UserInputError('Password is too short, minimum length: 5 characters', {invalidArgs: args})
    const passwordHash = await bcrypt.hash(args.password, 10)
    const user = new User({
        username: args.username,
        passwordHash,
        apartmentWing: args.apartmentWing,
        apartmentNumber: args.apartmentNumber,
        phoneNumber: args.phoneNumber
    })
    console.log(user)
    let newUser = await user.save()
    console.log(newUser)
    const userForToken = {
        username: newUser.username,
        _id: newUser._id,
    }
    newUser.token = jwt.sign(userForToken, config.SECRET)
    return newUser
}


const login = async (root, {username, password}) => {
    const user = await User.findOne({username})
    if (!user)
        throw ('username does not exist')
    const passwordCorrect = await bcrypt.compare(password, user.passwordHash)
    if (!passwordCorrect)
        throw ('password is incorrect')
    const userForToken = {
        username: user.username,
        _id: user._id,
    }

    const token = jwt.sign(userForToken, config.SECRET)
    return {
        token,
        username: user.username,
        id: user._id
    }
}

module.exports = {register, login}
