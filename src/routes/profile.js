const router = require('express').Router()
const profileController = require('../controllers/ProfileController')

router.get('/profile', profileController.getProfile)
router.put('/email', profileController.updateEmail)

module.exports = router