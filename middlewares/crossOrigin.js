// Allow Cross Origin
let allowCors = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With,Authorization,Content-type,Accept,X-Access-Token,X-Key,Device-Id'
  )
  //TODO Origin referer CRSF use cors module or implement?
  if (req.method === 'OPTIONS') {
    res.status(200).end()
  } else {
    next()
  }
}

module.exports = allowCors
