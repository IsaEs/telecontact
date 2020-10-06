const debug = require('debug')('app:models:user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    telegramId:  { type: DataTypes.INTEGER, primaryKey: true },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    username: { type: DataTypes.STRING, unique: true },
    language_code: DataTypes.STRING,
    photo_url: DataTypes.STRING,
    email: {type: DataTypes.STRING, unique: true },
    password_hash: DataTypes.STRING,
    isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    isEmailVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    mailToken: { type: DataTypes.STRING(6) },
  }, {})

  user.associate = function (models) {
    user.hasMany(models.website, { foreignKey: 'userId', targetKey: 'id' })
    user.hasMany(models.preference, { foreignKey: 'userId', targetKey: 'id' })
  }


  user.authenticate = async function (where, password) {
    debug('Where', where)
    let attributes = { exclude: ['createdAt', 'updatedAt'] }
    const current_user = await user.findOne({ where, attributes })
    debug('Authenticate: ', current_user)
    if (current_user !== null) {
      if (bcrypt.compareSync(password, current_user.password_hash)) {
        debug('Password correct!')
        return current_user.authorize()
      } else {
        return { status: 401, error: 'Invalid username or password' }
      }
    } else {
      return { status: 404, error: 'No such a user!' }
    }
  }

  user.updateFields = function (id, fields) {
    user
      .findOne({ where: { id } })
      .then((result) => {
        result.update(fields)
      })
  }

  user.prototype.authorize = async function () {
    debug('Authenticate...', process.env.JWT_SECRET_KEY)
    const user = this.dataValues
    delete user['password_hash']
    delete user['isDeleted']
    debug('User :', user)
    const access_token = 'user' //AccessToken
    const token_type = 'jwt' //Type
    const expiresIn = 1000 * 60 * 60 * 24 * 15 //15 day
    const expiresAt = new Date(Date.now() + expiresIn) //Experies At
    const token = await jwt.sign(
      { access_token, user, token_type, expiresIn, expiresAt },
      process.env.JWT_SECRET_KEY,
      { expiresIn }
    )
    debug('Token', token)
    return { status: 200, token }
  }

  return user
}



