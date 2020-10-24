'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class message extends Model {
    static associate(models) {
      message.belongsTo(models.user, { foreignKey: 'userId', targetKey: 'id' })
      message.belongsTo(models.website, { foreignKey: 'formId', targetKey: 'formId' })
    }
  }
  message.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    message: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'message',
  })
  return message
}