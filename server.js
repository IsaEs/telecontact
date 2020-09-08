const dotnev = require('dotenv')
dotnev.config()
// const debug = require('debug')('app:server')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
let app = express()
const bot = require('./lib/telebot')

// const { v4: uuidv4 } = require('uuid')
// const db = require('./models/index')
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Allow Cors Manually
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers',
    'Origin,X-Requested-With,Authorization,Content-type,Accept,X-Access-Token'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
  } else {
    next()
  }
})

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN
if (TELEGRAM_TOKEN != '') {
  // Telegram bot receiving updates at the route below
  app.post(`/bot${TELEGRAM_TOKEN}`, (req, res) => {
    bot.processUpdate(req.body)
    res.sendStatus(200)
  })
}
require('./events/bot_events')

app.use('/', require('./routes/form'))
app.get('/', function (req, res) {
  res.status(400).end()
})

module.exports = app