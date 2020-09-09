let express = require('express')
let router = express.Router()
let db = require('../models/index')
//const debug = require('debug')('app:routes:user')
const dbody = require('debug')('app:routes:dbody:user')


let user_login = async (req, res) => {
  dbody(req.body)
  if (!req.body.email && !req.body.username) {
    res.status(500).send({ error: 'You have to set the email or username.' })
    return
  }
  if (!req.body.password) {
    res.status(500).send({ error: 'You have to set your password.' })
    return
  }
  let where

  if (req.body.email) {
    where = {
      email: req.body.email,
      isDeleted: false
    }
  } else if (req.body.username) {
    where = {
      username: req.body.username,
      isDeleted: false
    }
  }

  try {
    return res.json(await db.user.authenticate(where, req.body.password))
  } catch (err) {
    console.log(err)
    return res.status(400).json({ error: 'Invalid username or password' })
  }
}


router.post('/login', user_login)

// let getUserMessages = ()=> {} //TODO
// let updateUserPreferences = ()=>{} // TODO
// router.get('/messages', getUserMessages)
// router.put('/preferences', updateUserPreferences)

module.exports = router