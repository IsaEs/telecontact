let express = require('express')
let router = express.Router()
let db = require('../models/index')
const { createHash, createHmac } = require('crypto')
const debug = require('debug')('app:routes:signin')
const bcrypt = require('bcrypt')

let user_signin = async (req, res) => {
  debug(req.body)
  if(req.body.type==='telegram'){
    return telegram_login(req,res)
  }
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


function telegram_login(req,res){
  const secret = createHash('sha256')
    .update(process.env.TELEGRAM_TOKEN)
    .digest()
  debug(req.user)
  if (checkSignature(req.body.user)){
    if(req.user===403){
      //TODO sign up send password  // No telegram login for now
    } else{
      //Check and assoc with current user
      debug('Assoc')
    }
    res.status(200).json({message: 'Data From telegram'})
  }else {
    res.status(400).json({message: 'We could verify your data comes from telegram.'})
  }

  function checkSignature ({ hash, ...data }) {
    debug(data)
    const checkString = Object.keys(data)
      .sort()
      .map(k => (`${k}=${data[k]}`))
      .join('\n')
    const hmac = createHmac('sha256', secret)
      .update(checkString)
      .digest('hex')
    return hmac === hash
  }
}

let user_signup = (req,res) => {
  if (!req.body.email && !req.body.password) {
    res.status(500).send({ error: 'You have to set the email or username.' })
    return
  }

  let password_hash = bcrypt.hashSync(req.body.password, 8)
  
  db
    .user
    .create({
      email: req.body.email,
      password_hash
    }).then(async (user)=>{
      let result = await user.authorize()
      res.send(result)
    }).catch((err) => {
      if (err.name === 'SequelizeUniqueConstraintError'){
        res.status(200).send({ msg: 'Already registerd with this email!' })
      }else{
        debug(err)
        res.status(200).send({ msg: 'Error while adding ' })
      }   
    })

}
router.post('/signin', user_signin)
router.post('/signup', user_signup)

module.exports = router