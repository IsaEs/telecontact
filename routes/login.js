let express = require('express')
let router = express.Router()
let db = require('../models/index')
const debug = require('debug')('app:routes:signin')


let user_signin = async (req, res) => {
  debug(req.body)
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


router.post('/signin', user_signin)

module.exports = router