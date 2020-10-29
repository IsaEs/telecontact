let router = require('express').Router()
const domainController = require('../controllers/DomainController')

router.get('/forms', domainController.getUserForms)
router.post('/forms', domainController.addForm)
router.put('/forms',domainController.updateForm)
router.delete('/forms', domainController.deleteForm)


module.exports = router