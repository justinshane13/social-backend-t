const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

// static signup method
userSchema.statics.signup = async function (username, password) {
    // validation
    if (!username || !password) {
        throw Error('All fields must be filled')
    }
    if (!validator.isStrongPassword(password)) {
        throw Error('Password not strong enough')
    }

    //check that username is not already in use
    const exists = await this.findOne({ username })
    if (exists) {
        throw Error('Username is already in use')
    }

    // create salt and hash of password
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    // create user using login credentials
    const user = await this.create({ username, password: hash })

    return user
}

// static login method
userSchema.statics.login = async function(username, password) {
    // validation
    if (!username || !password) {
        throw Error('All fields must be filled')
    }

    // check that username is not already in use
    const user = await this.findOne({ username })
    if (!user) {
        throw Error('Incorrect email')
    }

    const matches = await bcrypt.compare(password, user.password)

    if (!matches) {
        throw Error('Incorrect password')
    }
 
    return user
}

module.exports = mongoose.model('User', userSchema)