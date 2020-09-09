const dotnev = require('dotenv')
dotnev.config()
// const debug = require('debug')('app:server')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
let app = express()
const bot = require('./lib/telebot')
const asterisk = '*'
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.all(asterisk, require('./middlewares/crossOrigin'))

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
require('./events/bot_events')

// Api 
app.use('/api/v1', require('./routes/login'))
app.use('/', require('./routes/form'))

app.get('/', function (req, res) {
  res.status(400).end()
})

module.exports = app