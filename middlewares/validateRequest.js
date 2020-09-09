const jwt = require('jsonwebtoken')
const debug = require('debug')('app:mwares:validate')

let verify = (req, res, next) => {
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
        res.sendStatus(403)
      } else {
        req.user = data.user
        next()
      }
    })
  } else {
    res.sendStatus(403)
  }
}

module.exports = verify