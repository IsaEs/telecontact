'use strict'
module.exports = (sequelize, DataTypes) => {
  const website = sequelize.define('website', {
    url: { type: DataTypes.STRING },
    formId: { type: DataTypes.UUID, primaryKey: true },
    userId: DataTypes.INTEGER
  }, {})
  website.associate = function (models) {
    website.belongsTo(models.user, { foreignKey: 'userId', targetKey: 'id' })
  }
  return website
}



