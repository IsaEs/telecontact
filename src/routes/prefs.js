let router = require('express').Router()
const preferenceController = require('../controllers/PreferenceController')

router.get('/preferences', preferenceController.getPreferences)
router.put('/preferences', preferenceController.updateUserPreferences)

module.exports = router