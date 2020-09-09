let express = require('express')
let router = express.Router()
let db = require('../models/index')
const debug = require('debug')('app:routes:main')

let getUserMessages = (req, res) => {
  debug(req.user)
  db
    .message
    .findAll({
      where: { userId: req.user.id },
      attributes: { exclude: ['createdAt', 'id', 'userId'] }
    })
    .then(message => {
      return res.status(200).json(message)
    })
}
let updateUserPreferences = (req, res) => {
  return res.status(200).json({ status: 'okay' })
}

let updateEmail = (req, res) => {
  debug(req.user)
  if (!req.body.email == undefined) {
    res.status(500).send({ error: 'You have to set the email or username.' })
    return
  }
  let email = req.body.email
  db.user.updateFields(req.user.id, { email })
  res.status(200).send({ msg: 'Email Updated' })
}

router.get('/messages', getUserMessages)
router.put('/preferences', updateUserPreferences)
router.put('/email', updateEmail)

module.exports = router