let db = require('../models/index')
const debug = require('debug')('app:routes:main')
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


exports.addForm = addForm
exports.deleteForm = deleteForm
exports.getUserForms = getUserForms