let router = require('express').Router()
const domainController = require('../controllers/DomainController')

router.get('/forms', domainController.getUserForms)
router.post('/forms', domainController.deleteForm)
router.put('/form/add', domainController.addForm)

module.exports = router