let db = require('../models/index')
const debug = require('debug')('app:routes:main')


let getUserMessages = async (req, res) => {
  debug(req.user)
  try {
    let message = await db
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
    res.status(200).json(message)
  } catch (error) {
    debug(error)
    res.status(500).send({ msg: 'Error while getting messages' })
  }
}

let deleteMessages = async (req, res) => {
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
  try {
    await db.message.destroy({ where })
    res.status(200).send({ msg: 'Updated' })
  } catch (error) {
    debug(error)
    res.status(500).send({ msg: 'Error while deleting and object' })
  }
}


exports.getUserMessages = getUserMessages
exports.deleteMessages = deleteMessages