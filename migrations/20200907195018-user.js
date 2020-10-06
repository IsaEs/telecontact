'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: { type: Sequelize.INTEGER, primaryKey: true, unique: true, autoIncrement: true },
      first_name: Sequelize.STRING,
      last_name: Sequelize.STRING,
      telegramId:  { type: Sequelize.INTEGER, primaryKey: true,unique: true,defaultValue:-1 },
      username: { type: Sequelize.STRING, unique: true },
      language_code: Sequelize.STRING,
      photo_url: Sequelize.STRING,
      email: {type: Sequelize.STRING, unique: true },
      password_hash: Sequelize.STRING,
      isDeleted: { type: Sequelize.BOOLEAN, defaultValue: false },
      isEmailVerified: { type: Sequelize.BOOLEAN, defaultValue: false },
      mailToken: { type: Sequelize.STRING(6) },
      updatedAt: Sequelize.DATE,
      createdAt: Sequelize.DATE
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('users')
  }
}
