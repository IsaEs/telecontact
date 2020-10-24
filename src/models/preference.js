'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class preference extends Model {
    static associate(models) {
      preference.belongsTo(models.user, { foreignKey: 'userId', targetKey: 'id' })
      preference.belongsTo(models.website, { foreignKey: 'formId', targetKey: 'formId' })
    }
  }
  preference.init({
    userId: { type: DataTypes.INTEGER, primaryKey: true },
    formId: { type: DataTypes.UUID, primaryKey: true },
    sendMail: { type: DataTypes.BOOLEAN, defaultValue: false },
    saveMessage: { type: DataTypes.BOOLEAN, defaultValue: false },
    tNotification: {type: DataTypes.BOOLEAN, defaultValue: false}
  }, {
    sequelize,
    modelName: 'preference',
  })
  return preference
}