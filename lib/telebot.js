const telegramBot = require('node-telegram-bot-api')
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN
let bot = new telegramBot(TELEGRAM_TOKEN)
process.env.NTBA_FIX_319 = 1

if (process.env.ENV == 'development') {
  bot = new telegramBot(TELEGRAM_TOKEN, { polling: true })
} else if (process.env.ENV == 'production') {
  const CI_URL = 'https://teleform.isadural.ga'
  bot.setWebHook(`${CI_URL}/bot${TELEGRAM_TOKEN}`)
}

module.exports = bot
