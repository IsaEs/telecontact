'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: { type: Sequelize.INTEGER, primaryKey: true, unique: true, autoIncrement: false },
      first_name: Sequelize.STRING,
      username: { type: Sequelize.STRING, unique: true },
      language_code: Sequelize.STRING,
      email: Sequelize.STRING,
      password_hash: Sequelize.STRING,
      isDeleted: Sequelize.BOOLEAN,
      updatedAt: Sequelize.DATE,
      createdAt: Sequelize.DATE
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('users')
  }
}
