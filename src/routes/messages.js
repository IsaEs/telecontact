const router = require('express').Router()
const messageController = require('../controllers/MessageController')

router.get('/messages', messageController.getUserMessages)
router.post('/messages', messageController.deleteMessages)

module.exports = router