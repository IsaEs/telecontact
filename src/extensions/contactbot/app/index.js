
const express = require('express')
let app = express()

// Telegram extension 
const bot  = require('../lib')
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
require('../events/bot_events') 

module.exports = app