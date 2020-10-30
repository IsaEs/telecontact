let db = require('../models/index')
const debug = require('debug')('app:routes:domain')
const { nanoid } = require('nanoid')
const isValidDomain = require('is-valid-domain')

let getUserForms = async (req, res) => {
  let where = { userId: req.user.id }
  let attributes = { exclude: ['createdAt', 'userId'] }
  try {
    let message = await db.website.findAll({where,attributes})
    return res.status(200).json(message) 
  } catch (error) {
    return res.status(500).json({ msg: 'Error while getting forms' }) 
  }
}

let getUserFormById = async (req, res) => {
  let where = { userId: req.user.id, formId: req.params.formId }
  let attributes = { exclude: ['createdAt', 'userId','formId'] }
  let include  = [{
    model:db.preference,
    as:'preference',
    attributes: ['sendMail','tNotification','saveMessage']
  },
  {
    model:db.message,
    as:'messages',
    attributes
  }]
  try {
    let message = await db.website.findOne({where,attributes,include})
    if(message===null){
      return res.sendStatus(204) 
    }
    return res.status(200).json(message) 
  } catch (error) {
    debug(error)
    return res.status(500).json({ msg: 'Error while getting form' }) 
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
    res.status(500).send({ msg: 'Error while deleting form' })
  }
}

let addForm = async (req,res)=>{
  let userId =  req.user.id
  let formId = nanoid(12)
  if (!req.body.domain || !req.body.name) {
    res.status(400).send({ msg: 'You have to set the domain name.' })
    return
  }
  let url = req.body.domain
  let domainName = req.body.name
  if(!isValidDomain(url, {subdomain: false})){
    res.status(400).send({ msg: 'You domain name is not valid.' })
    return
  }
 
  try {
    let website = await db.website.create({ url, domainName , formId, userId })
    debug(JSON.stringify(website))
    let prefs = await db.preference.create({ formId, userId })
    res.status(201).send({ url,formId, prefs })
  } catch (error) {
    debug(error)
    res.status(500).send({ msg: 'Error while adding form' })
  }
}


let updateForm = async (req,res)=>{
  if (!req.body.formId) {
    res.status(400).send({ msg: 'You have to set formId.' })
    return
  }
  if (!req.body.name && ! req.body.domain ) {
    res.status(400).send({ msg: 'You have  to set at least on preferences.' })
    return
  }
  
  try {
    let data = await db.website.update({domainName: req.body.name}, {where: {formId: req.body.formId}})
    if (data[0]===0){
      res.status(404).send({ msg: 'We didn`t found any matched record.' })
      return
    }
    res.sendStatus(201)
  } catch (error) {
    debug(error)
    res.status(500).json({ msg: 'Error while updating!'})
  }
}

exports.addForm = addForm
exports.deleteForm = deleteForm
exports.getUserForms = getUserForms
exports.updateForm = updateForm
exports.getUserFormById = getUserFormById