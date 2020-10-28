
const debug = require('debug')('app:routes:handle_form')
const bot  = require('../extensions/contactbot')
const db = require('../models')
const { validateUrl,mailer } = require('../lib')

let handle_form = (req, res) => {
  debug(req.headers)
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
      },
      {
        model: db.preference,
        as: 'preference'
      }],
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    })
    .then(website => {
      let userId = website.userId
      let telegramId = website.telegramId
      let url = website.url
      let headers = req.headers
      
      if (!validateUrl(headers.referer,headers.origin,url)){
        res.status(200).json({message:'Form domain is invalid'})
        return  
      }else{
        let message = `<b>Form: </b>${url}\n<b>Name: </b>${req.body.name}\n<b>Email: ${req.body.replyto}</b>
      <i>${req.body.message}</i>`

        debug('Prefence: ', JSON.stringify(website.preference))
        if (website.preference.sendMail) {
          const mailOptions = {
            from: 'Telecontact <no-reply@telecontact.me>',
            to: website.user.email,
            subject: 'Someone wants to contact with you.',
            text: req.body.name + '\n' + req.body.message + `\n\n Your are getting this mail from ${url}`,
            html: `<b>${req.body.name}<b><i>${req.body.message}<i> <br> Your are getting this mail from ${url}` // html body
          }
          mailer.sendMail(mailOptions)
        }
        if (website.preference.saveMessage) {
          db.message.create({
            name: req.body.name,
            email: req.body.replyto,
            message: req.body.message,
            formId,
            userId,
          }).catch(() => {
            if(website.preference.tNotification){
              bot.sendMessage(userId, 'Sorry! We could not save last message we send!')
            }
            return res.status(404)
          })
          website.increment('messageCount')
          debug('Message Count:', website.messageCount)  
        }
        if(website.preference.tNotification){
          if(telegramId!==undefined || telegramId!=null){
            debug('TelegramId',telegramId)
            bot.sendMessage(telegramId, message, { parse_mode: 'html' })
          }
        }
        res.sendStatus(200)
      }
    })
    .catch((err) => {
      debug(err)
      res.sendStatus(500)
    })
}

exports.handle_form = handle_form