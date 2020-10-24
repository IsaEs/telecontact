let express = require('express')
let router = express.Router()

let healtcheck = (req,res) =>{
  //TODO db adn service healtcheks
  res.json({'date': new Date()})
}
router.get('/healtcheck', healtcheck)
module.exports = router