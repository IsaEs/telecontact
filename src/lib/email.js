const { mail_config } = require('../config')
const nodeMailer = require('nodemailer')
const transporter = nodeMailer.createTransport(mail_config)
const sendGridMailer = require('@sendgrid/mail')
const debug = require('debug')('app:lib:email')
if (process.env.SENDGRID_API_KEY) {
  sendGridMailer.setApiKey(process.env.SENDGRID_API_KEY)
}


let sendMail = async (mailOptions, type = 'sendGrid') => {
  if (type == 'sendGrid') {
    sendGridMailer.send(mailOptions)
  } else {
    transporter.sendMail(mailOptions, (error, info) => {
      debug(info)
      if (error) {
        debug(error)
      } else {
        debug('Email sended successfly.')
      }
    })
  }
}

exports.sendMail = sendMail