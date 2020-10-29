let db = require('../models/index')
const { checkSignature } = require('../lib') 
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
  
  debug(req.user)
  if (checkSignature(req.body.user,process.env.TELEGRAM_TOKEN)){
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

exports.user_signin = user_signin
exports.user_signup = user_signup 