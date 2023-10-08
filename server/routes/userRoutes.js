const express = require('express')
const {registerUser, authUser, allUsers} = require('../controllers/userControllers')
const {authorize} = require('../middleware/authMiddleware')
const router = express.Router()

router.route('/').post(registerUser).get(authorize, allUsers)
router.post('/login', authUser)
router.route('/')

module.exports = router