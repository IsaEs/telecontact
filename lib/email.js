const nodeMailer = require('nodemailer')
const { mail_config } = require('../config')
const transporter = nodeMailer.createTransport(mail_config)
const debug = require('debug')('app:lib:email')

let sendMail = async (mailOptions) => {
  transporter.sendMail(mailOptions, (error, info) => {
    debug(info)
    if (error) {
      debug(error)
    } else {
      debug('Email sended successfly.')
    }
  })
}

let sendMailSync = (mailOptions) => {
  transporter.sendMail(mailOptions, (error, info) => {
    debug(info)
    if (error) {
      debug(error)
      return 404
    } else {
      debug('Email sended successfly.')
      return 200
    }
  })
}

exports.sendMail = sendMail
exports.sendMailSync = sendMailSync
