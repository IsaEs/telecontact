let express = require('express')
let router = express.Router()
const dform = require('debug')('app:routes:handle_form')
const { bot } = require('../lib')
const db = require('../models')
//const { mailer } = require('../lib')


let handle_form = (req, res) => {
  dform(req.body)
  if (!req.body.name || !req.body.replyto) {
    res.status(500).send({ error: 'You have to set the parameters correctly.' })
    return
  }
  if (!req.body.message) {
    res.status(500).send({ error: 'You have to set an  empty message.' })
    return
  }
  let formId = req.params.formid

  // Todo check form identity
  db
    .website
    .findOne({
      where: { formId },
      include: [{
        model: db.user,
        as: 'user',
        attributes: ['email']
      }],
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    })
    .then(website => {
      let userId = website.userId
      let url = website.url
      let message = `<b>Form: </b>${url}\n<b>Name: </b>${req.body.name}\n<b>Email: ${req.body.replyto}</b>
      <i>${req.body.message}</i>`

      // const mailOptions = {
      //   from: '"USER" <USERMAIL>',
      //   to: .,
      //   subject: 'Some one wantsto contact ',
      //   text: '', // plain text body
      //   html: `` // html body
      // }
      // mailer.sendMail(mailOptions)

      db.message.create({
        name: req.body.name,
        email: req.body.replyto,
        message: req.body.message,
        formId,
        userId,
      }).catch(() => {
        bot.sendMessage(userId, 'Sorry! We could not save last message we send!')
      })

      bot.sendMessage(userId, message, { parse_mode: 'html' })
      res.sendStatus(200)
    })
    .catch(() => { res.sendStatus(500) })
}

router.post('/form/:formid', handle_form)
module.exports = router