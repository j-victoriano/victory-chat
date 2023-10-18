const express = require('express')
const { accessChat, fetchChats, createGroupChat, renameChat, addToChat, removeFromChat} = require("../controllers/chatControllers")
const { protect } = require("../middleware/authMiddleware")

const router = express.Router()

router.route('/').post(protect, accessChat)
router.route('/').get(protect, fetchChats)
router.route('/group').post(protect, createGroupChat)
router.route('/rename').put(protect, renameChat)
router.route('/groupadd').put(protect, addToChat)
router.route('/groupremove').put(protect, removeFromChat)

module.exports = router