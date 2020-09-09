'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class preference extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      preference.belongsTo(models.user, { foreignKey: 'userId', targetKey: 'id' })
      preference.belongsTo(models.website, { foreignKey: 'formId', targetKey: 'formId' })
    }
  }
  preference.init({
    sendMail: { type: DataTypes.BOOLEAN, defaultValue: false },
    saveMessage: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {
    sequelize,
    modelName: 'preference',
  })
  return preference
}