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

let deleteForm = async (req, res) => {
  if (!req.body.formId) {
    res.status(500).send({ error: 'You have to set the formId.' })
    return
  }

  let where = { formId: req.body.formId, userId: req.user.id }
  try {
    await db.website.destroy({where})
    res.status(204).send({ msg: 'Form Deleted' })
  } catch (error) {
    res.status(200).send({ msg: 'Error while deleting form' })
  }
}

let addForm = async (req,res)=>{
  let userId =  req.user.id
  let formId = nanoid(12)
  if (!req.body.domain) {
    res.status(500).send({ error: 'You have to set the domain name.' })
    return
  }
  let url = req.body.domain

  try {
    let website = await db.website.create({ url, formId, userId })
    debug(JSON.stringify(website))
    let prefs = await db.preference.create({ formId, userId })
    res.status(201).send({ url,formId, prefs })
  } catch (error) {
    debug(error)
    res.status(200).send({ msg: 'Error while adding ' })
  }
}


let updateForm = async (req,res)=>{
  res.status(200).send({ msg: 'TODO update Form' })
}

exports.addForm = addForm
exports.deleteForm = deleteForm
exports.getUserForms = getUserForms
exports.updateForm = updateForm