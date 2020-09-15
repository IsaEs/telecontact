
const { nanoid } = require('nanoid')
const db = require('../models/index')
const { bot, formattedTime } = require('../lib')
const debug = require('debug')('app:events:bot')
const bcrypt = require('bcrypt')

bot.on('message', onMessage)
bot.on('polling_error', onPollingError)
bot.onText(/\/start/, commandStart)
bot.onText(/\/addform/, commandAddForm)
bot.onText(/\/listform/, commandListForm)
//bot.onText(/\/setemail/, commandSetEmail)
bot.onText(/\/verifyemail/, commandVerifyEmail)
bot.onText(/\/setpassword/, commandSetPassword)
bot.onText(/\/help/, commandHelp)

function onMessage(msg) {
  debug(`[${formattedTime(msg.date)}] Message (${msg.message_id}) received from @${msg.from.username} (${msg.from.id})`)
  //debug(msg)
}

function commandListForm(msg, match) {
  debug('Match', match)
  db
    .website
    .findAll({ where: { userId: msg.from.id } })
    .then(websites => {
      debug('Forms: ', websites)
      let sites = 'You did\'not set any form yet'
      if (websites != null & websites.length != 0) {
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
  let userId = msg.from.id
  let url = match['input'].split(' ')[1]
  if (url == undefined) {
    sendMessage(userId, 'You need to define url for your form')
    return
  }
  let formId = nanoid(12)
  let confirmMsg = `Site:  ${url}\nFormID: ${formId}`
  db
    .user
    .findOne({ where: { id: userId } })
    .then(user => {
      debug(user)
      if (user == null) {
        db
          .user
          .create({
            id: userId,
            first_name: msg.from.first_name,
            username: msg.from.username,
            language_code: msg.from.language_code,
            email: '',
            password_hash: '',
            isDeleted: false
          })
          .then(() => {
            createWebsiteAndPreference()
          })
      } else {
        createWebsiteAndPreference()
      }
      return
    }).catch(err => { debug('Err', err); sendMessage('Our servers not available right now. Please try again later.') })

  function createWebsiteAndPreference() {
    db.website
      .create({ url, formId, userId })
      .then(() => {
        db.preference.create({ formId, userId })
        sendMessage(msg.chat.id, confirmMsg)
      })
      .catch((err) => {
        debug(err)
        sendMessage(msg.chat.id, 'You have already add this url!')
      })
  }
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

function commandVerifyEmail(msg, match) {
  let mailToken = match['input'].split(' ')[1]
  if (mailToken == undefined) {
    sendMessage(msg.from.id, 'You need to define verification code after command')
    return
  } else {
    db.user
      .findOne({ where: { id: msg.from.id } })
      .then((user) => {
        debug(JSON.stringify(user))
        if (user.mailToken != null && user.mailToken == mailToken) {
          sendMessage(msg.from.id, 'Your email is verified.')
          user.update({ isEmailVerified: true, mailToken: null })
        } else {
          sendMessage(msg.from.id, 'We couldn\'t verified your mail.')
        }
      })

  }
}


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

//TODO commandStart and commandHelp
function commandStart(msg, match) {
  debug('Match', match)
  let welcome = 'Welcome to our bot.'
  sendMessage(msg.chat.id, welcome)
}

function commandHelp(msg, match) {
  debug('Match', match)
  let welcome = 'TODO Help Message.'
  sendMessage(msg.chat.id, welcome)
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

