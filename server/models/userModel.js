const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userModel = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String, 
        required: true
    },
    pic: {
        type: String,
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    },

}, {timestamps: true})

userModel.pre('save', async function (next) {
    if (!this.modified) {
        next()
    }
    const salted = await bcrypt.genSaltSync(10)
    this.password = await bcrypt.hash(this.password, salted)
})

const User = mongoose.model('User', userModel)

module.exports = User