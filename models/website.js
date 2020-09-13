'use strict'
module.exports = (sequelize, DataTypes) => {
  const website = sequelize.define('website', {
    url: { type: DataTypes.STRING, uniqe: true },
    formId: { type: DataTypes.STRING(12), primaryKey: true },
    userId: DataTypes.INTEGER,
    messageCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  }, {})
  website.associate = function (models) {
    website.belongsTo(models.user, { foreignKey: 'userId', targetKey: 'id' })
    website.hasOne(models.preference, { foreignKey: 'formId', targetKey: 'formId' })
  }
  return website
}



