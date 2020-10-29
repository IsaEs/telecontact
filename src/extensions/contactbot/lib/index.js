process.env.NTBA_FIX_319 = 1
const { telegram_config } = require('../../../config')
const telegramBot = require('node-telegram-bot-api')
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN
let bot = new telegramBot(TELEGRAM_TOKEN)
const CI_URL = telegram_config[process.env.NODE_ENV]
if (process.env.NODE_ENV == 'development') {
  bot = new telegramBot(TELEGRAM_TOKEN, { polling: true })
} else if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
  bot.setWebHook(`${CI_URL}/bot${TELEGRAM_TOKEN}`)
}

module.exports = bot
