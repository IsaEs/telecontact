let db = require('../models/index')
const debug = require('debug')('app:routes:main')


let getUserMessages = (req, res) => {
  debug(req.user)
  db
    .message
    .findAll({
      where: { userId: req.user.id },
      attributes: { exclude: ['createdAt', 'userId'] },
      include: [{
        model: db.website,
        as: 'website',
        attributes: ['url']
      }]
    })
    .then(message => {
      return res.status(200).json(message)
    })
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


exports.getUserMessages = getUserMessages
exports.deleteMessages = deleteMessages