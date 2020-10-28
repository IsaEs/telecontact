let express = require('express')
let router = express.Router()
let db = require('../models/index')
const debug = require('debug')('app:routes:main')
const { mailer } = require('../lib')
const { nanoid } = require('nanoid')

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
  if (!req.body.preference || (!req.body.preference.saveMessage && !req.body.preference.sendMail) ) {
    res.status(500).send({ error: 'You have  to set at least on preferences.' })
    return
  }
  let prefs = req.body.preference

  if (prefs.sendMail) defaults.sendMail = prefs.sendMail
  if (prefs.saveMessage) defaults.saveMessage = prefs.saveMessage

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

let addForm =(req,res)=>{
  let userId =  req.user.id
  let formId = nanoid(12)
  if (!req.body.domain) {
    res.status(500).send({ error: 'You have to set the domain name.' })
    return
  }
  let url = req.body.domain
  db.website
    .create({ url, formId, userId })
    .then(() => {
      db.preference.create({ formId, userId })
      res.status(200).send({ url,formId })
    })
    .catch((err) => {
      debug(err)
      res.status(200).send({ msg: 'Error while adding ' })
    })
}

router.get('/profile',getProfile)
router.get('/forms', getUserForms)
router.get('/preferences', getPreferences)
router.put('/preferences', updateUserPreferences)
router.put('/email', updateEmail)
router.post('/forms', deleteForm)
router.put('/form/add', addForm)

module.exports = router