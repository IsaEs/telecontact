const dotnev = require('dotenv')
dotnev.config()

exports.mail_config = {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
}

exports.db_config = {
  'username': process.env.DB_USER,
  'password': process.env.DB_PASS,
  'database': process.env.DB_NAME,
  'options': {
    'host': process.env.DB_HOST,
    'dialect': process.env.DB_DIAL
  }
}

exports.telegram_config = {
  'test': 'https://teleform.isadural.ga',
  'production': 'https://api.telecontact.me',
}