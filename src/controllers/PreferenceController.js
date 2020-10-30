let db = require('../models/index')

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
    res.status(400).send({ msg: 'You have to set formId.' })
    return
  }
  if (!req.body.preference || (!req.body.preference.saveMessage && !req.body.preference.sendMail) ) {
    res.status(400).send({ msg: 'You have  to set at least on preferences.' })
    return
  }
  let prefs = req.body.preference

  if (prefs.sendMail) defaults.sendMail = prefs.sendMail
  if (prefs.saveMessage) defaults.saveMessage = prefs.saveMessage

  defaults.userId = req.user.id
  defaults.formId = req.body.formId

  db.preference.upsert(defaults)
  return res.status(200).json({ msg: 'Preference Created' })
}

exports.getPreferences = getPreferences
exports.updateUserPreferences = updateUserPreferences