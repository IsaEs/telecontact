'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class profile extends Model {
    static associate(models) {
      profile.belongsTo(models.user, { foreignKey: 'userId', targetKey: 'id' })
    }
  }
  profile.init({
    id:{ type: DataTypes.INTEGER, primaryKey: true},
    userId: DataTypes.INTEGER,
    first_name: DataTypes.STRING,
    username: DataTypes.STRING,
    photo_url: DataTypes.STRING,
    provider: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'profile',
  })
  return profile
}