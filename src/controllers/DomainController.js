let db = require('../models/index')
const debug = require('debug')('app:routes:main')
const { nanoid } = require('nanoid')
const isValidDomain = require('is-valid-domain')

let getUserForms = async (req, res) => {
  let where = { userId: req.user.id }
  let attributes = { exclude: ['createdAt', 'userId'] }
  try {
    let message = await db.website.findAll({where,attributes})
    return res.status(200).json(message) 
  } catch (error) {
    return res.status(200).json({ msg: 'Error while creating form' }) 
  }
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
  if (!req.body.domain || !req.body.name) {
    res.status(400).send({ error: 'You have to set the domain name.' })
    return
  }
  let url = req.body.domain
  let domainName = req.body.name
  if(!isValidDomain(url, {subdomain: false})){
    res.status(400).send({ error: 'You domain name is not valid.' })
    return
  }
 
  try {
    let website = await db.website.create({ url, domainName , formId, userId })
    debug(JSON.stringify(website))
    let prefs = await db.preference.create({ formId, userId })
    res.status(201).send({ url,formId, prefs })
  } catch (error) {
    debug(error)
    res.status(200).send({ msg: 'Error while adding form' })
  }
}


let updateForm = async (req,res)=>{
  let defaults = {}
  if (!req.body.formId) {
    res.status(500).send({ msg: 'You have to set formId.' })
    return
  }
  if (!req.body.name && ! req.body.domain ) {
    res.status(500).send({ msg: 'You have  to set at least on preferences.' })
    return
  }
  
  defaults.domainName = req.body.name
  defaults.domain = req.body.domain
  defaults.formId = req.body.formId

  try {
    await db.website.upsert(defaults)
    res.sendStatus(201)
  } catch (error) {
    res.status(200).json({ msg: 'Error while updating!'})
  }
}

exports.addForm = addForm
exports.deleteForm = deleteForm
exports.getUserForms = getUserForms
exports.updateForm = updateForm