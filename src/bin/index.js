#!/usr/bin/env node
const dotnev = require('dotenv')
dotnev.config()
process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const debug = require('debug')('app:www')
const app = require('../app')
require('../extensions/contactbot/app')
const http = require('http')

function start(port) {
  server.listen(port)
  server.on('error', onError)
  server.on('listening', onListening)
  debug(`Server started to listen on ${port}`)
}

function normalizePort(val) {
  let port = parseInt(val, 10)

  if (isNaN(port)) {
    return val
  }

  if (port >= 0) {
    return port
  }

  return false
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

function onListening() {
  let addr = server.address()
  let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  debug('Listening on ' + bind)
}


let port = normalizePort(process.env.PORT || '5000')
app.set('port', port)
let server = http.createServer(app)
start(port)
