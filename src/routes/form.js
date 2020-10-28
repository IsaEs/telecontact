const router = require('express').Router()
const formController = require('../controllers/FormController')

router.post('/form/:formid',formController.handle_form)

module.exports = router