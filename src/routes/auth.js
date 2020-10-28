const express = require('express')
const router = express.Router()
const authController = require('../controllers/AuthController')

router.post('/signin', authController.user_signin)
router.post('/signup', authController.user_signup)

module.exports = router