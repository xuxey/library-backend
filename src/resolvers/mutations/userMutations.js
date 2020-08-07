const User = require("../../models/user")
const Log = require("../../models/log")
const {UserInputError,AuthenticationError} = require('apollo-server');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const config = require('../../utils/config')
const twilio = require('twilio');

const register = async (root, args) => {
    if (args.password.length < 5)
        throw new UserInputError('Password is too short, minimum length: 5 characters', {invalidArgs: args})
    const passwordHash = await bcrypt.hash(args.password, 10)
    const user = new User({
        username: args.username,
        passwordHash,
        apartmentWing: args.apartmentWing,
        apartmentNumber: args.apartmentNumber,
        phoneNumber: args.phoneNumber,
        borrowedBooks: []
    })
    console.log(user)
    let newUser = await user.save()
    console.log(newUser)
    const userForToken = {
        username: newUser.username,
        _id: newUser._id,
    }
    const log = new Log({
        book: null,
        user: user._id,
        type: "USER_REGISTERED",
        time: String(Date.now())
    })
    await log.save()
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

const changePassword = async (root, {username, oldPassword, newPassword}, context) => {
    if (!context.currentUser)
        throw new AuthenticationError("You must be logged in")
    if(context.currentUser.username!=='admin')
        throw new AuthenticationError("You are not authorized")
    const user = User.findOne({username})
    const passwordCorrect = await bcrypt.compare(oldPassword, user.passwordHash)
    if (!passwordCorrect)
        throw ('password is incorrect')
    if (newPassword.length < 5)
        throw new UserInputError('Password is too short, minimum length: 5 characters', {invalidArgs: newPassword})
    const passwordHash = await bcrypt.hash(newPassword, 10)
    const newUser = {
        ...user,
        passwordHash
    }
    await User.findByIdAndUpdate(user._id, newUser)
    return "success"
}

const sendSMS = async (root, {phone}, context) => {
    const accountSid = process.env.ACCOUNT_SID; // Your Account SID from www.twilio.com/console
    const authToken = process.env.AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console
    const client = new twilio(accountSid, authToken);

    const result = await client.verify.services(process.env.SERVICE_SID)
        .verifications
        .create({to: phone, channel: 'sms'})
    console.log("RESULT", result)
    return result.sid
}

const verifySMS = async (root, {phone, code}, context) => {
    const accountSid = process.env.ACCOUNT_SID; // Your Account SID from www.twilio.com/console
    const authToken = process.env.AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console
    const client = new twilio(accountSid, authToken);

    const result = await client.verify.services(process.env.SERVICE_SID)
        .verificationChecks
        .create({to: phone, code})
    console.log("RESULT", result)
    return result.status
}

module.exports = {register, login, changePassword, sendSMS, verifySMS}
