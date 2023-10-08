const jwt = require('jsonwebtoken')
const User = require("../models/userModel")
const asyncHandler = require("express-async-handler")

const authorize = asyncHandler(async (req, res, next) => {
    let token

    if (
        res.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(" ")[1]

            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await User.findByid(decoded.id).select("-password")
            next()
        } catch (error) {
            res.status(401)
            throw new Error ("Not authorized")
        }
    }
})

module.exports = {authorize}