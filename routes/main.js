let express = require('express')
let router = express.Router()
let db = require('../models/index')
const debug = require('debug')('app:routes:main')
const { mailer } = require('../lib')
const { nanoid } = require('nanoid')

let getUserMessages = (req, res) => {
  debug(req.user)
  db
    .message
    .findAll({
      where: { userId: req.user.id },
      attributes: { exclude: ['createdAt', 'userId'] }
    })
    .then(message => {
      return res.status(200).json(message)
    })
}

let getUserForms = (req, res) => {
  db
    .website
    .findAll({
      where: { userId: req.user.id },
      attributes: { exclude: ['createdAt', 'userId'] }
    })
    .then(message => {
      return res.status(200).json(message)
    })
}

let getPreferences = (req, res) => {
  db.preference
    .findAll({
      where: {userId: req.user.id},
      attributes: { exclude: ['createdAt', 'userId'] }
    })
    .then(message => {
      return res.status(200).json(message)
    })
}

let updateUserPreferences = (req, res) => {
  let defaults = {}
  if (!req.body.formId) {
    res.status(500).send({ error: 'You have to set formId.' })
    return
  }
  if (!req.body.sendMail && !req.body.saveMessage) {
    res.status(500).send({ error: 'You have  to set at least on preferences.' })
    return
  }
  if (req.body.sendMail) defaults.sendMail = req.body.sendMail
  if (req.body.saveMessage) defaults.saveMessage = req.body.saveMessage

  defaults.userId = req.user.id
  defaults.formId = req.body.formId

  db.preference.upsert(defaults)
  return res.status(200).json({ status: 'okay' })
}

let updateEmail = (req, res) => {
  debug(req.user)
  if (!req.body.email) {
    res.status(500).send({ error: 'You have to set the email or username.' })
    return
  }
  //TODO check email is valid or not
  let mailToken = nanoid(6)
  const mailOptions = {
    from: 'Telecontact <no-reply@telecontact.me>',
    to: req.body.email,
    subject: 'Verify your email!',
    text: `Enter this code to  ${mailToken} verify your email address`,
    html: `Enter this code to <b>${mailToken}</b> verify your email address.`
  }
  mailer.sendMail(mailOptions)

  let email = req.body.email
  let isEmailVerified = false
  db.user.updateFields(req.user.id, { email, isEmailVerified, mailToken })
  res.status(200).send({ msg: 'Email Updated' })
}

let deleteForm = (req, res) => {
  debug(req.user)
  debug(req.hostname)
  if (!req.body.formId) {
    res.status(500).send({ error: 'You have to set the formId.' })
    return
  }
  db.website
    .destroy({
      where: {
        formId: req.body.formId,
        userId: req.user.id
      }
    })

  res.status(200).send({ msg: 'Form Updated' })
}

let deleteMessages = (req, res) => {
  debug(req.user)
  if (!req.body.formId) {
    res.status(500).send({ error: 'You have to set the formId.' })
    return
  }
  if (!req.body.messages) {
    res.status(500).send({ error: 'You need to set at least one message id.' })
    return
  }
  let Op = db.Sequelize.Op
  let messages = req.body.messages
  let where = {}
  if (Array.isArray(messages)) {
    where = {
      formId: req.body.formId,
      id: { [Op.in]: messages }
    }
  } else {
    where = {
      formId: req.body.formId,
      id: messages
    }
  }

  db.message.destroy({ where }).then((data) => {
    debug(data)
    res.status(200).send({ msg: 'Updated' })
  })
}

let getProfile = (req, res) => {
  debug(req.user)
  db
    .user
    .findOne({
      where: { id: req.user.id },
      include:[{
        model:db.website,
        include:[{
          model:db.preference,
          as:'preference',
          attributes: ['sendMail','saveMessage']
        }],
        attributes:{exclude: ['userId','createdAt', 'updatedAt']},
        as:'websites'
      }],
      attributes: { exclude: ['password_hash','mailToken','createdAt', 'updatedAt'] }
    })
    .then(message => {
      return res.status(200).json(message)
    })
}

router.get('/profile',getProfile)
router.get('/messages', getUserMessages)
router.get('/forms', getUserForms)
router.get('/preferences', getPreferences)
router.put('/preferences', updateUserPreferences)
router.put('/email', updateEmail)
router.post('/forms', deleteForm)
router.post('/messages', deleteMessages)

module.exports = router