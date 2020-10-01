const jwt = require('jsonwebtoken')
const debug = require('debug')('app:mwares:validate')

exports.verify = (req, res, next) => {
  const bearerHeader = req.headers['authorization']
  debug('Verify:')
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ')
    const bearerToken = bearer[1]
    const token = bearerToken.replace(/"/g, '')
    debug('Bearer:', bearerToken)
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, data) => {
      if (err) {
        debug(err)
        req.user = 403
        next()
      } else {
        req.user = data.user
        next()
      }
    })
  } else {
    req.user = 403
    next()
  }
}

exports.block = (req, res, next) => {
  if (req.user===403){
    res.sendStatus(403)
  }else{
    next()
  }
}