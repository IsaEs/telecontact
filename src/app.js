const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
let app = express()
let validation = require('./middlewares/validateRequest')
const rateLimiter = require('express-rate-limit')

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
})

const asterisk = '*'
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())


const bot  = require('./extensions/contactbot')
// Activate Telegram Bot
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN
if (TELEGRAM_TOKEN != '') {
  // Telegram bot receiving updates at the route below
  app.post(`/bot${TELEGRAM_TOKEN}`, (req, res) => {
    bot.processUpdate(req.body)
    res.sendStatus(200)
  })
}
// All Bot Events
require('./extensions/contactbot/bot_events') 


app.all(asterisk, require('./middlewares/crossOrigin'))
app.all(asterisk, validation.verify)
app.all('/api/v1/user*', validation.block)

// Api 
app.use('/api/v1', require('./routes/auth'))
app.use('/api/v1/user', require('./routes/main'))
app.use('/api/v1/user', require('./routes/messages'))
app.use('/api/v1/user', require('./routes/prefs'))
app.use('/api/v1/user', require('./routes/form'))
app.use('/api/v1', require('./routes/submission'))
app.use('/api/v1', require('./routes/healtcheck'))
app.use('/api/v1/form', apiLimiter)

// Disable powered by express header
app.disable('x-powered-by')

app.get('/', function (req, res) {
  res.status(400).end()
})

module.exports = app