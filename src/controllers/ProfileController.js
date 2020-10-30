let db = require('../models/index')
const debug = require('debug')('app:routes:main')
const { mailer } = require('../lib')
const { nanoid } = require('nanoid')

let updateEmail = (req, res) => {
  debug(req.user)
  if (!req.body.email) {
    res.status(500).send({ error: 'You have to set the email or username.' })
    return
  }
  //TODO check email is valid or not
  let mailToken = nanoid(6)
  const mailOptions = {
    from: 'Telecontact <no-reply@telecontact.me>',
    to: req.body.email,
    subject: 'Verify your email!',
    text: `Enter this code to  ${mailToken} verify your email address`,
    html: `Enter this code to <b>${mailToken}</b> verify your email address.`
  }
  mailer.sendMail(mailOptions)

  let email = req.body.email
  let isEmailVerified = false
  db.user.updateFields(req.user.id, { email, isEmailVerified, mailToken })
  res.status(200).send({ msg: 'Email Updated' })
}

let getProfile = async (req, res) => {
  try {
    let profile = await db.user.findOne({
      where: { id: req.user.id },
      include:[{
        model:db.website,
        include:[{
          model:db.preference,
          as:'preference',
          attributes: ['sendMail','saveMessage']
        }],
        attributes:{exclude: ['userId','createdAt', 'updatedAt']},
        as:'websites'
      }],
      attributes: { exclude: ['password_hash','mailToken','createdAt', 'updatedAt'] }
    })
    res.status(200).json(profile)
  } catch (error) {
    debug(error)
    res.status(500).send({ msg: 'Error while deleting and object' })
  }
}

exports.getProfile = getProfile
exports.updateEmail = updateEmail