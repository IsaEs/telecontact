
const { v4: uuidv4 } = require('uuid')
const db = require('../models/index')
const util = require('../lib/index')
const debug = require('debug')('app:events:bot')
const bot = require('../lib/telebot')

bot.on('message', onMessage)
bot.on('polling_error', onPollingError)
bot.onText(/\/addform/, commandAddForm)
bot.onText(/\/listform/, commandListForm)
bot.onText(/\/setemail/, commandSetEmail)
bot.onText(/\/setpassword/, commandSetPassword)

function onMessage(msg) {
  debug(`[${util.formattedTime(msg.date)}] Message (${msg.message_id}) received from @${msg.from.username} (${msg.from.id})`)
  //debug(msg)
}

function commandListForm(msg, match) {
  debug(match)

  db
    .website
    .findAll({ where: { userId: msg.from.id } })
    .then(websites => {
      if (websites == null) {
        sendMessage('You did\'not set any form yet')
      } else {
        websites.forEach(record => {
          let message = `Site:  ${record.url} FormID: ${record.formId}`
          sendMessage(msg.chat.id, message)
        })

      }
      return
    }).error(err => { debug('Err', err); sendMessage(msg.chat.id, 'Something went wrong') })

}

function commandAddForm(msg, match) {
  debug(match)
  let url = match['input'].split(' ')[1]
  if (url == undefined) {
    sendMessage(msg.from.id, 'You need to define url for your form')
    return
  }
  let formId = uuidv4()
  let confirmMsg = `Site:  ${url} FormID: ${formId}`
  db
    .user
    .findOne({ where: { id: msg.from.id } })
    .then(user => {
      debug(user)
      if (user == null) {
        db
          .user
          .create({
            id: msg.from.id,
            first_name: msg.from.first_name,
            username: msg.from.username,
            language_code: msg.from.language_code,
            email: '',
            password_hash: '',
            isDeleted: false
          })
          .then(() => { db.website.create({ url, formId, userId: msg.from.id }); sendMessage(msg.chat.id, confirmMsg) })
      } else {
        db.website.create({
          url,
          formId,
          userId: msg.from.id
        }).then(() => {
          sendMessage(msg.chat.id, confirmMsg)
        })
      }
      return
    }).error(err => { debug('Err', err); sendMessage('Something went wrong') })
}


function commandSetEmail(msg, match) {
  let email = match['input'].split(' ')[1]
  if (email == undefined) {
    sendMessage(msg.from.id, 'You need to define email after command')
    return
  }
  // TODO Email check
  updateUser(msg.from.id, { email })
}
function commandSetPassword(msg, match) {
  let password_hash = match['input'].split(' ')[1]
  if (password_hash == undefined) {
    sendMessage(msg.from.id, 'You need to define password after command')
    return
  }
  updateUser(msg.from.id, { password_hash })
}

function onPollingError(error) {
  debug(error)
}


function updateUser(id, fields) {
  db
    .user
    .findOne({ where: { id } })
    .then((result) => {
      result.update(fields)
    })
}

let sendMessage = (id, message) => {
  bot
    .sendMessage(id, message)
    .catch((error) => {
      debug(error.code)
      debug(error.response.body)
    })
}

