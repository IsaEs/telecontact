'use strict'
module.exports = (sequelize, DataTypes) => {
  const website = sequelize.define('website', {
    url: { type: DataTypes.STRING, uniqe: true },
    domainName: { type: DataTypes.STRING },
    formId: { type: DataTypes.STRING(12), primaryKey: true },
    userId: DataTypes.INTEGER,
    messageCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  }, {})
  website.associate = function (models) {
    website.belongsTo(models.user, { foreignKey: 'userId', targetKey: 'id' })
    website.belongsTo(models.user, { foreignKey: 'telegramId', targetKey: 'telegramId' })
    website.hasOne(models.preference, { foreignKey: 'formId', targetKey: 'formId' })
    website.hasMany(models.message, { foreignKey: 'formId', targetKey: 'formId' })
  }
  return website
}



