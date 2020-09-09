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
  'username': 'isaes',
  'password': 'klmnbh123',
  'database': 'teleform-db',
  'options': {
    'host': '127.0.0.1',
    'dialect': 'postgres'
  }
}