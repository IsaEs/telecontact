
const { nanoid } = require('nanoid')
const db = require('../../models/index')
const { formattedTime } = require('../../lib')
const debug = require('debug')('app:extensions:contactbot')
const bcrypt = require('bcrypt')
const bot = require('./index')

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
          let message = `<b>Site:</b>  ${record.url}\n<b>FormID:</b> ${record.formId}\n`
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
  let welcome = `
<b>Welcome to telecontact.me</b> 🎊
Managing your contact forms will be easy now.\n
For detailed information about how to use this bot.
Please visit telecontact.me/help.
`
  sendMessage(msg.chat.id, welcome)
}

function commandHelp(msg, match) {
  debug('Match', match)
  let message = `
Visit www.telecontact.me/help for more information.
• <i><b>I created form how can i use it?</b></i>
- Visit www.telecontact.me/help
• <i><b>How many forms I can able to create?</b></i>
- You are allowed to create three form. (From bot)
• <i><b>I want to delete my form. How can I delete it?</b></i>
- You can manage your forms messages and other settings from web admin app.telecontact.me
• <i><b>How can I login to Web admin ?</b></i>
You can use web admin with setting up your password  with /setpassword from bot. After the succesfuly set your password. You can login telecontact.me with your telegram username and with this password.
`

  sendMessage(msg.chat.id, message)
}


function onPollingError(error) {
  debug(error)
}


let sendMessage = (id, message) => {
  bot
    .sendMessage(id, message,{parse_mode : 'HTML'})
    .catch((error) => {
      debug(error.code)
      debug(error.response.body)
    })
}

