const dotnev = require('dotenv')
dotnev.config()

let db_config = {
  'username': 'isaes',
  'password': 'klmnbh123',
  'database': 'teleform-db',
  'options': {
    'host': '127.0.0.1',
    'dialect': 'postgres'
  }
}

exports.db_config = db_config
