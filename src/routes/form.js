const router = require('express').Router()
const submissionController = require('../controllers/SubmissionController')

router.post('/form/:formid',submissionController.handle_form)

module.exports = router