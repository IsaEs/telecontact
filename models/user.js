'use strict'
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: false, },
    first_name: DataTypes.STRING,
    username: { type: DataTypes.STRING, unique: true },
    language_code: DataTypes.STRING,
    email: DataTypes.STRING,
    password_hash: DataTypes.STRING,
    isDeleted: DataTypes.BOOLEAN
  }, {})
  user.associate = function () {
    // associations can be defined here
  }
  return user
}



