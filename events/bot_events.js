
const nanoid = require('nanoid')
const db = require('../models/index')
const { bot, formattedTime } = require('../lib')
const debug = require('debug')('app:events:bot')
const bcrypt = require('bcrypt')

bot.on('message', onMessage)
bot.on('polling_error', onPollingError)
bot.onText(/\/addform/, commandAddForm)
bot.onText(/\/listform/, commandListForm)
//bot.onText(/\/setemail/, commandSetEmail)
bot.onText(/\/setpassword/, commandSetPassword)

function onMessage(msg) {
  debug(`[${formattedTime(msg.date)}] Message (${msg.message_id}) received from @${msg.from.username} (${msg.from.id})`)
  //debug(msg)
}

function commandListForm(msg, match) {
  debug(match)

  db
    .website
    .findAll({ where: { userId: msg.from.id } })
    .then(websites => {
      let sites = 'You did\'not set any form yet'
      if (websites != null) {
        sites = ''
        websites.forEach(record => {
          let message = `Site:  ${record.url}\nFormID: ${record.formId}\n`
          sites += message
        })
      }

      sendMessage(msg.chat.id, sites)
      return
    }).catch(err => { debug('Err', err); sendMessage(msg.chat.id, 'Our servers not available right now. Please try again later.') })

}

function commandAddForm(msg, match) {
  debug(match)
  let url = match['input'].split(' ')[1]
  if (url == undefined) {
    sendMessage(msg.from.id, 'You need to define url for your form')
    return
  }
  let formId = nanoid(12)
  let confirmMsg = `Site:  ${url}\nFormID: ${formId}`
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
    }).catch(err => { debug('Err', err); sendMessage('Our servers not available right now. Please try again later.') })
}


// function commandSetEmail(msg, match) {
//   let email = match['input'].split(' ')[1]
//   if (email == undefined) {
//     sendMessage(msg.from.id, 'You need to define email after command')
//     return
//   }
//   // TODO Email check
//   db.user.updateFields(msg.from.id, { email })
// }

function commandSetPassword(msg, match) {
  let password = match['input'].split(' ')[1]
  if (password == undefined) {
    sendMessage(msg.from.id, 'You need to define password after command')
    return
  } else {
    let password_hash = bcrypt.hashSync(password, 8)
    db.user.updateFields(msg.from.id, { password_hash })
    sendMessage(msg.from.id, 'Your password has been updated.')
  }

}

function onPollingError(error) {
  debug(error)
}


let sendMessage = (id, message) => {
  bot
    .sendMessage(id, message)
    .catch((error) => {
      debug(error.code)
      debug(error.response.body)
    })
}

